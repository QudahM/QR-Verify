import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface ScanEvent {
  qr_code_id: string;
  user_agent?: string;
  ip_address?: string;
  session_id: string;
  scanned_at: string;
}

// Generate a unique session ID
function generateSessionId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 11);
  return `${timestamp}-${randomString}`;
}

// Extract IP address from headers
function getClientIP(request: Request): string | null {
  // Try x-forwarded-for first (most common for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  // Fallback to other common headers
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return null;
}

// Validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return new Response('Internal server error', {
        status: 500,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse URL to extract qrCodeId
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    
    // Expected path: /functions/v1/track-scan/{qrCodeId}
    const qrCodeId = pathParts[pathParts.length - 1];

    // Validate qrCodeId
    if (!qrCodeId || !isValidUUID(qrCodeId)) {
      return new Response('Invalid QR code ID', {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Extract redirect URL from query parameters
    const redirectUrl = url.searchParams.get('redirect') || 'https://qr-nexus.com';

    // Validate redirect URL
    let validRedirectUrl: string;
    try {
      const parsedRedirect = new URL(redirectUrl);
      validRedirectUrl = parsedRedirect.toString();
    } catch {
      // If redirect URL is invalid, use fallback
      validRedirectUrl = 'https://qr-nexus.com';
    }

    // Extract scan event data
    const userAgent = req.headers.get('user-agent') || undefined;
    const ipAddress = getClientIP(req);
    const sessionId = generateSessionId();
    const scannedAt = new Date().toISOString();

    // Prepare scan event data
    const scanEvent: ScanEvent = {
      qr_code_id: qrCodeId,
      user_agent: userAgent,
      ip_address: ipAddress || undefined,
      session_id: sessionId,
      scanned_at: scannedAt,
    };

    // Log scan event to database (fire and forget for performance)
    const logPromise = supabase
      .from('qr_scans')
      .insert({
        qr_code_id: scanEvent.qr_code_id,
        user_agent: scanEvent.user_agent,
        ip_address: scanEvent.ip_address,
        session_id: scanEvent.session_id,
        scanned_at: scanEvent.scanned_at,
      });

    // Don't wait for the database insert to complete - redirect immediately
    // Use EdgeRuntime.waitUntil to ensure the logging completes in the background
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(
        logPromise.then(({ error }) => {
          if (error) {
            console.error('Failed to log scan event:', error);
          } else {
            console.log('Scan event logged successfully:', scanEvent);
          }
        })
      );
    } else {
      // Fallback for environments without EdgeRuntime.waitUntil
      logPromise.then(({ error }) => {
        if (error) {
          console.error('Failed to log scan event:', error);
        }
      }).catch(console.error);
    }

    // Immediate redirect response
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': validRedirectUrl,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error in track-scan function:', error);
    
    // Even if there's an error, try to redirect to fallback URL
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': 'https://qr-nexus.com',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
});