import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink, BarChart3, Shield, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { logScanEvent, validateQRCode, getScanMetadata } from '../lib/qrTracker';

interface TrackingState {
  status: 'loading' | 'success' | 'error' | 'redirecting';
  message: string;
  qrCodeData?: any;
  redirectUrl?: string;
  countdown?: number;
}

const TrackingPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<TrackingState>({
    status: 'loading',
    message: 'Processing your request...'
  });

  useEffect(() => {
    const handleTracking = async () => {
      if (!qrCodeId) {
        setState({
          status: 'error',
          message: 'Invalid QR code ID'
        });
        return;
      }

      try {
        console.log('Processing QR code scan for tracked ID:', qrCodeId);

        // Step 1: Validate QR code exists (this now works with both tracked and original IDs)
        const qrCodeData = await validateQRCode(qrCodeId);
        if (!qrCodeData) {
          setState({
            status: 'error',
            message: 'QR code not found or has been deleted'
          });
          return;
        }

        console.log('QR code validated:', qrCodeData);

        // Step 2: Only log scans for tracked QR codes (those with is_tracked = true)
        if (!qrCodeData.is_tracked) {
          setState({
            status: 'error',
            message: 'This QR code is not configured for tracking'
          });
          return;
        }

        // Step 3: Get redirect URL
        const redirectParam = searchParams.get('redirect');
        const targetUrl = redirectParam ? decodeURIComponent(redirectParam) : qrCodeData.content;
        
        if (!targetUrl) {
          setState({
            status: 'error',
            message: 'No destination URL found'
          });
          return;
        }

        console.log('Target URL:', targetUrl);

        // Step 4: Get scan metadata
        const metadata = await getScanMetadata();
        console.log('Scan metadata:', metadata);

        // Step 5: Log scan event using the tracked QR code ID
        const scanLogged = await logScanEvent({
          qr_code_id: qrCodeData.id, // Use the tracked QR code ID for analytics
          ...metadata,
        });

        if (!scanLogged) {
          console.warn('Failed to log scan event, but continuing with redirect');
        } else {
          console.log('Scan event logged successfully for tracked QR code:', qrCodeData.id);
        }

        // Step 6: Update state and start countdown
        setState({
          status: 'success',
          message: 'Scan recorded successfully',
          qrCodeData,
          redirectUrl: targetUrl,
          countdown: 3
        });

        // Step 7: Start countdown and redirect
        let timeLeft = 3;
        const timer = setInterval(() => {
          timeLeft--;
          if (timeLeft <= 0) {
            clearInterval(timer);
            setState(prev => ({ ...prev, status: 'redirecting', message: 'Redirecting now...' }));
            
            // Perform redirect
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 500);
          } else {
            setState(prev => ({ ...prev, countdown: timeLeft }));
          }
        }, 1000);

        return () => clearInterval(timer);

      } catch (error) {
        console.error('Error handling tracking:', error);
        setState({
          status: 'error',
          message: 'An unexpected error occurred while processing your request'
        });
      }
    };

    handleTracking();
  }, [qrCodeId, searchParams]);

  const handleManualRedirect = () => {
    if (state.redirectUrl) {
      setState(prev => ({ ...prev, status: 'redirecting', message: 'Redirecting now...' }));
      setTimeout(() => {
        window.location.href = state.redirectUrl!;
      }, 500);
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'loading':
        return <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-success" strokeWidth={1.5} />;
      case 'error':
        return <XCircle className="w-8 h-8 text-destructive" strokeWidth={1.5} />;
      case 'redirecting':
        return <div className="w-8 h-8 border-2 border-info border-t-transparent rounded-full animate-spin" />;
      default:
        return <BarChart3 className="w-8 h-8 text-primary" strokeWidth={1.5} />;
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'success':
        return 'border-success/30 bg-success/10';
      case 'error':
        return 'border-destructive/30 bg-destructive/10';
      case 'redirecting':
        return 'border-info/30 bg-info/10';
      default:
        return 'border-border bg-surface/50';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass bg-glass-bg/90 border border-glass-border rounded-2xl shadow-glass p-8 text-center">
          {/* Header */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            {getStatusIcon()}
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {state.status === 'loading' && 'Processing Scan'}
            {state.status === 'success' && 'QR Code Scanned'}
            {state.status === 'error' && 'Scan Failed'}
            {state.status === 'redirecting' && 'Redirecting'}
          </h1>
          
          <p className="text-muted-foreground mb-8">{state.message}</p>

          {/* Countdown */}
          {state.status === 'success' && state.countdown !== undefined && (
            <div className="bg-surface/50 rounded-xl p-6 mb-8 border border-border">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Clock className="w-5 h-5 text-primary" strokeWidth={1.5} />
                <span className="text-lg font-medium text-foreground">Redirecting in</span>
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{state.countdown}</div>
              <p className="text-sm text-muted-foreground">
                {state.countdown === 1 ? 'second' : 'seconds'}
              </p>
            </div>
          )}

          {/* Destination Info */}
          {state.redirectUrl && state.status !== 'error' && (
            <div className={`rounded-xl p-4 mb-6 border ${getStatusColor()}`}>
              <div className="flex items-center space-x-3">
                <ExternalLink className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                <div className="text-left flex-1">
                  <h4 className="text-sm font-medium text-foreground">Destination</h4>
                  <p className="text-xs text-muted-foreground break-all">{state.redirectUrl}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {state.status === 'success' && state.redirectUrl && (
            <button
              onClick={handleManualRedirect}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 mb-4"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              <span>Go Now</span>
            </button>
          )}

          {state.status === 'error' && (
            <button
              onClick={() => window.history.back()}
              className="w-full bg-muted hover:bg-muted/80 text-foreground py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 mb-4"
            >
              <span>Go Back</span>
            </button>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mb-4">
            <Shield className="w-3 h-3" strokeWidth={1.5} />
            <span>Secured by QR Nexus Analytics</span>
          </div>

          {/* QR Code Info */}
          {state.qrCodeData && (
            <div className="pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="block font-medium">Created</span>
                  <span>{new Date(state.qrCodeData.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block font-medium">Total Scans</span>
                  <span>{(state.qrCodeData.scan_count || 0) + 1}</span>
                </div>
              </div>
              {state.qrCodeData.is_tracked && (
                <div className="mt-3 text-xs text-success">
                  <div className="flex items-center justify-center space-x-1">
                    <BarChart3 className="w-3 h-3" strokeWidth={1.5} />
                    <span>Tracking ID: {state.qrCodeData.id.slice(0, 8)}...</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Debug Info (only in development) */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-4 border-t border-border text-left">
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer font-medium mb-2">Debug Info</summary>
                <pre className="bg-surface/50 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify({
                    qrCodeId,
                    redirectParam: searchParams.get('redirect'),
                    status: state.status,
                    isTracked: state.qrCodeData?.is_tracked,
                    trackedId: state.qrCodeData?.id,
                    originalId: state.qrCodeData?.original_qr_id,
                    userAgent: navigator.userAgent.substring(0, 50) + '...',
                    referrer: document.referrer || 'none',
                  }, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;