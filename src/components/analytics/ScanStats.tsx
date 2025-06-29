import React from 'react';
import { Eye, TrendingUp, Users, Calendar } from 'lucide-react';
import { ScanAnalytics } from '../../lib/qrTracker';

interface ScanStatsProps {
  analytics: ScanAnalytics;
  isLoading?: boolean;
}

const ScanStats: React.FC<ScanStatsProps> = ({ analytics, isLoading }) => {
  const stats = [
    {
      label: 'Total Scans',
      value: analytics.total_scans,
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
    },
    {
      label: 'Today',
      value: analytics.today_scans,
      icon: Calendar,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    {
      label: 'This Week',
      value: analytics.week_scans,
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
      borderColor: 'border-info/20',
    },
    {
      label: 'Unique Sessions',
      value: analytics.unique_sessions,
      icon: Users,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-surface/50 rounded-xl p-4 border border-border animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-6 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`bg-surface/50 rounded-xl p-4 border ${stat.borderColor} hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <IconComponent className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-xl font-semibold text-foreground">{stat.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScanStats;