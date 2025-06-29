import React, { useState, useCallback } from 'react';
import { Download, Link, Type, Zap, Copy, Check, QrCode, Save, Palette, BarChart3 } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateEdgeTrackingUrl, updateQRCodeWithTracking } from '../lib/qrTracker';
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

  const { user } = useAuth();

  const generateQR = useCallback(async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      // For URLs, we'll generate the QR code with the original URL first
      // The tracking URL will be set when saving to database
      const dataUrl = await QRCode.toDataURL(input, {
        width: 512,
        margin: 2,
        color: {
          dark: '#021526',
          light: '#E2DAD6',
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
      setSaved(false);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [input]);

  const saveQRCode = async () => {
    if (!user || !qrDataUrl || !input.trim()) return;

    setIsSaving(true);
    try {
      // First, insert the QR code to get the ID
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          content: input,
          type: inputType,
          qr_data_url: qrDataUrl,
        })
        .select()
        .single();

      if (error) throw error;
      
      // If it's a URL, generate the edge function tracking URL and update the record
      if (inputType === 'url' && data) {
        const trackingUrl = generateEdgeTrackingUrl(data.id, input);
        await updateQRCodeWithTracking(data.id, trackingUrl);
        
        // Regenerate QR code with tracking URL for better analytics
        try {
          const trackingQRDataUrl = await QRCode.toDataURL(trackingUrl, {
            width: 512,
            margin: 2,
            color: {
              dark: '#021526',
              light: '#E2DAD6',
            },
            errorCorrectionLevel: 'H',
          });
          
          // Update the QR code data URL in the database
          await supabase
            .from('qr_codes')
            .update({ qr_data_url: trackingQRDataUrl })
            .eq('id', data.id);
            
          // Update the displayed QR code
          setQrDataUrl(trackingQRDataUrl);
        } catch (qrError) {
          console.error('Error generating tracking QR code:', qrError);
          // Continue with original QR code if tracking QR generation fails
        }
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving QR code:', error);
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
    
    if (value.startsWith('http://') || value.startsWith('https://') || value.includes('.com') || value.includes('.org')) {
      setInputType('url');
    } else {
      setInputType('text');
    }
  };

  const handleCustomQRGenerated = (dataUrl: string) => {
    setQrDataUrl(dataUrl);
    setSaved(false);
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
          Transform any text or URL into a beautiful, trackable QR code with real-time analytics
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
                      {inputType === 'url' ? 'Link will be tracked with analytics' : 'Plain text will be encoded'}
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

            {/* Analytics Info */}
            {inputType === 'url' && user && (
              <div className="bg-info/10 rounded-xl p-4 border border-info/20">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-info" strokeWidth={1.5} />
                  <div>
                    <h4 className="text-sm font-medium text-info">Edge Function Analytics</h4>
                    <p className="text-xs text-info/80">This URL will be tracked with instant redirects and real-time analytics</p>
                  </div>
                </div>
              </div>
            )}
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
                    disabled={isSaving || saved}
                    className="group w-full bg-info hover:bg-info/90 disabled:bg-info/50 text-white py-4 px-8 rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-3"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
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
              <p className="text-muted-foreground">Enter your content above and click generate to create your trackable QR code</p>
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