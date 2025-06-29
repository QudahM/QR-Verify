import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, BarChart3, Shield, AlertTriangle, QrCode } from 'lucide-react';
import { logScanEvent, generateSessionId, getUserLocation } from '../lib/qrTracker';
import { supabase } from '../lib/supabase';

const TrackingPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleTracking = async () => {
      if (!qrCodeId) {
        setError('Invalid QR code ID');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Tracking QR code:', qrCodeId);

        // Get QR code data
        const { data: qrCode, error: qrError } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('id', qrCodeId)
          .single();

        if (qrError) {
          console.error('QR code query error:', qrError);
          setError('QR code not found');
          setIsLoading(false);
          return;
        }

        if (!qrCode) {
          console.error('QR code not found in database');
          setError('QR code not found');
          setIsLoading(false);
          return;
        }

        console.log('Found QR code:', qrCode);
        setQrCodeData(qrCode);

        // Get redirect URL from query params or use QR code content
        const redirectParam = searchParams.get('redirect');
        const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : qrCode.content;
        setRedirectUrl(targetUrl);

        console.log('Target URL:', targetUrl);

        // Log scan event
        const sessionId = generateSessionId();
        const location = await getUserLocation();
        
        console.log('Logging scan event...');
        await logScanEvent({
          qr_code_id: qrCodeId,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          location,
          session_id: sessionId,
        });

        console.log('Scan event logged successfully');
        setIsLoading(false);

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                window.location.href = targetUrl;
              } else {
                // For non-URL content, just show it
                clearInterval(timer);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error('Error handling tracking:', error);
        setError('Failed to process QR code scan');
        setIsLoading(false);
      }
    };

    handleTracking();
  }, [qrCodeId, searchParams]);

  const handleManualRedirect = () => {
    if (redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://'))) {
      window.location.href = redirectUrl;
    }
  };

  const isUrl = redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://'));

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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="glass bg-glass-bg/90 border border-glass-border rounded-2xl shadow-glass p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-xl font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
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
            Your scan has been recorded. {isUrl ? 'Redirecting you to the destination...' : 'Content decoded successfully.'}
          </p>

          {/* Content Display */}
          <div className="bg-surface/50 rounded-xl p-6 mb-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <QrCode className="w-5 h-5 text-info" strokeWidth={1.5} />
              <div className="text-left flex-1">
                <h4 className="text-sm font-medium text-info">QR Code Content</h4>
                <p className="text-xs text-info/80 break-all">{redirectUrl}</p>
              </div>
            </div>
          </div>

          {/* Countdown for URLs */}
          {isUrl && countdown > 0 && (
            <div className="bg-surface/50 rounded-xl p-6 mb-8 border border-border">
              <div className="text-4xl font-bold text-primary mb-2">{countdown}</div>
              <p className="text-sm text-muted-foreground">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Manual Redirect Button for URLs */}
          {isUrl && (
            <button
              onClick={handleManualRedirect}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 mb-4"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              <span>Go Now</span>
            </button>
          )}

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
                Total scans: {(qrCodeData.scan_count || 0) + 1}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;