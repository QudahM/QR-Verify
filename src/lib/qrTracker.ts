import { supabase } from './supabase';

export interface ScanEvent {
  qr_code_id: string;
  user_agent?: string;
  ip_address?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  referrer?: string;
  session_id: string;
}

export interface ScanAnalytics {
  total_scans: number;
  today_scans: number;
  week_scans: number;
  month_scans: number;
  unique_sessions: number;
}

export interface DailyScanData {
  scan_date: string;
  scan_count: number;
}

export interface QRCodeCreationResult {
  trackedId: string;
  originalId: string;
  trackingUrl: string;
}

// Generate a unique tracking URL for a QR code using custom subdomain
export const generateTrackingUrl = (qrCodeId: string, originalUrl: string): string => {
  const trackingDomain = 'https://track.qrnexus.site';
  const encodedUrl = encodeURIComponent(originalUrl);
  return `${trackingDomain}/track/${qrCodeId}?redirect=${encodedUrl}`;
};

// Create a tracked QR code record in Supabase
export const createTrackedQRCode = async (
  userId: string,
  content: string,
  type: 'text' | 'url',
  originalQRDataUrl: string
): Promise<QRCodeCreationResult | null> => {
  try {
    console.log('Creating tracked QR code:', { userId, content, type });

    const { data, error } = await supabase
      .rpc('create_tracked_qr_code', {
        p_user_id: userId,
        p_content: content,
        p_type: type,
        p_original_qr_data_url: originalQRDataUrl
      });

    if (error) {
      console.error('Error creating tracked QR code:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.error('No data returned from create_tracked_qr_code');
      return null;
    }

    const result = data[0];
    console.log('Tracked QR code created:', result);

    return {
      trackedId: result.tracked_id,
      originalId: result.original_id,
      trackingUrl: result.tracking_url
    };
  } catch (error) {
    console.error('Failed to create tracked QR code:', error);
    return null;
  }
};

// Update QR code with the final trackable QR image
export const updateQRCodeImage = async (qrCodeId: string, qrDataUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('qr_codes')
      .update({ qr_data_url: qrDataUrl })
      .eq('id', qrCodeId);

    if (error) {
      console.error('Error updating QR code image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to update QR code image:', error);
    return false;
  }
};

// Log a scan event with comprehensive metadata
export const logScanEvent = async (scanEvent: ScanEvent): Promise<boolean> => {
  try {
    console.log('Logging scan event:', scanEvent);
    
    const { data, error } = await supabase
      .from('qr_scans')
      .insert({
        qr_code_id: scanEvent.qr_code_id,
        user_agent: scanEvent.user_agent,
        ip_address: scanEvent.ip_address,
        location: scanEvent.location,
        referrer: scanEvent.referrer,
        session_id: scanEvent.session_id,
        scanned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging scan event:', error);
      return false;
    }

    console.log('Scan event logged successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to log scan event:', error);
    return false;
  }
};

// Get scan analytics for a QR code (only works for tracked QR codes)
export const getScanAnalytics = async (qrCodeId: string): Promise<ScanAnalytics | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_scan_summary', { qr_code_uuid: qrCodeId });

    if (error) {
      console.error('Error fetching scan analytics:', error);
      return null;
    }

    return data?.[0] || {
      total_scans: 0,
      today_scans: 0,
      week_scans: 0,
      month_scans: 0,
      unique_sessions: 0,
    };
  } catch (error) {
    console.error('Failed to fetch scan analytics:', error);
    return null;
  }
};

// Get daily scan data for charts (only works for tracked QR codes)
export const getDailyScanData = async (qrCodeId: string, daysBack: number = 30): Promise<DailyScanData[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_daily_scan_analytics', { 
        qr_code_uuid: qrCodeId, 
        days_back: daysBack 
      });

    if (error) {
      console.error('Error fetching daily scan data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch daily scan data:', error);
    return [];
  }
};

// Generate a unique session ID
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get user's IP address
export const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting user IP:', error);
    return null;
  }
};

// Get user's location (with permission)
export const getUserLocation = async (): Promise<{ city?: string; country?: string; latitude?: number; longitude?: number; } | null> => {
  try {
    // Try to get location from browser geolocation API
    if ('geolocation' in navigator) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Try to get city/country from coordinates using a reverse geocoding service
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const data = await response.json();
              
              resolve({
                city: data.city || data.locality,
                country: data.countryName,
                latitude,
                longitude,
              });
            } catch {
              resolve({ latitude, longitude });
            }
          },
          () => {
            // Fallback to IP-based location
            resolve(null);
          },
          { timeout: 5000 }
        );
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
};

// Real-time subscription to scan events for a specific QR code
export const subscribeToScanEvents = (qrCodeId: string, callback: (payload: any) => void) => {
  console.log('Setting up real-time subscription for QR code:', qrCodeId);
  
  return supabase
    .channel(`qr_scans:${qrCodeId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'qr_scans',
        filter: `qr_code_id=eq.${qrCodeId}`,
      },
      (payload) => {
        console.log('Real-time scan event received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });
};

// Real-time subscription to QR code updates (scan count changes)
export const subscribeToQRCodeUpdates = (userId: string, callback: (payload: any) => void) => {
  console.log('Setting up real-time subscription for QR code updates for user:', userId);
  
  return supabase
    .channel(`qr_codes_updates:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'qr_codes',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('Real-time QR code update received:', payload);
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log('QR codes subscription status:', status);
    });
};

// Validate QR code exists and get its data (works for both tracked and original IDs)
export const validateQRCode = async (qrCodeId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_qr_code_by_any_id', { p_qr_id: qrCodeId });

    if (error) {
      console.error('Error validating QR code:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Failed to validate QR code:', error);
    return null;
  }
};

// Get comprehensive scan metadata
export const getScanMetadata = async () => {
  const userAgent = navigator.userAgent;
  const referrer = document.referrer;
  const sessionId = generateSessionId();
  const ip = await getUserIP();
  const location = await getUserLocation();

  return {
    user_agent: userAgent,
    referrer: referrer || null,
    session_id: sessionId,
    ip_address: ip,
    location,
  };
};