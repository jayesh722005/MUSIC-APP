import React from 'react';
import { 
  Play, 
  Sparkles, 
  Flame, 
  Disc3, 
  Music2, 
  Radio, 
  TrendingUp, 
  Crown, 
  Headphones,
  ArrowRight
} from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';

export default function Home({ 
  tracks = [], 
  albums = [], 
  loading = false, 
  onSelectAlbum, 
  setActiveTab 
}) {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { isArtist, openAuthModal, isAuthenticated } = useAuth();

  const featuredTrack = tracks.length > 0 ? tracks[0] : null;
  const trendingTracks = tracks.slice(0, 8);
  const featuredAlbums = albums.slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-4 lg:p-8">
        <div className="h-64 rounded-3xl bg-white/5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 lg:p-8 pb-32">
      {/* Hero Featured Section */}
      {featuredTrack ? (
        <div className="relative overflow-hidden rounded-3xl glass-panel border border-white/10 p-6 md:p-10 shadow-2xl bg-gradient-to-r from-purple-950/60 via-[#121426]/80 to-indigo-950/60">
          {/* Ambient Glow */}
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute left-1/3 -top-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Featured Hit of the Week</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-tight">
                {featuredTrack.title}
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                Produced by{' '}
                <span className="text-purple-300 font-semibold">
                  {typeof featuredTrack.artist === 'object' ? featuredTrack.artist?.username : featuredTrack.artist}
                </span>
                . Stream lossless spatial audio now.
              </p>
              
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => playTrack(featuredTrack, tracks)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Play Track Now</span>
                </button>

                <button
                  onClick={() => setActiveTab('albums')}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-medium text-sm border border-white/10 transition-colors"
                >
                  Browse Albums
                </button>
              </div>
            </div>

            {/* Glowing Featured Disc Graphic */}
            <div className="shrink-0 mx-auto md:mx-0">
              <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-tr ${getTrackGradient(featuredTrack.title)} p-2 shadow-2xl shadow-purple-600/30 flex items-center justify-center`}>
                <div className="w-full h-full rounded-full bg-[#0d0f1a] flex items-center justify-center border-4 border-white/10">
                  <Disc3 className="w-20 h-20 text-white/80 animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
          <Music2 className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Welcome to AURA Music</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isArtist 
              ? 'Get started by uploading your very first track in the Artist Studio!'
              : 'Sign in as an artist to upload new tracks and release albums.'}
          </p>
          {isArtist ? (
            <button
              onClick={() => setActiveTab('studio')}
              className="mt-2 px-5 py-2.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-lg"
            >
              Go to Studio
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="mt-2 px-5 py-2.5 rounded-full bg-purple-600 text-white text-xs font-semibold shadow-lg"
            >
              Sign Up as Artist
            </button>
          )}
        </div>
      )}

      {/* Featured Albums Section */}
      {featuredAlbums.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Disc3 className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Featured Albums</h2>
            </div>
            <button
              onClick={() => setActiveTab('albums')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>See All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredAlbums.map((album) => (
              <AlbumCard key={album._id || album.id} album={album} onSelect={onSelectAlbum} />
            ))}
          </div>
        </div>
      )}

      {/* Trending & New Releases Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">New Releases & Songs</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">{tracks.length} tracks available</span>
        </div>

        {tracks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-sm">
            No music found yet. Log in as an artist to upload songs.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {trendingTracks.map((track) => (
              <TrackCard key={track._id || track.id} track={track} queueList={tracks} />
            ))}
          </div>
        )}
      </div>

      {/* Artist Studio Call To Action Banner */}
      {!isArtist && (
        <div className="relative rounded-3xl glass-panel border border-purple-500/20 p-8 overflow-hidden bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-950/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                <Crown className="w-3.5 h-3.5" />
                <span>For Producers & Musicians</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">Ready to Share Your Sound?</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Create an artist profile, upload lossless audio, and assemble official albums in seconds.
              </p>
            </div>

            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 hover:scale-105 transition-all whitespace-nowrap"
            >
              Start Creating Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
