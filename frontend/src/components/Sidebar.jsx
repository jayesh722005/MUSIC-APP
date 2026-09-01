import React from 'react';
import { 
  Compass, 
  Disc3, 
  Search, 
  Sparkles, 
  PlusCircle, 
  Music2, 
  Heart, 
  Radio, 
  Flame, 
  SlidersHorizontal,
  Crown,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { useLikes } from '../context/LikesContext';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { user, isAuthenticated, isArtist, openAuthModal } = useAuth();
  const { isPlaying } = usePlayer();
  const { likedCount } = useLikes();

  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'albums', label: 'Albums & EP', icon: Disc3 },
    { id: 'search', label: 'Search & Filter', icon: Search },
    { id: 'favorites', label: 'Liked Tracks', icon: Heart, badge: likedCount > 0 ? likedCount : null },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static top-0 left-0 h-full w-64 glass-panel border-r border-white/5 flex flex-col z-40
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f18] rounded-[10px] flex items-center justify-center">
                <Music2 className={`w-5 h-5 text-purple-400 ${isPlaying ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-['Space_Grotesk']">
                AURA <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-sans font-semibold border border-purple-500/30">HQ</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Sonic Universe</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-900/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive 
                        ? (item.id === 'favorites' ? 'text-rose-400 fill-rose-500' : 'text-purple-400') 
                        : (item.id === 'favorites' && likedCount > 0 ? 'text-rose-400/80' : 'text-slate-400')
                    }`} />
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                        {item.badge}
                      </span>
                    )}
                    {isActive && item.badge === null && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Artist Studio Navigation Section */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Creator Hub</span>
              {isArtist && (
                <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  Artist
                </span>
              )}
            </div>

            {isArtist ? (
              <button
                onClick={() => handleNavClick('studio')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  activeTab === 'studio'
                    ? 'bg-gradient-to-r from-violet-600/40 via-purple-600/30 to-cyan-600/20 text-white border border-purple-500/40 shadow-lg shadow-purple-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-purple-950/30 border border-purple-500/20'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow group-hover:scale-110" />
                <span>Artist Studio</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  PRO
                </span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-gradient-to-b from-purple-950/30 to-indigo-950/20 border border-purple-500/20">
                <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold mb-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Release Your Music</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Join as an Artist to upload lossless tracks and launch custom albums.
                </p>
                <button
                  onClick={() => openAuthModal('register')}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Become an Artist</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User / Authentication Footer */}
        <div className="p-4 border-t border-white/5">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.username ? user.username.slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate flex items-center gap-1">
                  {user?.username}
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isArtist ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  {isArtist ? 'Verified Artist' : 'Listener'}
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all hover:border-purple-500/40"
            >
              <LogIn className="w-4 h-4 text-purple-400" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
