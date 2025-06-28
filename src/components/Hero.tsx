import React from 'react';
import { Zap, Shield, Download } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Main Hero Content */}
        <div className="mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
            <span className="text-foreground">
              Generate & Verify
            </span>
            <br />
            <span className="text-primary">
              QR Codes
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Create professional QR codes and verify their safety with advanced threat detection. 
            Built for teams who demand excellence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 hover:bg-glass-bg/70 transition-all duration-300 hover:scale-105 hover:shadow-glass">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-4">Instant Generation</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Create high-quality QR codes in milliseconds with our optimized rendering engine
              </p>
            </div>
          </div>

          <div className="group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 hover:bg-glass-bg/70 transition-all duration-300 hover:scale-105 hover:shadow-glass">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-success/20 transition-colors">
                <Shield className="w-6 h-6 text-success" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-4">Security First</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Advanced threat detection powered by real-time security databases and AI analysis
              </p>
            </div>
          </div>

          <div className="group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="glass bg-glass-bg/50 border border-glass-border rounded-2xl p-8 hover:bg-glass-bg/70 transition-all duration-300 hover:scale-105 hover:shadow-glass">
              <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-info/20 transition-colors">
                <Download className="w-6 h-6 text-info" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-4">Export Ready</h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                Download production-ready QR codes in multiple formats with perfect clarity
              </p>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
};

export default Hero;