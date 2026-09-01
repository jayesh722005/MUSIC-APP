import React from 'react';
import { Play, Disc3, Layers } from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';

export default function AlbumCard({ album, onSelect }) {
  const { playAlbum, currentTrack, isPlaying } = usePlayer();

  const gradientClass = getTrackGradient(album.title || album._id || 'album');
  const trackCount = Array.isArray(album.musics) ? album.musics.length : (album.music ? album.music.length : 0);

  const handlePlayAlbum = (e) => {
    e.stopPropagation();
    playAlbum(album);
  };

  return (
    <div
      onClick={() => onSelect(album)}
      className="group relative p-4 rounded-2xl glass-card cursor-pointer transition-all flex flex-col justify-between"
    >
      {/* Stacked Vinyl Artwork */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3">
        {/* Vinyl disc peeking out behind sleeve */}
        <div className="absolute top-1 right-1 w-full h-full rounded-xl bg-slate-900/80 border border-white/10 -z-10 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300 flex items-center justify-center">
          <Disc3 className="w-1/2 h-1/2 text-white/20 animate-spin-slow" />
        </div>

        {/* Front Cover */}
        <div className={`w-full h-full bg-gradient-to-tr ${gradientClass} flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden`}>
          <Disc3 className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-300" />
          
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Track count badge */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-purple-200 border border-white/10 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
          </div>
        </div>

        {/* Hover Play Button */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePlayAlbum}
            className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 hover:scale-110 active:scale-95 transition-all"
            title="Play Album"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      {/* Album Info */}
      <div>
        <div className="text-sm font-bold text-white group-hover:text-purple-300 truncate transition-colors">
          {album.title}
        </div>
        <div className="text-xs text-slate-400 truncate mt-0.5">
          {typeof album.artist === 'object' ? album.artist?.username : (album.artist || 'Various Artists')}
        </div>
      </div>
    </div>
  );
}
