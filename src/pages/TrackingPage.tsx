import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, BarChart3, Shield, AlertTriangle } from 'lucide-react';
import { logScanEvent, generateSessionId, getUserLocation } from '../lib/qrTracker';
import { supabase } from '../lib/supabase';

const TrackingPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleTracking = async () => {
      if (!qrCodeId) return;

      try {
        // Get QR code data
        const { data: qrCode, error } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('id', qrCodeId)
          .single();

        if (error || !qrCode) {
          console.error('QR code not found:', error);
          return;
        }

        setQrCodeData(qrCode);

        // Get redirect URL from query params or use QR code content
        const redirectParam = searchParams.get('redirect');
        const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : qrCode.content;
        setRedirectUrl(targetUrl);

        // Log scan event
        const sessionId = generateSessionId();
        const location = await getUserLocation();
        
        await logScanEvent({
          qr_code_id: qrCodeId,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          location,
          session_id: sessionId,
        });

        setIsLoading(false);

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              window.location.href = targetUrl;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('Error handling tracking:', error);
        setIsLoading(false);
      }
    };

    handleTracking();
  }, [qrCodeId, searchParams]);

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass bg-glass-bg/90 border border-glass-border rounded-2xl shadow-glass p-8 text-center">
          {/* Header */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-primary" strokeWidth={1.5} />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">QR Code Scanned</h1>
          <p className="text-muted-foreground mb-8">
            Your scan has been recorded. Redirecting you to the destination...
          </p>

          {/* Countdown */}
          <div className="bg-surface/50 rounded-xl p-6 mb-8 border border-border">
            <div className="text-4xl font-bold text-primary mb-2">{countdown}</div>
            <p className="text-sm text-muted-foreground">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}</p>
          </div>

          {/* Destination Info */}
          <div className="bg-info/10 rounded-xl p-4 mb-6 border border-info/20">
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-5 h-5 text-info" strokeWidth={1.5} />
              <div className="text-left flex-1">
                <h4 className="text-sm font-medium text-info">Destination</h4>
                <p className="text-xs text-info/80 break-all">{redirectUrl}</p>
              </div>
            </div>
          </div>

          {/* Manual Redirect Button */}
          <button
            onClick={handleManualRedirect}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 mb-4"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            <span>Go Now</span>
          </button>

          {/* Security Notice */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Shield className="w-3 h-3" strokeWidth={1.5} />
            <span>Secured by QR Nexus Analytics</span>
          </div>

          {/* QR Code Info */}
          {qrCodeData && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                QR Code created: {new Date(qrCodeData.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Total scans: {qrCodeData.scan_count + 1}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;