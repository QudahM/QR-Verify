import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, BarChart3, Shield, AlertTriangle, Clock, Globe } from 'lucide-react';
import { logScanEvent, generateSessionId, getUserLocation, getQRCodeData } from '../lib/qrTracker';

const TrackingPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string>('');
  const [scanLogged, setScanLogged] = useState(false);

  useEffect(() => {
    const handleTracking = async () => {
      if (!qrCodeId) {
        setError('Invalid QR code ID');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Processing QR code scan for ID:', qrCodeId);

        // Get QR code data
        const qrCode = await getQRCodeData(qrCodeId);

        if (!qrCode) {
          setError('QR code not found');
          setIsLoading(false);
          return;
        }

        setQrCodeData(qrCode);

        // Get redirect URL from query params or use QR code content
        const redirectParam = searchParams.get('redirect');
        const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : qrCode.content;
        
        // Validate URL
        if (!targetUrl) {
          setError('No destination URL found');
          setIsLoading(false);
          return;
        }

        setRedirectUrl(targetUrl);

        // Log scan event
        try {
          const sessionId = generateSessionId();
          const location = await getUserLocation();
          
          console.log('Logging scan event...');
          await logScanEvent({
            qr_code_id: qrCodeId,
            user_agent: navigator.userAgent,
            referrer: document.referrer || undefined,
            location,
            session_id: sessionId,
          });

          setScanLogged(true);
          console.log('Scan event logged successfully');
        } catch (scanError) {
          console.error('Failed to log scan event:', scanError);
          // Continue with redirect even if logging fails
        }

        setIsLoading(false);

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // Redirect to target URL
              window.location.href = targetUrl;
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
            {scanLogged ? 'Scan recorded successfully!' : 'Processing scan...'} Redirecting you to the destination...
          </p>

          {/* Countdown */}
          <div className="bg-surface/50 rounded-xl p-6 mb-8 border border-border">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
              <div className="text-4xl font-bold text-primary">{countdown}</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Destination Info */}
          <div className="bg-info/10 rounded-xl p-4 mb-6 border border-info/20">
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-info mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <div className="text-left flex-1">
                <h4 className="text-sm font-medium text-info mb-1">Destination</h4>
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
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-4">
            <Shield className="w-3 h-3" strokeWidth={1.5} />
            <span>Secured by QR Nexus Analytics</span>
          </div>

          {/* QR Code Info */}
          {qrCodeData && (
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="block">Created</span>
                  <span className="text-foreground font-medium">
                    {new Date(qrCodeData.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="block">Total Scans</span>
                  <span className="text-foreground font-medium">
                    {(qrCodeData.scan_count || 0) + 1}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scan Status */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2">
              {scanLogged ? (
                <>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success">Scan logged successfully</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  <span className="text-xs text-warning">Processing scan...</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;