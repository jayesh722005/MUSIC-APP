import React from 'react';
import { Play, Pause, Plus, Music2, Heart } from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import { useLikes } from '../context/LikesContext';
import { useToast } from './Toast';

export default function TrackRow({ track, index, queueList = [] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayer();
  const { isLiked, toggleLike } = useLikes();
  const { addToast } = useToast();

  const isCurrent = (currentTrack?._id || currentTrack?.id) === (track._id || track.id);
  const liked = isLiked(track._id || track.id);
  const gradientClass = getTrackGradient(track.title || track._id || 'aura');

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueList.length > 0 ? queueList : [track]);
    }
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue(track);
    addToast(`"${track.title}" added to queue`, 'info');
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(track);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all border ${
        isCurrent
          ? 'bg-purple-600/15 border-purple-500/30 text-white shadow-lg shadow-purple-950/40'
          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-slate-300'
      }`}
    >
      {/* Left: Index / Play & Artwork & Title */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Index or Equalizer or Play Icon */}
        <div className="w-7 text-center shrink-0">
          {isCurrent && isPlaying ? (
            <div className="flex items-center justify-center gap-0.5">
              <span className="eq-bar h-2 animate-soundwave-1" />
              <span className="eq-bar h-3.5 animate-soundwave-2" />
              <span className="eq-bar h-2.5 animate-soundwave-3" />
            </div>
          ) : (
            <span className="text-xs font-mono text-slate-400 group-hover:hidden">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          <button className="hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white mx-auto transition-transform active:scale-95">
            {isCurrent && isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Thumbnail artwork */}
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shrink-0 shadow-sm`}>
          <Music2 className="w-5 h-5" />
        </div>

        {/* Track & Artist Info */}
        <div className="min-w-0 flex-1 pr-2">
          <div className={`text-sm font-semibold truncate ${
            isCurrent ? 'text-purple-300 font-bold' : 'text-white group-hover:text-purple-300'
          }`}>
            {track.title}
          </div>
          <div className="text-xs text-slate-400 truncate">
            {typeof track.artist === 'object' ? track.artist?.username : (track.artist || 'Unknown Artist')}
          </div>
        </div>
      </div>

      {/* Right: Actions (Like Heart & Add To Queue) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Like Heart Button */}
        <button
          onClick={handleLikeClick}
          className={`p-2 rounded-xl transition-all active:scale-90 ${
            liked
              ? 'text-rose-500 hover:text-rose-400 bg-rose-500/10'
              : 'text-slate-400 hover:text-rose-400 hover:bg-white/10 opacity-0 group-hover:opacity-100'
          }`}
          title={liked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Add to Queue Button */}
        <button
          onClick={handleAddToQueue}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          title="Add to queue"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
