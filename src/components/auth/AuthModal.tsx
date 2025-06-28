import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp, resetPassword } = useAuth();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.');
        }
      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          onClose();
          resetForm();
        }
      } else if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Password reset email sent! Check your inbox.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="glass bg-glass-bg/90 border border-glass-border rounded-2xl shadow-glass p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === 'signin' && 'Sign in to access your QR codes'}
                {mode === 'signup' && 'Join QR Nexus today'}
                {mode === 'reset' && 'Enter your email to reset password'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-surface hover:bg-surface-hover rounded-xl flex items-center justify-center transition-colors border border-border"
            >
              <X className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" strokeWidth={1.5} />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" strokeWidth={1.5} />
              <p className="text-success text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder-muted-foreground transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder-muted-foreground transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder-muted-foreground transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white py-3 px-6 rounded-xl font-medium hover:shadow-glow disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                  <span>
                    {mode === 'signin' && 'Signing In...'}
                    {mode === 'signup' && 'Creating Account...'}
                    {mode === 'reset' && 'Sending Email...'}
                  </span>
                </>
              ) : (
                <span>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Email'}
                </span>
              )}
            </button>
          </form>

          {/* Mode Switching */}
          <div className="mt-8 text-center space-y-3">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => handleModeChange('reset')}
                  className="text-primary hover:text-primary/80 text-sm transition-colors"
                >
                  Forgot your password?
                </button>
                <div className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => handleModeChange('signup')}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => handleModeChange('signin')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-muted-foreground text-sm">
                Remember your password?{' '}
                <button
                  onClick={() => handleModeChange('signin')}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;