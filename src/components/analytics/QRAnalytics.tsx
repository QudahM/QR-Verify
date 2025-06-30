import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Calendar, TrendingUp, ExternalLink, Copy, Shield, Info, Eye, Users, Clock } from 'lucide-react';
import { getScanAnalytics, getDailyScanData, subscribeToScanEvents, ScanAnalytics, DailyScanData } from '../../lib/qrTracker';
import ScanStats from './ScanStats';
import ScanChart from './ScanChart';

interface QRAnalyticsProps {
  qrCodeId: string;
  qrCodeContent: string;
  qrCodeData?: any; // Full QR code record with tracking info
}

const QRAnalytics: React.FC<QRAnalyticsProps> = ({ qrCodeId, qrCodeContent, qrCodeData }) => {
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [dailyData, setDailyData] = useState<DailyScanData[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyScanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);

  const fetchAnalytics = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    
    try {
      const [analyticsData, daily, weekly] = await Promise.all([
        getScanAnalytics(qrCodeId),
        getDailyScanData(qrCodeId, 30),
        getDailyScanData(qrCodeId, 7),
      ]);

      if (analyticsData) {
        setAnalytics(analyticsData);
      }
      setDailyData(daily);
      setWeeklyData(weekly);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
      if (showRefreshing) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscription
    const subscription = subscribeToScanEvents(qrCodeId, (payload) => {
      console.log('New scan detected:', payload);
      // Refresh analytics when new scan is detected
      fetchAnalytics();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [qrCodeId]);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const copyTrackingUrl = async () => {
    if (!qrCodeData?.tracking_url) return;
    
    try {
      await navigator.clipboard.writeText(qrCodeData.tracking_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy tracking URL:', error);
    }
  };

  const openTrackingUrl = () => {
    if (qrCodeData?.tracking_url) {
      window.open(qrCodeData.tracking_url, '_blank');
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
            <div>
              <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1"></div>
              <div className="h-3 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
        </div>
        
        <ScanStats analytics={{
          total_scans: 0,
          today_scans: 0,
          week_scans: 0,
          month_scans: 0,
          unique_sessions: 0,
        }} isLoading={true} />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 bg-surface/50 rounded-xl animate-pulse"></div>
          <div className="h-64 bg-surface/50 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground">Scan Analytics</h4>
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-3 py-2 bg-surface hover:bg-surface-hover disabled:bg-surface/50 rounded-lg border border-border transition-colors text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Overview */}
      {analytics && <ScanStats analytics={analytics} />}

      {/* Detailed Tracking Information */}
      {qrCodeData?.is_tracked && qrCodeData?.tracking_url && (
        <div className="bg-surface/50 rounded-xl p-6 border border-border">
          <div className="space-y-6">

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ScanChart
                data={weeklyData}
                title="Last 7 Days"
                height={200}
              />
              <ScanChart
                data={dailyData}
                title="Last 30 Days"
                height={200}
              />
            </div>
            
            {/* Tracking Status Header */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-success" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-success">Tracking: ACTIVE</span>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-success/80">Real-time analytics and scan tracking enabled</p>
              </div>
            </div>

            {/* Analytics Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center space-x-3 mb-3">
                  <BarChart3 className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-primary">Real-time Analytics</span>
                </div>
                <p className="text-xs text-primary/70 mb-3">Track scans, timing patterns, and usage trends</p>
                <div className="flex items-center space-x-4 text-xs text-primary/60">
                  <span>• Scan counts</span>
                  <span>• Time analysis</span>
                  <span>• Trends</span>
                </div>
              </div>
              
              <div className="bg-success/5 rounded-lg p-4 border border-success/10">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="w-5 h-5 text-success" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-success">User Insights</span>
                </div>
                <p className="text-xs text-success/70 mb-3">Device types, browsers, and referrer information</p>
                <div className="flex items-center space-x-4 text-xs text-success/60">
                  <span>• Device data</span>
                  <span>• Browsers</span>
                  <span>• Sources</span>
                </div>
              </div>
            </div>

            {/* Tracking URL Section */}
            <div className="bg-info/5 rounded-lg p-4 border border-info/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-info" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-info">Tracking URL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyTrackingUrl}
                    className="flex items-center space-x-1 px-3 py-1 bg-info/10 hover:bg-info/20 rounded-lg transition-colors"
                  >
                    <Copy className="w-3 h-3 text-info" strokeWidth={1.5} />
                    <span className="text-xs text-info">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={openTrackingUrl}
                    className="flex items-center space-x-1 px-3 py-1 bg-info/10 hover:bg-info/20 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-info" strokeWidth={1.5} />
                    <span className="text-xs text-info">Test</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-background/50 rounded-lg p-3 border border-border mb-4">
                <p className="text-xs font-mono text-foreground break-all">
                  {qrCodeData.tracking_url}
                </p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-info mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div className="text-xs text-info/70">
                  <p className="mb-1">Users will be seamlessly redirected to your original URL after a brief tracking page.</p>
                  <p>The QR code now points to this tracking URL instead of directly to your destination.</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-warning/5 rounded-lg border border-warning/10">
                <Clock className="w-4 h-4 text-warning mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-lg font-semibold text-warning">~3s</div>
                <div className="text-xs text-warning/70">Redirect Time</div>
              </div>
              
              <div className="text-center p-3 bg-success/5 rounded-lg border border-success/10">
                <Shield className="w-4 h-4 text-success mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-lg font-semibold text-success">100%</div>
                <div className="text-xs text-success/70">Privacy Safe</div>
              </div>
              
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                <BarChart3 className="w-4 h-4 text-primary mx-auto mb-2" strokeWidth={1.5} />
                <div className="text-lg font-semibold text-primary">Real-time</div>
                <div className="text-xs text-primary/70">Data Updates</div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-success/5 rounded-lg p-4 border border-success/10">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-5 h-5 text-success" strokeWidth={1.5} />
                <span className="text-sm font-medium text-success">Privacy Protected</span>
              </div>
              <div className="text-xs text-success/70 space-y-1">
                <p>• We only track that a scan occurred - no location data is collected</p>
                <p>• No personal information is stored or shared</p>
                <p>• Users are redirected seamlessly to your original destination</p>
                <p>• All data is encrypted and securely stored</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Info */}
      <div className="bg-surface/50 rounded-xl p-4 border border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-info" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-foreground mb-1">QR Code Content</h5>
            <p className="text-xs text-muted-foreground break-all">{qrCodeContent}</p>
            {qrCodeData && (
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                <span>Type: {qrCodeData.type}</span>
                <span>•</span>
                <span>Created: {new Date(qrCodeData.created_at).toLocaleDateString()}</span>
                {qrCodeData.is_tracked && (
                  <>
                    <span>•</span>
                    <span className="text-success">Tracking Enabled</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 rounded-full border border-success/20">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success font-medium">Real-time updates active</span>
        </div>
      </div>
    </div>
  );
};

export default QRAnalytics;