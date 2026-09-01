import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Disc3, 
  Layers, 
  Clock, 
  User, 
  Sparkles,
  Music2
} from 'lucide-react';
import { musicApi } from '../services/api';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import TrackRow from '../components/TrackRow';

export default function AlbumDetail({ albumId, onBack }) {
  const { playAlbum, currentTrack, isPlaying, playTrack } = usePlayer();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        setLoading(true);
        const data = await musicApi.getAlbumById(albumId);
        setAlbum(data.albums || data.album);
      } catch (err) {
        console.error('Failed to fetch album details:', err);
        setError('Could not load album. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-6 animate-pulse">
        <div className="h-60 rounded-3xl bg-white/5" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="p-8 text-center space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Albums</span>
        </button>
        <div className="p-12 rounded-3xl glass-panel border border-white/5 text-rose-400 text-sm">
          {error || 'Album not found.'}
        </div>
      </div>
    );
  }

  const tracks = album.musics || [];
  const gradientClass = getTrackGradient(album.title || 'album');
  const isAlbumPlaying = isPlaying && tracks.some((t) => (t._id || t.id) === (currentTrack?._id || currentTrack?.id));

  return (
    <div className="space-y-8 p-4 lg:p-8 pb-32">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Albums</span>
      </button>

      {/* Album Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 p-6 md:p-8 shadow-2xl bg-gradient-to-r from-purple-950/40 via-[#131626]/70 to-indigo-950/40">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Cover Art */}
          <div className={`w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white shadow-2xl shadow-purple-600/30 shrink-0 relative overflow-hidden group`}>
            <Disc3 className="w-24 h-24 text-white/80 group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Album Information & Metadata */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Album</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-['Space_Grotesk'] leading-tight">
              {album.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-medium text-purple-300">
                <User className="w-3.5 h-3.5" />
                <span>{typeof album.artist === 'object' ? album.artist?.username : album.artist}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5" />
                <span>{tracks.length} Songs</span>
              </div>
            </div>

            {/* Play All Button */}
            <div className="pt-3">
              <button
                onClick={() => playAlbum(album)}
                disabled={tracks.length === 0}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 mx-auto md:mx-0 disabled:opacity-50"
              >
                {isAlbumPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Album</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Play Entire Album</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Tracklist</span>
          <span>Actions</span>
        </div>

        {tracks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
            No tracks in this album yet.
          </div>
        ) : (
          <div className="space-y-2">
            {tracks.map((track, idx) => (
              <TrackRow
                key={track._id || track.id || idx}
                track={track}
                index={idx}
                queueList={tracks}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
