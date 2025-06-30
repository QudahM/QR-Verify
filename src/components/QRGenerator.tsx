import React, { useState, useCallback } from 'react';
import { Download, Link, Type, Zap, Copy, Check, QrCode, Save, Palette, BarChart3, ExternalLink } from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { generateTrackingUrl, updateQRCodeWithTracking } from '../lib/qrTracker';
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
  const [generatedQRId, setGeneratedQRId] = useState<string | null>(null);

  const { user } = useAuth();

  const generateQR = useCallback(async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    try {
      // For URLs, we'll generate the tracking URL after saving to get the actual QR code ID
      // For now, generate QR with original content
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
      setGeneratedQRId(null);
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
      console.log('Saving QR code for user:', user.id);
      console.log('Input type:', inputType);
      console.log('Content:', input);

      // First, insert the QR code record
      const { data: qrCodeData, error: insertError } = await supabase
        .from('qr_codes')
        .insert({
          user_id: user.id,
          content: input,
          type: inputType,
          qr_data_url: qrDataUrl,
          tracking_url: null, // Will be updated below for URLs
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      console.log('QR code saved:', qrCodeData);
      setGeneratedQRId(qrCodeData.id);

      // For URLs, generate tracking URL and update the record
      if (inputType === 'url') {
        const trackingUrl = generateTrackingUrl(qrCodeData.id, input);
        console.log('Generated tracking URL:', trackingUrl);
        
        // Update the QR code record with the tracking URL
        await updateQRCodeWithTracking(qrCodeData.id, trackingUrl);
        
        // Regenerate QR code with tracking URL
        const trackingQRDataUrl = await QRCode.toDataURL(trackingUrl, {
          width: 512,
          margin: 2,
          color: {
            dark: '#021526',
            light: '#E2DAD6',
          },
          errorCorrectionLevel: 'H',
        });
        
        // Update the QR code record with the new QR data URL
        const { error: updateError } = await supabase
          .from('qr_codes')
          .update({ qr_data_url: trackingQRDataUrl })
          .eq('id', qrCodeData.id);

        if (updateError) {
          console.error('Error updating QR code with tracking data:', updateError);
        } else {
          setQrDataUrl(trackingQRDataUrl);
          console.log('QR code updated with tracking URL');
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
    
    // Auto-detect URL format
    if (value.startsWith('http://') || value.startsWith('https://') || 
        (value.includes('.') && (value.includes('.com') || value.includes('.org') || 
         value.includes('.net') || value.includes('.edu') || value.includes('.gov')))) {
      setInputType('url');
    } else {
      setInputType('text');
    }
  };

  const handleCustomQRGenerated = (dataUrl: string) => {
    setQrDataUrl(dataUrl);
    setSaved(false);
  };

  const getTrackingPreview = () => {
    if (inputType === 'url' && input.trim()) {
      return generateTrackingUrl('preview-id', input);
    }
    return null;
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

            {/* Tracking Preview */}
            {inputType === 'url' && input.trim() && user && (
              <div className="bg-info/10 rounded-xl p-4 border border-info/20">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-info mt-0.5" strokeWidth={1.5} />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-info mb-2">Tracking Enabled</h4>
                    <p className="text-xs text-info/80 mb-3">
                      Your QR code will redirect through our tracking system:
                    </p>
                    <div className="bg-info/5 rounded-lg p-3 border border-info/10">
                      <p className="text-xs font-mono text-info break-all">
                        {getTrackingPreview()?.replace('preview-id', '{qr-id}')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <ExternalLink className="w-3 h-3 text-info/60" strokeWidth={1.5} />
                      <span className="text-xs text-info/60">Users will be seamlessly redirected to your original URL</span>
                    </div>
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

              {/* QR Code Info */}
              {saved && generatedQRId && inputType === 'url' && (
                <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-success mb-2">Tracking Active</h4>
                    <p className="text-xs text-success/80 mb-3">
                      Your QR code is now being tracked. All scans will be recorded in your dashboard.
                    </p>
                    <div className="bg-success/5 rounded-lg p-3 border border-success/10">
                      <p className="text-xs font-mono text-success break-all">
                        {generateTrackingUrl(generatedQRId, input)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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