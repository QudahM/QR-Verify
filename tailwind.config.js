/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        // Dark mode colors
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        info: 'hsl(var(--info))',
        surface: 'hsl(var(--surface))',
        'surface-hover': 'hsl(var(--surface-hover))',
        'glass-bg': 'hsl(var(--glass-bg))',
        'glass-border': 'hsl(var(--glass-border))',
        // Rich dark background colors
        'navy-deep': '#0a0f1a',
        'charcoal': '#1c1c24',
        'violet-muted': '#2a1b3d',
        'midnight': '#101624',
      },
      backgroundImage: {
        'rich-dark': `
          radial-gradient(circle at 20% 80%, rgba(42, 27, 61, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 22, 36, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(28, 28, 36, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #0a0f1a 0%, #1c1c24 25%, #101624 50%, #2a1b3d 75%, #0a0f1a 100%)
        `,
        'rich-light': `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
          linear-gradient(135deg, #f8fafc 0%, #f1f5f9 25%, #e2e8f0 50%, #cbd5e1 75%, #f8fafc 100%)
        `,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'mesh-float': 'meshFloat 8s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          }
        },
        gentleFloat: {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: '0.7'
          },
          '33%': {
            transform: 'translate(10px, -10px) rotate(2deg)',
            opacity: '0.9'
          },
          '66%': {
            transform: 'translate(-5px, 5px) rotate(-1deg)',
            opacity: '0.8'
          }
        },
        meshFloat: {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
            opacity: '0.6'
          },
          '25%': {
            transform: 'translate(8px, -12px) rotate(1deg) scale(1.05)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'translate(-6px, -8px) rotate(-0.5deg) scale(0.95)',
            opacity: '0.9'
          },
          '75%': {
            transform: 'translate(-10px, 6px) rotate(0.5deg) scale(1.02)',
            opacity: '0.7'
          }
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 2px 16px 0 rgba(0, 0, 0, 0.2)',
        'glass-light': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-light-sm': '0 2px 16px 0 rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.2)',
        'rich-glow': '0 0 30px rgba(42, 27, 61, 0.4), 0 0 60px rgba(16, 22, 36, 0.2)',
      },
      blur: {
        '3xl': '64px',
      },
    },
  },
  plugins: [],
};