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

// Generate a tracking URL using the custom subdomain
export const generateTrackingUrl = (qrCodeId: string, originalUrl: string): string => {
  const trackingDomain = 'https://track.qrnexus.site';
  const encodedUrl = encodeURIComponent(originalUrl);
  return `${trackingDomain}/track/${qrCodeId}?redirect=${encodedUrl}`;
};

// Log a scan event with comprehensive metadata
export const logScanEvent = async (scanEvent: ScanEvent): Promise<void> => {
  try {
    // Get IP address from a service
    let ipAddress = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      console.log('Could not fetch IP address:', error);
    }

    const { error } = await supabase
      .from('qr_scans')
      .insert({
        qr_code_id: scanEvent.qr_code_id,
        user_agent: scanEvent.user_agent,
        ip_address: ipAddress,
        location: scanEvent.location,
        referrer: scanEvent.referrer,
        session_id: scanEvent.session_id,
        scanned_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging scan event:', error);
      throw error;
    }

    console.log('Scan event logged successfully');
  } catch (error) {
    console.error('Failed to log scan event:', error);
    throw error;
  }
};

// Get scan analytics for a QR code
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

// Get daily scan data for charts
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

// Update QR code with tracking URL
export const updateQRCodeWithTracking = async (qrCodeId: string, trackingUrl: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('qr_codes')
      .update({ tracking_url: trackingUrl })
      .eq('id', qrCodeId);

    if (error) {
      console.error('Error updating QR code with tracking URL:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to update QR code with tracking URL:', error);
    throw error;
  }
};

// Real-time subscription to scan events
export const subscribeToScanEvents = (qrCodeId: string, callback: (payload: any) => void) => {
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
      callback
    )
    .subscribe();
};

// Validate QR code exists and get its data
export const getQRCodeData = async (qrCodeId: string) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('id', qrCodeId)
      .single();

    if (error) {
      console.error('Error fetching QR code data:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch QR code data:', error);
    return null;
  }
};