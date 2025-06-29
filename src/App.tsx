import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QrCode, User, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import AuthModal from './components/auth/AuthModal';
import Dashboard from './components/dashboard/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

type ActiveTab = 'generator' | 'scanner' | 'dashboard';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    setActiveTab('generator');
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'dashboard' && !user) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass bg-glass-bg/80 border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-glow-sm">
                <QrCode className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  QR Nexus
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Professional QR Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 bg-surface hover:bg-surface-hover rounded-lg flex items-center justify-center transition-colors border border-border"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                ) : (
                  <Moon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-surface rounded-lg border border-border">
                    <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-sm text-foreground font-medium">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 rounded-lg border border-destructive/20 transition-colors text-destructive"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg transition-colors text-white font-medium shadow-glow-sm"
                >
                  <User className="w-4 h-4" strokeWidth={1.5} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - only show when not on dashboard */}
      {activeTab !== 'dashboard' && <Hero />}

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} user={user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="animate-fade-in">
          {activeTab === 'generator' && <QRGenerator />}
          {activeTab === 'scanner' && <QRScanner />}
          {activeTab === 'dashboard' && user && <Dashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-4">© 2025 QR Nexus. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Privacy Policy</button>
            <span>•</span>
            <button className="hover:text-foreground transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/*" element={<MainApp />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;