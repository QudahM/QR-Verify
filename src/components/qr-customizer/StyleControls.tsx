import React from 'react';
import { Grid, Eye, Circle, Square, Diamond, Leaf } from 'lucide-react';
import { QRStyle } from './QRCustomizer';

interface StyleControlsProps {
  qrStyle: QRStyle;
  onChange: (updates: Partial<QRStyle>) => void;
}

const StyleControls: React.FC<StyleControlsProps> = ({ qrStyle, onChange }) => {
  const eyeStyles = [
    { id: 'square', name: 'Square', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'rounded', name: 'Rounded', icon: Square },
    { id: 'leaf', name: 'Leaf', icon: Leaf },
    { id: 'diamond', name: 'Diamond', icon: Diamond },
  ];

  const dataStyles = [
    { id: 'square', name: 'Square', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'rounded', name: 'Rounded', icon: Square },
    { id: 'dots', name: 'Dots', icon: Circle },
  ];

  return (
    <div className="space-y-6">
      {/* Eye Style */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <label className="text-sm font-medium text-foreground">Eye Style</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {eyeStyles.map((style) => {
            const IconComponent = style.icon;
            return (
              <button
                key={style.id}
                onClick={() => onChange({ eyeStyle: style.id as QRStyle['eyeStyle'] })}
                className={`flex items-center space-x-2 px-3 py-3 rounded-xl border transition-all duration-200 ${
                  qrStyle.eyeStyle === style.id
                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                    : 'bg-surface hover:bg-surface-hover text-muted-foreground border-border'
                }`}
              >
                <IconComponent className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">{style.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Style */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Grid className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <label className="text-sm font-medium text-foreground">Data Pattern</label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {dataStyles.map((style) => {
            const IconComponent = style.icon;
            return (
              <button
                key={style.id}
                onClick={() => onChange({ dataStyle: style.id as QRStyle['dataStyle'] })}
                className={`flex items-center space-x-2 px-3 py-3 rounded-xl border transition-all duration-200 ${
                  qrStyle.dataStyle === style.id
                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                    : 'bg-surface hover:bg-surface-hover text-muted-foreground border-border'
                }`}
              >
                <IconComponent className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">{style.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style Preview */}
      <div className="bg-surface/50 rounded-xl p-4 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Style Preview</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Eye Preview */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-foreground rounded-lg flex items-center justify-center">
              <div 
                className={`w-8 h-8 bg-background ${
                  qrStyle.eyeStyle === 'circle' ? 'rounded-full' :
                  qrStyle.eyeStyle === 'rounded' ? 'rounded-md' :
                  qrStyle.eyeStyle === 'leaf' ? 'rounded-tl-full rounded-br-full' :
                  qrStyle.eyeStyle === 'diamond' ? 'rotate-45' : ''
                }`}
                style={{ backgroundColor: qrStyle.eyeColor }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Eye</span>
          </div>

          {/* Data Preview */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-background rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 ${
                      qrStyle.dataStyle === 'circle' ? 'rounded-full' :
                      qrStyle.dataStyle === 'rounded' ? 'rounded-sm' :
                      qrStyle.dataStyle === 'dots' ? 'rounded-full' : ''
                    }`}
                    style={{ 
                      backgroundColor: qrStyle.gradient.enabled 
                        ? qrStyle.gradient.colors[0] 
                        : qrStyle.foregroundColor 
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Data</span>
          </div>

          {/* Background Preview */}
          <div className="text-center">
            <div 
              className="w-12 h-12 mx-auto mb-2 rounded-lg border border-border"
              style={{ backgroundColor: qrStyle.backgroundColor }}
            />
            <span className="text-xs text-muted-foreground">Background</span>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-surface/50 rounded-xl p-4 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Advanced Options</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Error Correction</span>
            <select className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground">
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H" selected>High (30%)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quiet Zone</span>
            <select className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground">
              <option value="1">Minimal</option>
              <option value="2" selected>Standard</option>
              <option value="3">Large</option>
              <option value="4">Extra Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleControls;