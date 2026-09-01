import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Volume1,
  ListMusic, 
  Maximize2,
  Music2, 
  AlertCircle,
  Heart
} from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import { useLikes } from '../context/LikesContext';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    audioError,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    setIsVisualizerOpen,
    setIsQueueOpen,
    isQueueOpen,
  } = usePlayer();

  const { isLiked, toggleLike } = useLikes();

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 glass-panel border-t border-white/5 px-6 flex items-center justify-between z-30 opacity-70">
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Music2 className="w-5 h-5 text-slate-500" />
          </div>
          <span>Select any track to start listening</span>
        </div>
      </div>
    );
  }

  const gradientClass = getTrackGradient(currentTrack.title || currentTrack._id || 'aura');
  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const liked = isLiked(currentTrack._id || currentTrack.id);

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-22 glass-panel border-t border-white/10 px-4 md:px-8 flex items-center justify-between z-30 gap-4 shadow-2xl backdrop-blur-2xl bg-[#0b0d18]/90">
      {/* Left: Track Details & Like Button */}
      <div className="flex items-center gap-3 min-w-0 w-1/4 max-w-[280px]">
        <div className="relative group cursor-pointer shrink-0" onClick={() => setIsVisualizerOpen(true)}>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform overflow-hidden relative`}>
            <Music2 className={`w-6 h-6 text-white/90 ${isPlaying ? 'animate-bounce' : ''}`} />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-0.5">
                <span className="eq-bar h-2 animate-soundwave-1" />
                <span className="eq-bar h-4 animate-soundwave-2" />
                <span className="eq-bar h-3 animate-soundwave-3" />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white truncate hover:underline cursor-pointer" onClick={() => setIsVisualizerOpen(true)}>
            {currentTrack.title || 'Untitled Track'}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {typeof currentTrack.artist === 'object' ? currentTrack.artist?.username : (currentTrack.artist || 'Unknown Artist')}
          </div>
          {audioError && (
            <div className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>Stream error</span>
            </div>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-2 rounded-xl transition-all shrink-0 active:scale-90 ${
            liked
              ? 'text-rose-500 hover:text-rose-400 bg-rose-500/10'
              : 'text-slate-400 hover:text-rose-400 hover:bg-white/5'
          }`}
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 scale-110' : ''} transition-transform`} />
        </button>
      </div>

      {/* Center: Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-2xl">
        {/* Playback Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full hover:bg-white/5 transition-colors ${
              isShuffle ? 'text-purple-400 shadow-sm shadow-purple-400/50' : 'text-slate-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={prevTrack}
            className="p-1.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
            title="Previous"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="p-1.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-full hover:bg-white/5 transition-colors ${
              repeatMode !== 'off' ? 'text-purple-400' : 'text-slate-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress Bar & Timers */}
        <div className="w-full flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="w-9 text-right">{formatTime(progress)}</span>
          <div className="relative flex-1 group py-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={progress || 0}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #a855f7 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`
              }}
            />
          </div>
          <span className="w-9 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra Utilities */}
      <div className="flex items-center justify-end gap-3 w-1/4 max-w-[220px]">
        {/* Queue Drawer Toggle */}
        <button
          onClick={() => setIsQueueOpen(!isQueueOpen)}
          className={`p-2 rounded-xl transition-colors ${
            isQueueOpen ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Play Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Fullscreen Visualizer Modal Toggle */}
        <button
          onClick={() => setIsVisualizerOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:block"
          title="Visualizer Mode"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-18 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </footer>
  );
}
