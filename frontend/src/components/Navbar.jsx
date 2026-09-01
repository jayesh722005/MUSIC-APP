import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  Sparkles, 
  Upload, 
  LogOut, 
  User, 
  Crown, 
  Headphones, 
  ChevronDown, 
  Radio,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  setActiveTab, 
  setMobileOpen,
  allTracks = [],
  allAlbums = []
}) {
  const { user, isAuthenticated, isArtist, logout, openAuthModal } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 px-4 lg:px-8 glass-panel border-b border-white/5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Live Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search songs, albums, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full pl-10 pr-9 py-2 rounded-full bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right: Actions & User Section */}
      <div className="flex items-center gap-3">
        {isArtist && (
          <button
            onClick={() => setActiveTab('studio')}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all hover:scale-105"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Track</span>
          </button>
        )}

        {isAuthenticated ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px]">
                <div className="w-full h-full bg-[#0d0f18] rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {user?.username ? user.username.slice(0, 1).toUpperCase() : 'U'}
                </div>
              </div>
              <span className="hidden md:inline-block text-xs font-medium text-slate-200 group-hover:text-white max-w-[100px] truncate">
                {user?.username}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                  <div className="text-xs font-bold text-white truncate">{user?.username}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user?.email}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {isArtist ? <Crown className="w-3 h-3 text-amber-400" /> : <Headphones className="w-3 h-3" />}
                    <span>{isArtist ? 'Artist Account' : 'Listener'}</span>
                  </div>
                </div>

                {isArtist ? (
                  <button
                    onClick={() => {
                      setActiveTab('studio');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Artist Studio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('register');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-amber-300 hover:bg-amber-500/10 transition-colors"
                  >
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Become an Artist</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-1 border-t border-white/5 pt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuthModal('login')}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
