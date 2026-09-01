import React from 'react';
import { Play, Pause, Music2, Plus, Heart } from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import { useLikes } from '../context/LikesContext';
import { useToast } from './Toast';

export default function TrackCard({ track, queueList = [] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayer();
  const { isLiked, toggleLike } = useLikes();
  const { addToast } = useToast();

  const isCurrent = (currentTrack?._id || currentTrack?.id) === (track._id || track.id);
  const liked = isLiked(track._id || track.id);
  const gradientClass = getTrackGradient(track.title || track._id || 'aura');

  const handlePlayClick = (e) => {
    e.stopPropagation();
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
      onClick={handlePlayClick}
      className={`group relative p-3.5 rounded-2xl glass-card cursor-pointer transition-all flex flex-col justify-between ${
        isCurrent ? 'ring-2 ring-purple-500 bg-purple-950/20' : ''
      }`}
    >
      {/* Cover Image / Gradient Artwork */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
        <div className={`w-full h-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-105`}>
          <Music2 className={`w-10 h-10 text-white/80 ${isCurrent && isPlaying ? 'animate-bounce' : ''}`} />
        </div>

        {/* Top Floating Buttons: Like Heart & Add to Queue */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          {/* Like Heart Button */}
          <button
            onClick={handleLikeClick}
            className={`p-1.5 rounded-lg backdrop-blur-md transition-all shadow-md active:scale-90 ${
              liked
                ? 'bg-black/60 text-rose-500 opacity-100'
                : 'bg-black/40 text-slate-300 hover:text-rose-400 hover:bg-black/60 opacity-0 group-hover:opacity-100'
            }`}
            title={liked ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 scale-110' : ''} transition-transform`} />
          </button>

          {/* Quick Add To Queue Button */}
          <button
            onClick={handleAddToQueue}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-purple-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-md active:scale-90"
            title="Add to queue"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay Play Button on Hover */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center transition-opacity duration-200 ${
          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className={`text-sm font-bold truncate transition-colors ${
            isCurrent ? 'text-purple-300' : 'text-white group-hover:text-purple-300'
          }`}>
            {track.title}
          </div>
          <div className="text-xs text-slate-400 truncate mt-0.5">
            {typeof track.artist === 'object' ? track.artist?.username : (track.artist || 'Unknown Artist')}
          </div>
        </div>
        {liked && (
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0 mt-1" />
        )}
      </div>
    </div>
  );
}
