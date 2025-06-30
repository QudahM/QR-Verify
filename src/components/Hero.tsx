import React from 'react';
import { Zap, Shield, Download } from 'lucide-react';

const Hero: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-primary" strokeWidth={1.5} />,
      bg: "bg-primary/10 group-hover:bg-primary/20",
      title: "Instant Generation",
      text: "Create high-quality QR codes in milliseconds with our optimized rendering engine",
    },
    {
      icon: <Shield className="w-6 h-6 text-success" strokeWidth={1.5} />,
      bg: "bg-success/10 group-hover:bg-success/20",
      title: "Security First",
      text: "Advanced threat detection powered by real-time security databases and AI analysis",
    },
    {
      icon: <Download className="w-6 h-6 text-info" strokeWidth={1.5} />,
      bg: "bg-info/10 group-hover:bg-info/20",
      title: "Export Ready",
      text: "Download production-ready QR codes in multiple designs and formats with perfect clarity",
    },
  ];

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Advanced Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Primary geometric mesh */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path 
                  d="M30 0 L45 13 L45 39 L30 52 L15 39 L15 13 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="text-border opacity-20"
                />
              </pattern>
              <pattern id="dotGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle 
                  cx="20" 
                  cy="20" 
                  r="1" 
                  fill="currentColor" 
                  className="text-primary opacity-10"
                />
              </pattern>
              <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                <stop offset="50%" stopColor="hsl(var(--info))" stopOpacity="0.03" />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Hexagonal grid overlay */}
            <rect width="100%" height="100%" fill="url(#hexGrid)" />
            
            {/* Dot pattern overlay */}
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
            
            {/* Gradient mesh overlay */}
            <rect width="100%" height="100%" fill="url(#meshGradient)" />
          </svg>
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {/* Large background shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse-subtle"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-info/5 rounded-lg rotate-45 blur-lg animate-gentle-float"></div>
          <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-success/5 rounded-full blur-xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-warning/5 rounded-lg rotate-12 blur-lg animate-gentle-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Medium accent shapes */}
          <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-primary/8 rounded-lg rotate-45 blur-md animate-mesh-float"></div>
          <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-info/8 rounded-full blur-md animate-gentle-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/2 left-1/6 w-14 h-14 bg-success/8 rounded-lg rotate-12 blur-md animate-mesh-float" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Small detail shapes */}
          <div className="absolute top-1/4 right-1/2 w-8 h-8 bg-primary/10 rounded-full blur-sm animate-pulse-subtle" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-1/4 left-2/3 w-6 h-6 bg-info/10 rounded-lg rotate-45 blur-sm animate-gentle-float" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Subtle line patterns */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--info))" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Diagonal connection lines */}
            <line x1="0" y1="200" x2="400" y2="100" stroke="url(#lineGradient1)" strokeWidth="1" />
            <line x1="800" y1="150" x2="1200" y2="250" stroke="url(#lineGradient2)" strokeWidth="1" />
            <line x1="200" y1="600" x2="600" y2="500" stroke="url(#lineGradient1)" strokeWidth="1" />
            <line x1="600" y1="700" x2="1000" y2="600" stroke="url(#lineGradient2)" strokeWidth="1" />
            
            {/* Curved connection paths */}
            <path d="M100,300 Q400,200 700,350" stroke="url(#lineGradient1)" strokeWidth="1" fill="none" />
            <path d="M500,100 Q800,250 1100,200" stroke="url(#lineGradient2)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Radial gradient overlays for depth */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-info/8 via-info/4 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-success/6 via-success/3 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main Hero Content */}
        <div className="mb-16 animate-slide-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 leading-tight">
            <span className="text-foreground">Generate & Verify</span>
            <br />
            <span className="text-primary bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              QR Codes
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Create professional QR codes and verify their safety with advanced threat detection.
            Built for teams who demand excellence.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
          {features.map((item, i) => (
            <div key={i} className="group animate-fade-in h-full" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <div className="glass h-full flex flex-col bg-glass-bg/50 border border-glass-border rounded-2xl p-8 hover:bg-glass-bg/70 transition-all duration-300 hover:scale-105 hover:shadow-glass relative overflow-hidden">
                {/* Card background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <pattern id={`cardPattern${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1" fill="currentColor" className="text-primary" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#cardPattern${i})`} />
                  </svg>
                </div>
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 mx-auto transition-colors ${item.bg} relative z-10`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-foreground mb-4 text-center relative z-10">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light text-center mt-auto relative z-10">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;