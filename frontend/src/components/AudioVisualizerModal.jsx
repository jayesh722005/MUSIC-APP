import React, { useEffect, useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Music2, 
  Sparkles,
  Disc,
  Heart
} from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import { useLikes } from '../context/LikesContext';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AudioVisualizerModal() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isVisualizerOpen,
    setIsVisualizerOpen,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const { isLiked, toggleLike } = useLikes();

  const [bars, setBars] = useState(() => Array.from({ length: 48 }, () => Math.floor(Math.random() * 60) + 10));

  // Dynamic visualizer bar animation loop when playing
  useEffect(() => {
    if (!isPlaying || !isVisualizerOpen) return;

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 85) + 15));
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying, isVisualizerOpen]);

  if (!isVisualizerOpen || !currentTrack) return null;

  const gradientClass = getTrackGradient(currentTrack.title || 'aura');
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const liked = isLiked(currentTrack._id || currentTrack.id);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-[#070811] animate-in fade-in zoom-in-95 duration-300">
      {/* Radiant Glowing Background Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar: Close & Mode */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">AURA Sonic Space</div>
            <div className="text-[11px] text-purple-400 font-medium">Lossless Audio Stream</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Like Heart Button */}
          <button
            onClick={() => toggleLike(currentTrack)}
            className={`p-3 rounded-full transition-all active:scale-95 flex items-center gap-2 text-xs font-semibold ${
              liked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white'
            }`}
            title={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline-block">{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            onClick={() => setIsVisualizerOpen(false)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center: Cosmic Spinning Disc & Visualizer Bars */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center">
        {/* Vinyl / Cover Artwork */}
        <div className="relative mb-8 group">
          <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr ${gradientClass} p-3 shadow-[0_0_80px_rgba(139,92,246,0.35)] transition-all ${
            isPlaying ? 'animate-[spin_16s_linear_infinite]' : ''
          }`}>
            <div className="w-full h-full rounded-full bg-[#0a0b12] border-4 border-white/10 flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Vinyl Grooves */}
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-10 rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/5" />
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center p-1 shadow-lg">
                <div className="w-6 h-6 rounded-full bg-[#0a0b12] border-2 border-white/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Track Title & Artist */}
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 font-['Space_Grotesk'] max-w-2xl px-4">
          {currentTrack.title}
        </h2>
        <p className="text-base md:text-lg text-purple-300 font-medium">
          {typeof currentTrack.artist === 'object' ? currentTrack.artist?.username : currentTrack.artist}
        </p>

        {/* Audio Visualizer Spectrum Bars */}
        <div className="flex items-end justify-center gap-1 md:gap-1.5 h-24 mt-8 max-w-3xl w-full px-4">
          {bars.map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-150 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              style={{
                height: isPlaying ? `${height}%` : '6%',
                opacity: isPlaying ? 0.85 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom: Extended Control Suite */}
      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-6">
        {/* Progress Slider */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress || 0}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-purple-400"
              style={{
                background: `linear-gradient(to right, #a855f7 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
              isShuffle ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={prevTrack}
              className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all hover:scale-110"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
              ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all hover:scale-110"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={toggleRepeat}
            className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
              repeatMode !== 'off' ? 'text-purple-400 bg-purple-500/20' : 'text-slate-400'
            }`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
