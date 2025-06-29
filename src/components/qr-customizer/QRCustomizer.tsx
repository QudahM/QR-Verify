import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Save, Palette, Image, Eye, Grid, Layers, FileDown, Check } from 'lucide-react';
import { generateCustomQR } from '../../lib/qrCustomizer';
import ColorPicker from './ColorPicker';
import LogoUploader from './LogoUploader';
import TemplateSelector from './TemplateSelector';
import StyleControls from './StyleControls';
import ExportOptions from './ExportOptions';

export interface QRStyle {
  foregroundColor: string;
  backgroundColor: string;
  eyeColor: string;
  eyeStyle: 'square' | 'circle' | 'rounded' | 'leaf' | 'diamond';
  dataStyle: 'square' | 'circle' | 'rounded' | 'dots';
  gradient: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: string[];
    direction: number;
  };
  logo?: {
    file: File;
    size: number;
    margin: number;
  };
}

interface QRCustomizerProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onQRGenerated: (dataUrl: string) => void;
  onSave?: () => void;
}

const QRCustomizer: React.FC<QRCustomizerProps> = ({
  content,
  isOpen,
  onClose,
  onQRGenerated,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'style' | 'logo' | 'templates'>('colors');
  const [qrStyle, setQrStyle] = useState<QRStyle>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    eyeColor: '#000000',
    eyeStyle: 'square',
    dataStyle: 'square',
    gradient: {
      enabled: false,
      type: 'linear',
      colors: ['#000000', '#333333'],
      direction: 45,
    },
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && content) {
      generatePreview();
    }
  }, [isOpen, content, qrStyle]);

  const generatePreview = async () => {
    if (!content) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await generateCustomQR(content, qrStyle, canvasRef.current);
      setPreviewUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR preview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStyleChange = (updates: Partial<QRStyle>) => {
    setQrStyle(prev => ({ ...prev, ...updates }));
  };

  const handleApply = () => {
    if (previewUrl) {
      onQRGenerated(previewUrl);
      onClose();
    }
  };

  const handleExport = () => {
    setShowExportOptions(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl h-[90vh] animate-scale-in">
        <div className="glass bg-glass-bg/95 border border-glass-border rounded-2xl shadow-glass h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-glass-border">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">QR Code Designer</h2>
                <p className="text-muted-foreground text-sm">Customize your QR code with professional styling</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-surface hover:bg-surface-hover rounded-xl flex items-center justify-center transition-colors border border-border"
            >
              <X className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-glass-border p-6 overflow-y-auto">
              {/* Tab Navigation */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('colors')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'colors'
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Palette className="w-4 h-4" strokeWidth={1.5} />
                  <span>Colors</span>
                </button>
                <button
                  onClick={() => setActiveTab('style')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'style'
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Grid className="w-4 h-4" strokeWidth={1.5} />
                  <span>Style</span>
                </button>
                <button
                  onClick={() => setActiveTab('logo')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'logo'
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Image className="w-4 h-4" strokeWidth={1.5} />
                  <span>Logo</span>
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === 'templates'
                      ? 'bg-primary text-white shadow-glow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Layers className="w-4 h-4" strokeWidth={1.5} />
                  <span>Templates</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'colors' && (
                  <ColorPicker qrStyle={qrStyle} onChange={handleStyleChange} />
                )}
                {activeTab === 'style' && (
                  <StyleControls qrStyle={qrStyle} onChange={handleStyleChange} />
                )}
                {activeTab === 'logo' && (
                  <LogoUploader qrStyle={qrStyle} onChange={handleStyleChange} />
                )}
                {activeTab === 'templates' && (
                  <TemplateSelector onTemplateSelect={handleStyleChange} />
                )}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                  {isGenerating ? (
                    <div className="w-96 h-96 bg-surface rounded-2xl flex items-center justify-center border border-border">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Generating preview...</p>
                      </div>
                    </div>
                  ) : previewUrl ? (
                    <div className="bg-white p-8 rounded-2xl shadow-glass-sm">
                      <img
                        src={previewUrl}
                        alt="QR Code Preview"
                        className="w-80 h-80 rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-96 h-96 bg-surface rounded-2xl flex items-center justify-center border border-border">
                      <div className="text-center">
                        <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
                        <p className="text-muted-foreground">Preview will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-glass-border">
                <div className="text-sm text-muted-foreground">
                  Real-time preview • High-resolution output
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleExport}
                    disabled={!previewUrl}
                    className="flex items-center space-x-2 px-4 py-2 bg-info hover:bg-info/90 disabled:bg-info/50 text-white rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <FileDown className="w-4 h-4" strokeWidth={1.5} />
                    <span>Export</span>
                  </button>
                  {onSave && (
                    <button
                      onClick={onSave}
                      disabled={!previewUrl}
                      className="flex items-center space-x-2 px-4 py-2 bg-success hover:bg-success/90 disabled:bg-success/50 text-white rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Save className="w-4 h-4" strokeWidth={1.5} />
                      <span>Save</span>
                    </button>
                  )}
                  <button
                    onClick={handleApply}
                    disabled={!previewUrl}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Check className="w-4 h-4" strokeWidth={1.5} />
                    <span>Apply Design</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Export Options Modal */}
      {showExportOptions && (
        <ExportOptions
          qrDataUrl={previewUrl}
          qrStyle={qrStyle}
          content={content}
          isOpen={showExportOptions}
          onClose={() => setShowExportOptions(false)}
        />
      )}
    </div>
  );
};

export default QRCustomizer;