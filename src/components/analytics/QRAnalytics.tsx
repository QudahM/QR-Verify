import React, { useState, useEffect } from 'react';
import { BarChart3, RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { getScanAnalytics, getDailyScanData, subscribeToScanEvents, ScanAnalytics, DailyScanData } from '../../lib/qrTracker';
import ScanStats from './ScanStats';
import ScanChart from './ScanChart';

interface QRAnalyticsProps {
  qrCodeId: string;
  qrCodeContent: string;
}

const QRAnalytics: React.FC<QRAnalyticsProps> = ({ qrCodeId, qrCodeContent }) => {
  const [analytics, setAnalytics] = useState<ScanAnalytics | null>(null);
  const [dailyData, setDailyData] = useState<DailyScanData[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyScanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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

      {/* QR Code Info */}
      <div className="bg-surface/50 rounded-xl p-4 border border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-info" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-foreground mb-1">QR Code Content</h5>
            <p className="text-xs text-muted-foreground break-all">{qrCodeContent}</p>
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