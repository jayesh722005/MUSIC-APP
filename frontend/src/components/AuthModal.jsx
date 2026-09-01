import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Sparkles, 
  Headphones, 
  Crown, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, setAuthModalMode, login, register } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // 'user' | 'artist'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (isLogin) {
        const identifier = (formData.username || formData.email || '').trim();
        if (!identifier) {
          setErrorMessage('Please enter your email or username');
          setLoading(false);
          return;
        }

        await login({
          identifier: identifier,
          username: identifier,
          email: identifier,
          password: formData.password,
        });
        addToast('Successfully signed in! Welcome back.', 'success');
        closeAuthModal();
      } else {
        await register({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: formData.role,
        });
        addToast(
          formData.role === 'artist' 
            ? 'Artist account created! Welcome to the Studio.' 
            : 'Welcome to AURA Music! Account ready.',
          'success'
        );
        closeAuthModal();
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormData({
      username: `${role}_demo_${randomSuffix}`,
      email: `${role}${randomSuffix}@auramusic.io`,
      password: 'password123',
      role: role,
    });
    setAuthModalMode('register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 bg-[#0d0f1a]/95">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30 mb-3">
            <div className="w-full h-full bg-[#0d0f18] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            {isLogin ? 'Welcome Back to AURA' : 'Create Your Sonic Identity'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in with your Gmail address or username' : 'Join our next-generation music network'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/5 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              isLogin
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isLogin
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Role Selector (Only during Registration) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'user' }))}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    formData.role === 'user'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-900/30'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Headphones className={`w-4 h-4 ${formData.role === 'user' ? 'text-purple-400' : 'text-slate-400'}`} />
                    {formData.role === 'user' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Listener</div>
                    <div className="text-[10px] text-slate-400">Stream & Like Music</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'artist' }))}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                    formData.role === 'artist'
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg shadow-amber-900/30'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Crown className={`w-4 h-4 ${formData.role === 'artist' ? 'text-amber-400' : 'text-slate-400'}`} />
                    {formData.role === 'artist' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Artist / Pro</div>
                    <div className="text-[10px] text-slate-400">Upload & Publish</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Username or Email */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isLogin ? 'Gmail Address or Username' : 'Username'}
            </label>
            <div className="relative">
              {isLogin ? (
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              ) : (
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              )}
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder={isLogin ? 'e.g. name@gmail.com or username' : 'e.g. skrillex_99'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Email (Required for Registration) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password with Show/Hide toggle */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="text-[11px] text-slate-400 text-center mb-2 font-medium">Quick 1-Click Demo Profiles</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('artist')}
              className="py-1.5 px-3 rounded-lg text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3 h-3" />
              <span>Demo Artist</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-1.5 px-3 rounded-lg text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <Headphones className="w-3 h-3" />
              <span>Demo Listener</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
