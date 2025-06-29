import React, { useRef, useState } from 'react';
import { Upload, Image, X, RotateCcw } from 'lucide-react';
import { QRStyle } from './QRCustomizer';

interface LogoUploaderProps {
  qrStyle: QRStyle;
  onChange: (updates: Partial<QRStyle>) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ qrStyle, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        onChange({
          logo: {
            file,
            size: qrStyle.logo?.size || 20,
            margin: qrStyle.logo?.margin || 10,
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    onChange({ logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizeChange = (size: number) => {
    if (qrStyle.logo) {
      onChange({
        logo: { ...qrStyle.logo, size }
      });
    }
  };

  const handleMarginChange = (margin: number) => {
    if (qrStyle.logo) {
      onChange({
        logo: { ...qrStyle.logo, margin }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Image className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <label className="text-sm font-medium text-foreground">Logo Upload</label>
        </div>

        {!logoPreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragActive 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-border hover:border-primary/50 hover:bg-surface/50'
            }`}
          >
            <div className="w-12 h-12 bg-surface rounded-xl mx-auto mb-4 flex items-center justify-center border border-border">
              <Upload className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h4 className="text-sm font-medium text-foreground mb-2">Upload Logo</h4>
            <p className="text-xs text-muted-foreground mb-2">Drag & drop or click to browse</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 5MB</p>
          </div>
        ) : (
          <div className="relative bg-surface/50 rounded-xl p-4 border border-border">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-border">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Logo Uploaded</h4>
                <p className="text-xs text-muted-foreground">Ready to embed in QR code</p>
              </div>
              <button
                onClick={removeLogo}
                className="w-8 h-8 bg-destructive/10 hover:bg-destructive/20 rounded-lg flex items-center justify-center transition-colors border border-destructive/20"
              >
                <X className="w-4 h-4 text-destructive" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Logo Settings */}
      {qrStyle.logo && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Logo Size</label>
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="40"
                value={qrStyle.logo.size}
                onChange={(e) => handleSizeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Small (10%)</span>
                <span className="font-medium">{qrStyle.logo.size}%</span>
                <span>Large (40%)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Logo Margin</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="20"
                value={qrStyle.logo.margin}
                onChange={(e) => handleMarginChange(parseInt(e.target.value))}
                className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>None (0%)</span>
                <span className="font-medium">{qrStyle.logo.margin}%</span>
                <span>Large (20%)</span>
              </div>
            </div>
          </div>

          {/* Logo Preview */}
          <div className="bg-surface/50 rounded-xl p-4 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">Logo Preview</h4>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24 bg-white rounded-xl border border-border flex items-center justify-center">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{
                    width: `${qrStyle.logo.size}%`,
                    height: `${qrStyle.logo.size}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Logo will be centered in the QR code
            </p>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-info/10 rounded-xl p-4 border border-info/20">
        <h4 className="text-sm font-medium text-info mb-2">Logo Tips</h4>
        <ul className="text-xs text-info/80 space-y-1">
          <li>• Use high-contrast logos for better scanning</li>
          <li>• Keep logos simple and recognizable</li>
          <li>• Square or circular logos work best</li>
          <li>• Avoid logos larger than 30% for reliability</li>
        </ul>
      </div>
    </div>
  );
};

export default LogoUploader;