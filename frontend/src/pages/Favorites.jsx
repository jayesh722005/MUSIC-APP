import React, { useState } from 'react';
import { Heart, Play, Pause, Search, Sparkles, Music2, Compass, Disc3 } from 'lucide-react';
import { useLikes } from '../context/LikesContext';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import TrackRow from '../components/TrackRow';

export default function Favorites({ setActiveTab }) {
  const { likedTracks, loadingLikes } = useLikes();
  const { playTrack, playAlbum, currentTrack, isPlaying } = usePlayer();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTracks = likedTracks.filter((track) => {
    const title = track.title?.toLowerCase() || '';
    const artist = typeof track.artist === 'object' ? track.artist?.username?.toLowerCase() : (track.artist?.toLowerCase() || '');
    const q = filterQuery.trim().toLowerCase();
    return title.includes(q) || artist.includes(q);
  });

  const isCurrentInLiked = currentTrack && likedTracks.some(t => (t._id || t.id) === (currentTrack._id || currentTrack.id));
  const isAllPlaying = isPlaying && isCurrentInLiked;

  const handlePlayAll = () => {
    if (likedTracks.length === 0) return;
    playTrack(likedTracks[0], likedTracks);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 lg:p-12 max-w-xl mx-auto text-center space-y-6 pt-16">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-rose-600/30">
          <Heart className="w-10 h-10 fill-current animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Your Liked Tracks Live Here
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Sign in with your Gmail or account to start liking songs, creating your private collection, and syncing your cloud library across devices.
          </p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  if (loadingLikes && likedTracks.length === 0) {
    return (
      <div className="p-4 lg:p-8 space-y-6 animate-pulse">
        <div className="h-56 rounded-3xl bg-white/5" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8 pb-32">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-rose-500/20 p-6 md:p-8 shadow-2xl bg-gradient-to-r from-rose-950/40 via-[#131526]/80 to-purple-950/40">
        {/* Glow Spheres */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-rose-600/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-60 h-60 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Glowing Big Heart Icon Box */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-tr from-rose-600 via-pink-600 to-purple-700 flex items-center justify-center text-white shadow-2xl shadow-rose-600/40 shrink-0 relative overflow-hidden group">
            <Heart className="w-20 h-20 fill-white group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Text Info */}
          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Playlist</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-['Space_Grotesk'] leading-tight">
              Liked Tracks
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Saved by <span className="text-rose-300 font-semibold">{user?.username}</span> • {likedTracks.length} {likedTracks.length === 1 ? 'track' : 'tracks'} in your collection
            </p>

            {/* Play All Liked Songs */}
            <div className="pt-3">
              <button
                onClick={handlePlayAll}
                disabled={likedTracks.length === 0}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 mx-auto md:mx-0 disabled:opacity-50"
              >
                {isAllPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Now Playing Liked Songs</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Play Liked Songs</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search within Liked Tracks */}
      {likedTracks.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search within your liked songs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500/50"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
            {filteredTracks.length} of {likedTracks.length} tracks
          </span>
        </div>
      )}

      {/* Tracklist or Empty State */}
      {likedTracks.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-white/5 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 text-slate-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Liked Songs Yet</h3>
            <p className="text-xs text-slate-400">
              Tap the heart icon on any song you enjoy while listening or exploring, and it will be saved right here.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Music</span>
          </button>
        </div>
      ) : filteredTracks.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
          No liked songs matching "{filterQuery}"
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTracks.map((track, idx) => (
            <TrackRow
              key={track._id || track.id || idx}
              track={track}
              index={idx}
              queueList={filteredTracks}
            />
          ))}
        </div>
      )}
    </div>
  );
}
