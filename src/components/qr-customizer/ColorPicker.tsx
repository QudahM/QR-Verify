import React from 'react';
import { Palette, Zap, Eye } from 'lucide-react';
import { QRStyle } from './QRCustomizer';

interface ColorPickerProps {
  qrStyle: QRStyle;
  onChange: (updates: Partial<QRStyle>) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ qrStyle, onChange }) => {
  const presetColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff',
    '#0080ff', '#ff0080', '#80ff00', '#008080', '#800080',
    '#808000', '#c0c0c0', '#808080', '#400040', '#004040'
  ];

  const gradientPresets = [
    { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
    { name: 'Sunset', colors: ['#f093fb', '#f5576c'] },
    { name: 'Forest', colors: ['#11998e', '#38ef7d'] },
    { name: 'Fire', colors: ['#ff9a9e', '#fecfef'] },
    { name: 'Purple', colors: ['#a8edea', '#fed6e3'] },
    { name: 'Gold', colors: ['#ffecd2', '#fcb69f'] },
  ];

  const handleColorChange = (field: keyof QRStyle, value: string) => {
    onChange({ [field]: value });
  };

  const handleGradientChange = (updates: Partial<QRStyle['gradient']>) => {
    onChange({
      gradient: { ...qrStyle.gradient, ...updates }
    });
  };

  const applyGradientPreset = (preset: { colors: string[] }) => {
    onChange({
      gradient: {
        ...qrStyle.gradient,
        enabled: true,
        colors: preset.colors
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Gradient Toggle */}
      <div className="bg-surface/50 rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <span className="font-medium text-foreground">Gradient Mode</span>
          </div>
          <button
            onClick={() => handleGradientChange({ enabled: !qrStyle.gradient.enabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              qrStyle.gradient.enabled ? 'bg-primary' : 'bg-border'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                qrStyle.gradient.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {qrStyle.gradient.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleGradientChange({ type: 'linear' })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  qrStyle.gradient.type === 'linear'
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-hover text-muted-foreground'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => handleGradientChange({ type: 'radial' })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  qrStyle.gradient.type === 'radial'
                    ? 'bg-primary text-white'
                    : 'bg-surface hover:bg-surface-hover text-muted-foreground'
                }`}
              >
                Radial
              </button>
            </div>

            {qrStyle.gradient.type === 'linear' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Direction</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={qrStyle.gradient.direction}
                  onChange={(e) => handleGradientChange({ direction: parseInt(e.target.value) })}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-muted-foreground mt-1">{qrStyle.gradient.direction}°</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              {gradientPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyGradientPreset(preset)}
                  className="h-8 rounded-lg border border-border hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(45deg, ${preset.colors[0]}, ${preset.colors[1]})`
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Controls */}
      <div className="space-y-4">
        {/* Foreground Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {qrStyle.gradient.enabled ? 'Gradient Start Color' : 'Foreground Color'}
          </label>
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="color"
              value={qrStyle.gradient.enabled ? qrStyle.gradient.colors[0] : qrStyle.foregroundColor}
              onChange={(e) => {
                if (qrStyle.gradient.enabled) {
                  const newColors = [...qrStyle.gradient.colors];
                  newColors[0] = e.target.value;
                  handleGradientChange({ colors: newColors });
                } else {
                  handleColorChange('foregroundColor', e.target.value);
                }
              }}
              className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
            />
            <input
              type="text"
              value={qrStyle.gradient.enabled ? qrStyle.gradient.colors[0] : qrStyle.foregroundColor}
              onChange={(e) => {
                if (qrStyle.gradient.enabled) {
                  const newColors = [...qrStyle.gradient.colors];
                  newColors[0] = e.target.value;
                  handleGradientChange({ colors: newColors });
                } else {
                  handleColorChange('foregroundColor', e.target.value);
                }
              }}
              className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-10 gap-1">
            {presetColors.map((color, index) => (
              <button
                key={index}
                onClick={() => {
                  if (qrStyle.gradient.enabled) {
                    const newColors = [...qrStyle.gradient.colors];
                    newColors[0] = color;
                    handleGradientChange({ colors: newColors });
                  } else {
                    handleColorChange('foregroundColor', color);
                  }
                }}
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Gradient End Color */}
        {qrStyle.gradient.enabled && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Gradient End Color</label>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="color"
                value={qrStyle.gradient.colors[1] || '#333333'}
                onChange={(e) => {
                  const newColors = [...qrStyle.gradient.colors];
                  newColors[1] = e.target.value;
                  handleGradientChange({ colors: newColors });
                }}
                className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
              />
              <input
                type="text"
                value={qrStyle.gradient.colors[1] || '#333333'}
                onChange={(e) => {
                  const newColors = [...qrStyle.gradient.colors];
                  newColors[1] = e.target.value;
                  handleGradientChange({ colors: newColors });
                }}
                className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-10 gap-1">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newColors = [...qrStyle.gradient.colors];
                    newColors[1] = color;
                    handleGradientChange({ colors: newColors });
                  }}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Background Color</label>
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="color"
              value={qrStyle.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
            />
            <input
              type="text"
              value={qrStyle.backgroundColor}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-10 gap-1">
            {presetColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange('backgroundColor', color)}
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Eye Color */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" strokeWidth={1.5} />
              <span>Eye Color</span>
            </div>
          </label>
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="color"
              value={qrStyle.eyeColor}
              onChange={(e) => handleColorChange('eyeColor', e.target.value)}
              className="w-12 h-12 rounded-xl border-2 border-border cursor-pointer"
            />
            <input
              type="text"
              value={qrStyle.eyeColor}
              onChange={(e) => handleColorChange('eyeColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-10 gap-1">
            {presetColors.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorChange('eyeColor', color)}
                className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;