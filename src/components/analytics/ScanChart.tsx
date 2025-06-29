import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { DailyScanData } from '../../lib/qrTracker';

interface ScanChartProps {
  data: DailyScanData[];
  title: string;
  height?: number;
}

const ScanChart: React.FC<ScanChartProps> = ({ data, title, height = 200 }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface/50 rounded-xl p-6 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-4">{title}</h4>
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-muted-foreground text-sm">No scan data available</p>
          </div>
        </div>
      </div>
    );
  }

  const maxScans = Math.max(...data.map(d => d.scan_count));
  const totalScans = data.reduce((sum, d) => sum + d.scan_count, 0);
  const avgScans = totalScans / data.length;

  // Calculate trend
  const recentData = data.slice(-7);
  const olderData = data.slice(-14, -7);
  const recentAvg = recentData.reduce((sum, d) => sum + d.scan_count, 0) / recentData.length;
  const olderAvg = olderData.reduce((sum, d) => sum + d.scan_count, 0) / olderData.length;
  const trend = recentAvg > olderAvg ? 'up' : recentAvg < olderAvg ? 'down' : 'stable';
  const trendPercentage = olderAvg > 0 ? Math.abs(((recentAvg - olderAvg) / olderAvg) * 100) : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-surface/50 rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Total: {totalScans}</span>
            <span>Avg: {avgScans.toFixed(1)}</span>
            <div className="flex items-center space-x-1">
              {trend === 'up' && <TrendingUp className="w-3 h-3 text-success" strokeWidth={1.5} />}
              {trend === 'down' && <TrendingDown className="w-3 h-3 text-destructive" strokeWidth={1.5} />}
              {trend === 'stable' && <Minus className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />}
              <span className={`${
                trend === 'up' ? 'text-success' : 
                trend === 'down' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {trendPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={height * ratio}
              x2="100%"
              y2={height * ratio}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border opacity-30"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = maxScans > 0 ? (item.scan_count / maxScans) * (height - 20) : 0;
            const barWidth = `${(1 / data.length) * 100}%`;
            const x = `${(index / data.length) * 100}%`;
            const y = height - barHeight - 10;

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className={`transition-all duration-200 cursor-pointer ${
                    hoveredIndex === index
                      ? 'fill-primary opacity-100'
                      : 'fill-primary opacity-70 hover:opacity-90'
                  }`}
                  rx="2"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Hover tooltip */}
                {hoveredIndex === index && (
                  <g>
                    <rect
                      x={`calc(${x} + 10px)`}
                      y={y - 35}
                      width="80"
                      height="30"
                      className="fill-foreground"
                      rx="4"
                      opacity="0.9"
                    />
                    <text
                      x={`calc(${x} + 50px)`}
                      y={y - 20}
                      textAnchor="middle"
                      className="fill-background text-xs font-medium"
                    >
                      {item.scan_count} scans
                    </text>
                    <text
                      x={`calc(${x} + 50px)`}
                      y={y - 8}
                      textAnchor="middle"
                      className="fill-background text-xs opacity-70"
                    >
                      {formatDate(item.scan_date)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground mt-2">
          {data.filter((_, index) => index % Math.ceil(data.length / 5) === 0).map((item, index) => (
            <span key={index}>{formatDate(item.scan_date)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanChart;