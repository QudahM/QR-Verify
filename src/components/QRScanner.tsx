import React, { useState, useRef, useCallback } from 'react';
import { Upload, AlertTriangle, CheckCircle, ExternalLink, Eye, Shield, AlertCircle, Scan, FileImage } from 'lucide-react';
import QrScanner from 'qr-scanner';
import { checkUrlWithSafeBrowsing } from '../lib/safeBrowsing';

interface ScanResult {
  data: string;
  isUrl: boolean;
  safetyStatus?: 'safe' | 'suspicious' | 'malicious' | 'unknown';
  safetyMessage?: string;
}

const QRScanner: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCheckingSafety, setIsCheckingSafety] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const checkUrlSafety = async (url: string) => {
  return await checkUrlWithSafeBrowsing(url);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setIsScanning(true);
    setError('');
    setScanResult(null);

    try {
      const result = await QrScanner.scanImage(file);
      const isUrl = isValidUrl(result);
      
      const scanData: ScanResult = {
        data: result,
        isUrl,
      };

      if (isUrl) {
        setIsCheckingSafety(true);
        const safetyCheck = await checkUrlSafety(result);
        scanData.safetyStatus = safetyCheck.status as ScanResult['safetyStatus'];
        scanData.safetyMessage = safetyCheck.message;
        setIsCheckingSafety(false);
      }

      setScanResult(scanData);
    } catch (error) {
      setError('Could not scan QR code from this image. Please make sure the image contains a clear QR code.');
    } finally {
      setIsScanning(false);
    }
  }, []);

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

  const getSafetyIcon = (status?: string) => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-success" strokeWidth={1.5} />;
      case 'suspicious':
        return <AlertTriangle className="w-5 h-5 text-warning" strokeWidth={1.5} />;
      case 'malicious':
        return <AlertCircle className="w-5 h-5 text-destructive" strokeWidth={1.5} />;
      default:
        return <Shield className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />;
    }
  };

  const getSafetyColor = (status?: string) => {
    switch (status) {
      case 'safe':
        return 'border-success/30 bg-success/10';
      case 'suspicious':
        return 'border-warning/30 bg-warning/10';
      case 'malicious':
        return 'border-destructive/30 bg-destructive/10';
      default:
        return 'border-border bg-surface/50';
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center animate-slide-up">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20 mb-6">
          <Shield className="w-3 h-3 text-success" strokeWidth={1.5} />
          <span className="text-xs text-success font-medium">Security Scanner</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
          Verify QR Safety
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Upload any QR code image to decode its content and verify URL safety with advanced threat detection
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 shadow-glass animate-fade-in">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <FileImage className="w-5 h-5 text-success" strokeWidth={1.5} />
                </div>
                <div>
                  <label className="text-lg font-medium text-foreground">Upload QR Code</label>
                  <p className="text-sm text-muted-foreground">Drag & drop or click to select</p>
                </div>
              </div>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  dragActive 
                    ? 'border-primary bg-primary/10 scale-105' 
                    : 'border-border hover:border-primary/50 hover:bg-surface/50'
                }`}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-surface rounded-xl mx-auto mb-6 flex items-center justify-center border border-border">
                    <Upload className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Drop your QR code here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse files</p>
                  <p className="text-sm text-muted-foreground">Supports PNG, JPG, GIF, WebP formats</p>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {isScanning && (
              <div className="bg-info/10 border border-info/30 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-info border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <span className="text-info font-medium">Scanning QR code...</span>
                    <p className="text-info/70 text-sm">Analyzing image and extracting data</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
                  <div>
                    <span className="text-destructive font-medium">Scan Failed</span>
                    <p className="text-destructive/70 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 shadow-glass animate-fade-in">
          {scanResult ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20 mb-6">
                  <CheckCircle className="w-3 h-3 text-success" strokeWidth={1.5} />
                  <span className="text-xs text-success font-medium">Scan Complete</span>
                </div>
              </div>

              {/* Decoded Content */}
              <div className="bg-surface/50 border border-border rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-info" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-3">Decoded Content</h4>
                    <div className="bg-input rounded-xl p-4 border border-border">
                      <p className="text-foreground break-all font-mono text-sm">{scanResult.data}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* URL Safety Check */}
              {scanResult.isUrl && (
                <div className={`border rounded-xl p-6 ${getSafetyColor(scanResult.safetyStatus)}`}>
                  {isCheckingSafety ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-6 h-6 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <span className="text-foreground font-medium">Analyzing URL safety...</span>
                        <p className="text-muted-foreground text-sm">Checking against threat databases</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        {getSafetyIcon(scanResult.safetyStatus)}
                        <div>
                          <h4 className="font-medium text-foreground text-lg">
                            Safety Status: <span className="capitalize">{scanResult.safetyStatus}</span>
                          </h4>
                          <p className="text-muted-foreground text-sm">{scanResult.safetyMessage}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-muted-foreground text-sm">Proceed with caution</span>
                        <a
                          href={scanResult.data}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-surface-hover rounded-xl transition-colors text-foreground font-medium border border-border"
                        >
                          <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                          <span>Open URL</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Non-URL Content */}
              {!scanResult.isUrl && (
                <div className="bg-success/10 border border-success/30 rounded-xl p-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle className="w-5 h-5 text-success" strokeWidth={1.5} />
                    <div>
                      <span className="text-success font-medium">Safe Content</span>
                      <p className="text-success/70 text-sm">This QR code contains text data, not a URL</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-surface rounded-2xl mx-auto flex items-center justify-center border border-border mb-8">
                <Shield className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to Scan</h3>
              <p className="text-muted-foreground">Upload a QR code image to decode and verify its safety</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;