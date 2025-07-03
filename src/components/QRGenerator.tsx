import React, { useState, useCallback } from 'react';
import { Download, Link, Type, Zap, Copy, Check, QrCode, Save, Palette, BarChart3, Shield } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext';
import { createTrackedQRCode, updateQRCodeImage, generateTrackingUrl } from '../lib/qrTracker';
import QRCustomizer from './qr-customizer/QRCustomizer';

const QRGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [trackedQRData, setTrackedQRData] = useState<{
    trackedId: string;
    originalId: string;
    trackingUrl: string;
  } | null>(null);
  const [isQRSavedToDashboard, setIsQRSavedToDashboard] = useState(false);

  const { user } = useAuth();

  // Generate simple QR code (for unauthenticated users or initial generation)
  const generateSimpleQR = useCallback(async (content: string) => {
    const dataUrl = await QRCode.toDataURL(content, {
      width: 512,
      margin: 2,
      color: {
        dark: '#021526',
        light: '#E2DAD6',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  }, []);

  // Generate trackable QR code (for authenticated users saving to dashboard)
  const generateTrackableQR = useCallback(async (trackingUrl: string) => {
    const dataUrl = await QRCode.toDataURL(trackingUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: '#021526',
        light: '#E2DAD6',
      },
      errorCorrectionLevel: 'H',
    });
    return dataUrl;
  }, []);

  const generateQR = useCallback(async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      // Always generate simple QR code first (points directly to destination)
      const dataUrl = await generateSimpleQR(input);
      setQrDataUrl(dataUrl);
      setSaved(false);
      setTrackedQRData(null);
      setIsQRSavedToDashboard(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [input, generateSimpleQR]);

  const saveQRCode = async () => {
    if (!user || !input.trim()) return;

    setIsSaving(true);
    try {
      console.log('Saving QR code for user:', user.id);
      console.log('Input type:', inputType);
      console.log('Content:', input);

      // Create tracked QR code record in Supabase
      const result = await createTrackedQRCode(
        user.id,
        input,
        inputType,
        qrDataUrl // Original simple QR code image
      );

      if (!result) {
        throw new Error('Failed to create tracked QR code');
      }

      console.log('Tracked QR code created:', result);
      setTrackedQRData(result);
      setIsQRSavedToDashboard(true);

      let finalQRDataUrl: string;

      if (inputType === 'url') {
        // Generate trackable QR code for URLs using the tracking URL
        finalQRDataUrl = await generateTrackableQR(result.trackingUrl);
        console.log('Generated trackable QR code for URL');
      } else {
        // For text, keep the simple QR code pointing directly to content
        finalQRDataUrl = qrDataUrl;
        console.log('Using simple QR code for text content');
      }

      // Update the QR code record with the final QR image
      const updateSuccess = await updateQRCodeImage(result.trackedId, finalQRDataUrl);
      
      if (!updateSuccess) {
        console.error('Failed to update QR code image');
        throw new Error('Failed to update QR code image');
      }

      // Update the displayed QR code
      setQrDataUrl(finalQRDataUrl);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      console.log('QR code saved successfully:', {
        trackedId: result.trackedId,
        originalId: result.originalId,
        type: inputType,
        hasTracking: inputType === 'url'
      });
      
    } catch (error) {
      console.error('Error saving QR code:', error);
      setIsQRSavedToDashboard(false);
      setTrackedQRData(null);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-nexus-${Date.now()}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async () => {
    if (!input) return;
    
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Reset saved state when input changes
    if (value !== input) {
      setIsQRSavedToDashboard(false);
      setTrackedQRData(null);
    }
    
    // Auto-detect URL format
    if (value.startsWith('http://') || value.startsWith('https://') || 
        (value.includes('.') && (value.includes('.com') || value.includes('.org') ||
         value.includes('.ca') || value.includes('.new') || value.includes('.ai') ||
         value.includes('.net') || value.includes('.edu') || value.includes('.gov')))) {
      setInputType('url');
    } else {
      setInputType('text');
    }
  };

  const handleCustomQRGenerated = (dataUrl: string) => {
    setQrDataUrl(dataUrl);
    setSaved(false);
    setIsQRSavedToDashboard(false);
  };

  const getTrackingStatus = () => {
    if (!user) {
      return { 
        status: 'unavailable', 
        message: 'Sign in to enable tracking',
        description: 'QR code points directly to destination'
      };
    }
    
    if (inputType !== 'url') {
      return { 
        status: 'not-applicable', 
        message: 'Text QR codes don\'t use tracking',
        description: 'QR code contains plain text content'
      };
    }
    
    if (isQRSavedToDashboard && trackedQRData) {
      return { 
        status: 'active', 
        message: 'Tracking active - scans are being recorded',
        description: 'QR code redirects through tracking system'
      };
    }
    
    if (qrDataUrl && !isQRSavedToDashboard) {
      return { 
        status: 'inactive', 
        message: 'Save to dashboard to enable tracking',
        description: 'QR code points directly to destination'
      };
    }
    
    return { 
      status: 'pending', 
      message: 'Generate QR code first',
      description: 'No QR code generated yet'
    };
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center animate-slide-up">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-6">
          <Zap className="w-3 h-3 text-primary" strokeWidth={1.5} />
          <span className="text-xs text-primary font-medium">QR Generator</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">
          Create Your QR Code
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          Transform any text or URL into a beautiful QR code. Sign in to enable tracking and analytics.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 shadow-glass animate-fade-in">
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {inputType === 'url' ? (
                    <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                      <Link className="w-5 h-5 text-info" strokeWidth={1.5} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Type className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                  )}
                  <div>
                    <label className="text-lg font-medium text-foreground">
                      {inputType === 'url' ? 'URL Detected' : 'Text Content'}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {inputType === 'url' 
                        ? (user ? 'Can be tracked with analytics' : 'Will point directly to destination')
                        : 'Plain text will be encoded'
                      }
                    </p>
                  </div>
                </div>
                
                {input && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 px-3 py-2 bg-surface hover:bg-surface-hover rounded-xl transition-colors border border-border"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success" strokeWidth={1.5} />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    )}
                  </button>
                )}
              </div>
              
              <div className="relative">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Enter your text, URL, or any content to encode..."
                  className="w-full h-40 px-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none text-foreground placeholder-muted-foreground transition-all duration-200"
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {input.length} characters
                </div>
              </div>
            </div>

            {/* Simplified Tracking Info */}
            {inputType === 'url' && input.trim() && user && (
              <div className="bg-info/10 rounded-xl p-4 border border-info/20">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-info" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-info mb-1">
                      Tracking Available
                    </h4>
                    <p className="text-xs text-info/80">
                      Save to dashboard to enable analytics and scan tracking
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* No Tracking Info for non-signed in users */}
            {inputType === 'url' && input.trim() && !user && (
              <div className="bg-warning/10 rounded-xl p-4 border border-warning/20">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-warning" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-warning mb-1">
                      No Tracking (Not Signed In)
                    </h4>
                    <p className="text-xs text-warning/80">
                      QR code will point directly to your URL without tracking
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={generateQR}
                disabled={!input.trim() || isGenerating}
                className="group w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-4 px-8 rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" strokeWidth={1.5} />
                    <span>Generate QR Code</span>
                  </>
                )}
              </button>

              {input.trim() && (
                <button
                  onClick={() => setShowCustomizer(true)}
                  className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <Palette className="w-5 h-5" strokeWidth={1.5} />
                  <span>Customize Design</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 shadow-glass animate-fade-in">
          {qrDataUrl ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-success/10 rounded-full border border-success/20 mb-6">
                  <Check className="w-3 h-3 text-success" strokeWidth={1.5} />
                  <span className="text-xs text-success font-medium">QR Code Ready</span>
                </div>
                
                <div className="relative group animate-scale-in">
                  <div className="bg-white p-6 rounded-2xl shadow-glass-sm">
                    <img
                      src={qrDataUrl}
                      alt="Generated QR Code"
                      className="w-80 h-80 mx-auto rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Simple Tracking Status */}
              <div className="bg-surface/50 rounded-xl p-4 border border-border">
                <div className="flex items-center space-x-3">
                  {(() => {
                    const trackingStatus = getTrackingStatus();
                    
                    switch (trackingStatus.status) {
                      case 'active':
                        return (
                          <>
                            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-4 h-4 text-success" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-success">Tracking Active</span>
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                              </div>
                              <p className="text-xs text-success/80">{trackingStatus.message}</p>
                            </div>
                          </>
                        );
                      
                      case 'inactive':
                        return (
                          <>
                            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-warning" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-warning">Tracking Available</span>
                              <p className="text-xs text-warning/80">{trackingStatus.message}</p>
                            </div>
                          </>
                        );
                      
                      case 'unavailable':
                        return (
                          <>
                            <div className="w-8 h-8 bg-muted/10 rounded-lg flex items-center justify-center">
                              <Shield className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-muted-foreground">No Tracking</span>
                              <p className="text-xs text-muted-foreground/80">{trackingStatus.message}</p>
                            </div>
                          </>
                        );
                      
                      case 'not-applicable':
                        return (
                          <>
                            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                              <Type className="w-4 h-4 text-info" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-info">Text Content</span>
                              <p className="text-xs text-info/80">{trackingStatus.message}</p>
                            </div>
                          </>
                        );
                      
                      default:
                        return (
                          <>
                            <div className="w-8 h-8 bg-muted/10 rounded-lg flex items-center justify-center">
                              <QrCode className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-medium text-muted-foreground">Ready to Generate</span>
                              <p className="text-xs text-muted-foreground/80">Create your QR code above</p>
                            </div>
                          </>
                        );
                    }
                  })()}
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={downloadQR}
                  className="group w-full bg-success hover:bg-success/90 text-white py-4 px-8 rounded-xl font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
                >
                  <Download className="w-5 h-5" strokeWidth={1.5} />
                  <span>Download High-Res QR</span>
                </button>

                {user && (
                  <button
                    onClick={saveQRCode}
                    disabled={isSaving || isQRSavedToDashboard}
                    className="group w-full bg-info hover:bg-info/90 disabled:bg-info/50 text-white py-4 px-8 rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-3"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : isQRSavedToDashboard ? (
                      <>
                        <Check className="w-5 h-5" strokeWidth={1.5} />
                        <span>Saved to Dashboard!</span>
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-5 h-5" strokeWidth={1.5} />
                        <span>Saved with Analytics!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" strokeWidth={1.5} />
                        <span>Save to Dashboard</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-surface rounded-2xl mx-auto flex items-center justify-center border border-border mb-8">
                <div className="w-20 h-20 border-2 border-dashed border-border rounded-xl flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Ready to Generate</h3>
              <p className="text-muted-foreground">
                {user 
                  ? 'Enter your content above and click generate. Save to dashboard to enable tracking for URLs.'
                  : 'Enter your content above and click generate. Sign in to enable tracking and analytics.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QR Customizer Modal */}
      {showCustomizer && (
        <QRCustomizer
          content={input}
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
          onQRGenerated={handleCustomQRGenerated}
          onSave={user ? saveQRCode : undefined}
        />
      )}
    </div>
  );
};

export default QRGenerator;