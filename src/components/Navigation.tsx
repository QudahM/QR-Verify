import React from 'react';
import { QrCode, Shield, LayoutDashboard, User } from 'lucide-react';

type ActiveTab = 'generator' | 'scanner' | 'dashboard';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, user }) => {
  return (
    <nav className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-center">
        <div className="glass bg-glass-bg/80 border border-glass-border rounded-2xl p-2 shadow-glass-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => onTabChange('generator')}
              className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'generator'
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
              }`}
            >
              <QrCode className="w-4 h-4" strokeWidth={1.5} />
              <span>Generate</span>
            </button>
            
            <button
              onClick={() => onTabChange('scanner')}
              className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'scanner'
                  ? 'bg-success text-white shadow-glow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
              }`}
            >
              <Shield className="w-4 h-4" strokeWidth={1.5} />
              <span>Verify Safety</span>
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-info text-white shadow-glow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
              }`}
            >
              {user ? (
                <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <User className="w-4 h-4" strokeWidth={1.5} />
              )}
              <span>{user ? 'Dashboard' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;