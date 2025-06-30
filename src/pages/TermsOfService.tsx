import React from 'react';
import { FileText, Shield, AlertTriangle, Scale, Users, Zap } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass bg-glass-bg/80 border-b border-glass-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
              <FileText className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Terms of Service</h1>
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
                <FileText className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Terms of Service</h2>
                <p className="text-muted-foreground">Legal agreement for using QR Nexus</p>
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed">
              Welcome to QR Nexus. These Terms of Service ("Terms") govern your use of our QR code generation 
              and analytics platform. By accessing or using our service, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </div>

          {/* Acceptance of Terms */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Acceptance of Terms</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                By using QR Nexus, you acknowledge that you have read, understood, and agree to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• These Terms of Service</li>
                <li>• Our Privacy Policy</li>
                <li>• All applicable laws and regulations</li>
                <li>• Any additional terms for specific features</li>
              </ul>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Service Description</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Core Services</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• QR code generation and customization</li>
                  <li>• QR code safety verification</li>
                  <li>• Analytics and tracking for registered users</li>
                  <li>• Dashboard for QR code management</li>
                  <li>• Export and download capabilities</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Service Availability</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• 24/7 service availability goal</li>
                  <li>• Scheduled maintenance windows</li>
                  <li>• No guarantee of uninterrupted service</li>
                  <li>• Right to modify or discontinue features</li>
                  <li>• Beta features may be unstable</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Accounts */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-warning" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">User Accounts and Responsibilities</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Account Requirements</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You must be at least 13 years old to create an account</li>
                  <li>• Provide accurate and complete registration information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• One account per person or organization</li>
                  <li>• Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">User Responsibilities</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• You are responsible for all activity under your account</li>
                  <li>• Keep your login credentials secure and confidential</li>
                  <li>• Use the service in compliance with all applicable laws</li>
                  <li>• Respect the rights and privacy of others</li>
                  <li>• Report any bugs or security vulnerabilities responsibly</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Acceptable Use Policy</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-success/10 rounded-xl p-6 border border-success/20">
                <h4 className="text-success font-medium mb-3">Permitted Uses</h4>
                <ul className="space-y-2 text-success/80 text-sm">
                  <li>• Generate QR codes for legitimate business or personal use</li>
                  <li>• Create QR codes for marketing, events, and information sharing</li>
                  <li>• Use analytics to understand QR code performance</li>
                  <li>• Share QR codes with appropriate audiences</li>
                  <li>• Export and download your own QR codes</li>
                </ul>
              </div>

              <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20">
                <h4 className="text-destructive font-medium mb-3">Prohibited Uses</h4>
                <ul className="space-y-2 text-destructive/80 text-sm">
                  <li>• Creating QR codes that link to illegal, harmful, or malicious content</li>
                  <li>• Phishing, fraud, or deceptive practices</li>
                  <li>• Spam, unsolicited marketing, or harassment</li>
                  <li>• Violating intellectual property rights</li>
                  <li>• Attempting to hack, disrupt, or overload our systems</li>
                  <li>• Creating QR codes for adult content without proper warnings</li>
                  <li>• Using the service to distribute malware or viruses</li>
                  <li>• Impersonating others or providing false information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Content and Intellectual Property</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Your Content</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• You retain ownership of content you create</li>
                  <li>• You grant us license to process and display your content</li>
                  <li>• You're responsible for content legality and accuracy</li>
                  <li>• We may remove content that violates these Terms</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Our Content</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• QR Nexus platform and features are our property</li>
                  <li>• You may not copy, modify, or redistribute our software</li>
                  <li>• Our trademarks and logos are protected</li>
                  <li>• Generated QR codes are yours to use freely</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Privacy and Data Protection</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                Your privacy is important to us. Our data practices are governed by our Privacy Policy, which includes:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Minimal data collection focused on service functionality</li>
                <li>• No location tracking for QR code scans</li>
                <li>• Secure storage and transmission of all data</li>
                <li>• Your right to access, modify, and delete your data</li>
                <li>• Transparent disclosure of data usage</li>
              </ul>
              <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
                <p className="text-info text-sm">
                  For complete details, please review our Privacy Policy, which is incorporated into these Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Service Limitations */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Service Limitations and Disclaimers</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Service Limitations</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Usage limits may apply to prevent abuse</li>
                  <li>• File size and content length restrictions</li>
                  <li>• Analytics data retention periods</li>
                  <li>• API rate limiting for automated access</li>
                  <li>• Storage quotas for user accounts</li>
                </ul>
              </div>

              <div className="bg-warning/10 rounded-xl p-6 border border-warning/20">
                <h4 className="text-warning font-medium mb-3">Disclaimers</h4>
                <ul className="space-y-2 text-warning/80 text-sm">
                  <li>• Service provided "as is" without warranties</li>
                  <li>• We don't guarantee QR code scanning success on all devices</li>
                  <li>• Analytics data may have delays or inaccuracies</li>
                  <li>• Third-party integrations may be subject to their own terms</li>
                  <li>• We're not responsible for content accessed through QR codes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Account Termination</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Your Rights</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Delete your account at any time</li>
                  <li>• Export your data before deletion</li>
                  <li>• Stop using the service without penalty</li>
                  <li>• Request data deletion within 30 days</li>
                </ul>
              </div>

              <div className="bg-surface/50 rounded-xl p-6 border border-border">
                <h4 className="text-lg font-medium text-foreground mb-3">Our Rights</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li>• Suspend accounts for Terms violations</li>
                  <li>• Terminate service with reasonable notice</li>
                  <li>• Remove content that violates policies</li>
                  <li>• Modify or discontinue features</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-warning" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Limitation of Liability</h3>
            </div>

            <div className="bg-warning/10 rounded-xl p-6 border border-warning/20">
              <p className="text-warning/90 text-sm leading-relaxed">
                To the maximum extent permitted by law, QR Nexus shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to loss 
                of profits, data, use, goodwill, or other intangible losses, resulting from your use of 
                the service. Our total liability shall not exceed the amount paid by you for the service 
                in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Changes to Terms</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                We reserve the right to modify these Terms at any time. When we do:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• We'll update the "Last updated" date</li>
                <li>• Significant changes will be communicated via email</li>
                <li>• Continued use constitutes acceptance of new Terms</li>
                <li>• You may terminate your account if you disagree with changes</li>
              </ul>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Contact and Support</h3>
            </div>

            <div className="bg-surface/50 rounded-xl p-6 border border-border">
              <p className="text-foreground mb-4">
                Questions about these Terms or need support? Contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>• Email: support@qrnexus.site</p>
                <p>• Legal inquiries: legal@qrnexus.site</p>
                <p>• Response time: Within 48 hours</p>
                <p>• Business hours: Monday-Friday, 9 AM - 5 PM EST</p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h4 className="text-primary font-medium mb-3">Governing Law and Jurisdiction</h4>
              <p className="text-primary/80 text-sm">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                where QR Nexus operates, without regard to conflict of law principles. Any disputes arising 
                from these Terms or your use of the service shall be resolved through binding arbitration 
                or in the courts of competent jurisdiction.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;