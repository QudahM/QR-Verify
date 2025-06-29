import React, { useState } from 'react';
import { Download, FileImage, FileText, Printer, X, Check } from 'lucide-react';
import { QRStyle } from './QRCustomizer';
import { exportQRCode } from '../../lib/qrExporter';

interface ExportOptionsProps {
  qrDataUrl: string;
  qrStyle: QRStyle;
  content: string;
  isOpen: boolean;
  onClose: () => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  qrDataUrl,
  qrStyle,
  content,
  isOpen,
  onClose
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [selectedSize, setSelectedSize] = useState<number>(1024);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const formats = [
    {
      id: 'png',
      name: 'PNG',
      description: 'High-quality raster image',
      icon: FileImage,
      sizes: [512, 1024, 2048, 4096],
      recommended: true,
    },
    {
      id: 'svg',
      name: 'SVG',
      description: 'Scalable vector graphics',
      icon: FileText,
      sizes: [512, 1024, 2048],
      recommended: false,
    },
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Print-ready document',
      icon: Printer,
      sizes: [1024, 2048, 4096],
      recommended: false,
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportQRCode(qrDataUrl, qrStyle, content, selectedFormat, selectedSize);
      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl animate-scale-in">
        <div className="glass bg-glass-bg/95 border border-glass-border rounded-2xl shadow-glass p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Export QR Code</h2>
                <p className="text-muted-foreground text-sm">Choose format and quality for your QR code</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-surface hover:bg-surface-hover rounded-xl flex items-center justify-center transition-colors border border-border"
            >
              <X className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>

          {/* Format Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Export Format</h3>
            <div className="grid grid-cols-3 gap-4">
              {formats.map((format) => {
                const IconComponent = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id as any)}
                    className={`relative p-4 rounded-xl border transition-all duration-200 ${
                      selectedFormat === format.id
                        ? 'bg-primary text-white border-primary shadow-glow-sm'
                        : 'bg-surface hover:bg-surface-hover text-muted-foreground border-border'
                    }`}
                  >
                    {format.recommended && (
                      <div className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    <div className="text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2" strokeWidth={1.5} />
                      <h4 className="font-medium mb-1">{format.name}</h4>
                      <p className="text-xs opacity-80">{format.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">
              {selectedFormat === 'svg' ? 'Base Size' : 'Resolution'}
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {formats.find(f => f.id === selectedFormat)?.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-3 rounded-xl border font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-primary text-white border-primary shadow-glow-sm'
                      : 'bg-surface hover:bg-surface-hover text-muted-foreground border-border'
                  }`}
                >
                  {size}px
                  {selectedFormat === 'png' && (
                    <div className="text-xs opacity-80 mt-1">
                      {size >= 2048 ? 'Print' : size >= 1024 ? 'Web' : 'Small'}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Preview</h3>
            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <div className="flex items-center justify-center">
                <div className="bg-white p-4 rounded-xl shadow-glass-sm">
                  <img
                    src={qrDataUrl}
                    alt="QR Code Preview"
                    className="w-32 h-32 rounded-lg"
                  />
                </div>
              </div>
              <div className="text-center mt-4 space-y-1">
                <p className="text-sm text-foreground font-medium">
                  {selectedFormat.toUpperCase()} • {selectedSize}×{selectedSize}px
                </p>
                <p className="text-xs text-muted-foreground">
                  Estimated file size: {selectedFormat === 'png' ? `${Math.round(selectedSize * selectedSize * 4 / 1024)}KB` : '< 10KB'}
                </p>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedFormat === 'svg' ? 'Infinitely scalable' : 
               selectedFormat === 'pdf' ? 'Print-ready quality' : 
               'High-resolution bitmap'}
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting || exported}
              className="flex items-center space-x-3 px-8 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : exported ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={1.5} />
                  <span>Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                  <span>Export {selectedFormat.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;