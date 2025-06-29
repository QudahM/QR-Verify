import React from 'react';
import { Briefcase, Calendar, Heart, Zap, Palette, Star } from 'lucide-react';
import { QRStyle } from './QRCustomizer';

interface TemplateSelectorProps {
  onTemplateSelect: (style: Partial<QRStyle>) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onTemplateSelect }) => {
  const templates = [
    {
      id: 'business',
      name: 'Business Professional',
      description: 'Clean and corporate design',
      icon: Briefcase,
      style: {
        foregroundColor: '#1a365d',
        backgroundColor: '#ffffff',
        eyeColor: '#2d3748',
        eyeStyle: 'square' as const,
        dataStyle: 'square' as const,
        gradient: {
          enabled: false,
          type: 'linear' as const,
          colors: ['#1a365d', '#2d3748'],
          direction: 45,
        },
      },
      colors: ['#1a365d', '#ffffff', '#2d3748'],
    },
    {
      id: 'modern',
      name: 'Modern Gradient',
      description: 'Vibrant gradient design',
      icon: Zap,
      style: {
        foregroundColor: '#667eea',
        backgroundColor: '#ffffff',
        eyeColor: '#764ba2',
        eyeStyle: 'rounded' as const,
        dataStyle: 'rounded' as const,
        gradient: {
          enabled: true,
          type: 'linear' as const,
          colors: ['#667eea', '#764ba2'],
          direction: 45,
        },
      },
      colors: ['#667eea', '#764ba2', '#ffffff'],
    },
    {
      id: 'event',
      name: 'Event & Party',
      description: 'Fun and colorful design',
      icon: Calendar,
      style: {
        foregroundColor: '#f093fb',
        backgroundColor: '#ffffff',
        eyeColor: '#f5576c',
        eyeStyle: 'circle' as const,
        dataStyle: 'circle' as const,
        gradient: {
          enabled: true,
          type: 'radial' as const,
          colors: ['#f093fb', '#f5576c'],
          direction: 0,
        },
      },
      colors: ['#f093fb', '#f5576c', '#ffffff'],
    },
    {
      id: 'nature',
      name: 'Nature & Eco',
      description: 'Earth-friendly green tones',
      icon: Heart,
      style: {
        foregroundColor: '#11998e',
        backgroundColor: '#ffffff',
        eyeColor: '#38ef7d',
        eyeStyle: 'leaf' as const,
        dataStyle: 'rounded' as const,
        gradient: {
          enabled: true,
          type: 'linear' as const,
          colors: ['#11998e', '#38ef7d'],
          direction: 135,
        },
      },
      colors: ['#11998e', '#38ef7d', '#ffffff'],
    },
    {
      id: 'luxury',
      name: 'Luxury Gold',
      description: 'Premium golden design',
      icon: Star,
      style: {
        foregroundColor: '#b8860b',
        backgroundColor: '#fffef7',
        eyeColor: '#daa520',
        eyeStyle: 'diamond' as const,
        dataStyle: 'square' as const,
        gradient: {
          enabled: true,
          type: 'linear' as const,
          colors: ['#b8860b', '#daa520'],
          direction: 90,
        },
      },
      colors: ['#b8860b', '#daa520', '#fffef7'],
    },
    {
      id: 'creative',
      name: 'Creative Arts',
      description: 'Artistic and expressive',
      icon: Palette,
      style: {
        foregroundColor: '#8b5cf6',
        backgroundColor: '#ffffff',
        eyeColor: '#a78bfa',
        eyeStyle: 'rounded' as const,
        dataStyle: 'dots' as const,
        gradient: {
          enabled: true,
          type: 'radial' as const,
          colors: ['#8b5cf6', '#a78bfa'],
          direction: 0,
        },
      },
      colors: ['#8b5cf6', '#a78bfa', '#ffffff'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Professional Templates</h3>
        <p className="text-xs text-muted-foreground mb-6">
          Choose from pre-designed templates optimized for different use cases
        </p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onTemplateSelect(template.style)}
              className="w-full bg-surface/50 hover:bg-surface border border-border rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-medium text-foreground mb-1">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>

                <div className="flex space-x-1">
                  {template.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom Template Info */}
      <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
        <h4 className="text-sm font-medium text-primary mb-2">Custom Templates</h4>
        <p className="text-xs text-primary/80">
          Templates provide a starting point. You can further customize colors, styles, and add your logo after selecting a template.
        </p>
      </div>
    </div>
  );
};

export default TemplateSelector;