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
      {/* Advanced Light Mode Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* Primary geometric mesh - Light Mode Optimized */}
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Light mode patterns with subtle contrast */}
              <pattern id="hexGridLight" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <path 
                  d="M30 0 L45 13 L45 39 L30 52 L15 39 L15 13 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.3" 
                  className="text-slate-300 dark:text-border dark:opacity-20"
                />
              </pattern>
              <pattern id="dotGridLight" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle 
                  cx="20" 
                  cy="20" 
                  r="0.8" 
                  fill="currentColor" 
                  className="text-slate-400 dark:text-primary dark:opacity-10"
                />
              </pattern>
              
              {/* Light mode gradient mesh */}
              <linearGradient id="meshGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.03" />
                <stop offset="50%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0.02" />
                <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.03" />
              </linearGradient>
              
              {/* Sophisticated light mode radial gradients */}
              <radialGradient id="lightAccent1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.06" />
                <stop offset="70%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.02" />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
              </radialGradient>
              
              <radialGradient id="lightAccent2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0.05" />
                <stop offset="70%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0.015" />
                <stop offset="100%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0" />
              </radialGradient>
              
              <radialGradient id="lightAccent3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.04" />
                <stop offset="70%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.01" />
                <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0" />
              </radialGradient>
            </defs>
            
            {/* Hexagonal grid overlay - lighter for light mode */}
            <rect width="100%" height="100%" fill="url(#hexGridLight)" />
            
            {/* Dot pattern overlay - more subtle */}
            <rect width="100%" height="100%" fill="url(#dotGridLight)" />
            
            {/* Gradient mesh overlay - very subtle */}
            <rect width="100%" height="100%" fill="url(#meshGradientLight)" />
          </svg>
        </div>

        {/* Light Mode Floating Geometric Shapes */}
        <div className="absolute inset-0">
          {/* Large background shapes - optimized for light mode */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-slate-200/30 dark:bg-primary/5 rounded-full blur-2xl animate-pulse-subtle"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200/25 dark:bg-info/5 rounded-lg rotate-45 blur-xl animate-gentle-float"></div>
          <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-emerald-200/25 dark:bg-success/5 rounded-full blur-2xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-amber-200/20 dark:bg-warning/5 rounded-lg rotate-12 blur-xl animate-gentle-float" style={{ animationDelay: '1s' }}></div>
          
          {/* Medium accent shapes - light mode specific */}
          <div className="absolute top-1/3 left-1/2 w-16 h-16 bg-slate-300/20 dark:bg-primary/8 rounded-lg rotate-45 blur-lg animate-mesh-float"></div>
          <div className="absolute top-2/3 right-1/4 w-12 h-12 bg-blue-300/20 dark:bg-info/8 rounded-full blur-lg animate-gentle-float" style={{ animationDelay: '3s' }}></div>
          <div className="absolute bottom-1/2 left-1/6 w-14 h-14 bg-emerald-300/20 dark:bg-success/8 rounded-lg rotate-12 blur-lg animate-mesh-float" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Small detail shapes - very subtle in light mode */}
          <div className="absolute top-1/4 right-1/2 w-8 h-8 bg-slate-400/15 dark:bg-primary/10 rounded-full blur-md animate-pulse-subtle" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-1/4 left-2/3 w-6 h-6 bg-blue-400/15 dark:bg-info/10 rounded-lg rotate-45 blur-md animate-gentle-float" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Light Mode Line Patterns */}
        <div className="absolute inset-0 opacity-15 dark:opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              {/* Light mode line gradients */}
              <linearGradient id="lineGradientLight1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradientLight2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(188, 94%, 42%)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradientLight3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Diagonal connection lines - more subtle in light mode */}
            <line x1="0" y1="200" x2="400" y2="100" stroke="url(#lineGradientLight1)" strokeWidth="0.8" />
            <line x1="800" y1="150" x2="1200" y2="250" stroke="url(#lineGradientLight2)" strokeWidth="0.8" />
            <line x1="200" y1="600" x2="600" y2="500" stroke="url(#lineGradientLight1)" strokeWidth="0.8" />
            <line x1="600" y1="700" x2="1000" y2="600" stroke="url(#lineGradientLight3)" strokeWidth="0.8" />
            
            {/* Curved connection paths - elegant light mode styling */}
            <path d="M100,300 Q400,200 700,350" stroke="url(#lineGradientLight1)" strokeWidth="0.8" fill="none" />
            <path d="M500,100 Q800,250 1100,200" stroke="url(#lineGradientLight2)" strokeWidth="0.8" fill="none" />
            <path d="M200,500 Q500,400 800,550" stroke="url(#lineGradientLight3)" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        {/* Light Mode Radial Gradient Overlays */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl">
          <div className="w-full h-full bg-gradient-radial from-blue-100/40 via-blue-50/20 to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent"></div>
        </div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl">
          <div className="w-full h-full bg-gradient-radial from-emerald-100/35 via-emerald-50/15 to-transparent dark:from-info/8 dark:via-info/4 dark:to-transparent"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl">
          <div className="w-full h-full bg-gradient-radial from-slate-100/30 via-slate-50/15 to-transparent dark:from-success/6 dark:via-success/3 dark:to-transparent"></div>
        </div>

        {/* Light Mode Paper Texture Overlay */}
        <div className="absolute inset-0 opacity-30 dark:opacity-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern id="paperTexture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none"/>
                <circle cx="25" cy="25" r="0.5" fill="#e2e8f0" opacity="0.3"/>
                <circle cx="75" cy="75" r="0.3" fill="#cbd5e1" opacity="0.4"/>
                <circle cx="50" cy="10" r="0.4" fill="#e2e8f0" opacity="0.2"/>
                <circle cx="10" cy="60" r="0.3" fill="#cbd5e1" opacity="0.3"/>
                <circle cx="90" cy="40" r="0.2" fill="#e2e8f0" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paperTexture)"/>
          </svg>
        </div>

        {/* Light Mode Sophisticated Mesh Pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern id="sophisticatedMesh" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <rect width="120" height="120" fill="none"/>
                <path d="M0,60 Q30,30 60,60 Q90,90 120,60" stroke="#e2e8f0" strokeWidth="0.5" fill="none" opacity="0.6"/>
                <path d="M60,0 Q90,30 60,60 Q30,90 60,120" stroke="#cbd5e1" strokeWidth="0.5" fill="none" opacity="0.4"/>
                <circle cx="60" cy="60" r="1" fill="#94a3b8" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sophisticatedMesh)"/>
          </svg>
        </div>

        {/* Light Mode Premium Accent Overlays */}
        <div className="absolute inset-0">
          {/* Subtle color accent areas */}
          <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-conic from-blue-100/20 via-transparent to-blue-100/20 dark:from-primary/5 dark:via-transparent dark:to-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-36 h-36 bg-gradient-conic from-emerald-100/20 via-transparent to-emerald-100/20 dark:from-success/5 dark:via-transparent dark:to-success/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gradient-conic from-slate-100/25 via-transparent to-slate-100/25 dark:from-info/4 dark:via-transparent dark:to-info/4 rounded-full blur-2xl"></div>
        </div>
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
                {/* Light mode card background pattern */}
                <div className="absolute inset-0 opacity-8 dark:opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <pattern id={`cardPatternLight${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="0.8" fill="currentColor" className="text-slate-300 dark:text-primary" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#cardPatternLight${i})`} />
                  </svg>
                </div>
                
                {/* Light mode card accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-slate-100/40 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent rounded-full blur-xl"></div>
                
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

      {/* Light Mode Bottom Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;