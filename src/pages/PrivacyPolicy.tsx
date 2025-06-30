import React from 'react';
import { Shield, Eye, Database, Lock, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass bg-glass-bg/80 border-b border-glass-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Privacy Policy</h1>
              <p className="text-xs text-muted-foreground font-medium">Last updated: June 30, 2025</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl shadow-glass p-8 md:p-12">
          {/* Introduction */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Your Privacy Matters</h2>
                <p className="text-muted-foreground">We are committed to protecting your personal information</p>
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed">
              At QR Nexus, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              and protect your information when you use our QR code generation and analytics service. By using 
              our service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Information We Collect</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Account Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Email address (for account creation and authentication)</li>
                  <li>• Password (encrypted and securely stored)</li>
                  <li>• Account creation and last login timestamps</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">QR Code Data</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Content you encode in QR codes (text, URLs, etc.)</li>
                  <li>• QR code creation timestamps</li>
                  <li>• QR code customization preferences</li>
                  <li>• Generated QR code images</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Analytics Data (For Tracked QR Codes Only)</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Scan timestamps and frequency</li>
                  <li>• User agent information (browser/device type)</li>
                  <li>• Referrer information (where the scan originated)</li>
                  <li>• Session identifiers (for unique visitor counting)</li>
                  <li>• IP addresses (for basic geographic insights)</li>
                </ul>
                <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                  <p className="text-success text-sm font-medium">
                    <strong>Privacy First:</strong> We do NOT collect precise location data, personal identifiers, 
                    or any information that could be used to identify individual users who scan your QR codes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">How We Use Your Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Service Provision</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Generate and store your QR codes</li>
                  <li>• Provide analytics and insights</li>
                  <li>• Enable account management features</li>
                  <li>• Facilitate QR code tracking and redirection</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Service Improvement</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Analyze usage patterns to improve features</li>
                  <li>• Monitor service performance and reliability</li>
                  <li>• Develop new features and capabilities</li>
                  <li>• Ensure security and prevent abuse</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-warning" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Data Security</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All data is encrypted in transit using HTTPS/TLS</li>
                <li>• Passwords are hashed using secure algorithms</li>
                <li>• Database access is restricted and monitored</li>
                <li>• Regular security audits and updates</li>
                <li>• Secure cloud infrastructure with Supabase</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-destructive" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Data Sharing and Disclosure</h3>
            </div>

            <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20">
              <h4 className="text-destructive font-medium mb-3">We Do NOT Sell Your Data</h4>
              <p className="text-destructive/80 mb-4">
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
              
              <h5 className="text-foreground font-medium mb-2">Limited Disclosure Scenarios:</h5>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li>• When required by law or legal process</li>
                <li>• To protect our rights, property, or safety</li>
                <li>• With your explicit consent</li>
                <li>• To trusted service providers who assist in operations (under strict confidentiality)</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Your Rights</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Access & Control</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• View and download your data</li>
                  <li>• Update your account information</li>
                  <li>• Delete your QR codes and analytics</li>
                  <li>• Export your data in standard formats</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Account Management</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Delete your account at any time</li>
                  <li>• Opt out of analytics tracking</li>
                  <li>• Control data retention preferences</li>
                  <li>• Request data correction or deletion</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Cookies and Tracking</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                We use minimal cookies and tracking technologies:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Essential cookies:</strong> For authentication and basic functionality</li>
                <li>• <strong>Analytics cookies:</strong> To understand how our service is used (anonymized)</li>
                <li>• <strong>Preference cookies:</strong> To remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground mt-4 text-sm">
                You can control cookie preferences through your browser settings.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-warning" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Data Retention</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <ul className="space-y-3 text-muted-foreground">
                <li>• <strong>Account data:</strong> Retained while your account is active</li>
                <li>• <strong>QR codes:</strong> Stored until you delete them or close your account</li>
                <li>• <strong>Analytics data:</strong> Retained for up to 2 years for insights and trends</li>
                <li>• <strong>Deleted accounts:</strong> All data permanently deleted within 30 days</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Contact Us</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                If you have questions about this Privacy Policy or your data, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>• Email: privacy@qrnexus.site</p>
                <p>• Response time: Within 48 hours</p>
                <p>• Data protection inquiries welcome</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section>
            <div className="bg-info/10 rounded-xl p-6 border border-info/20">
              <h4 className="text-info font-medium mb-3">Policy Updates</h4>
              <p className="text-info/80 text-sm">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Continued use of our service after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;