import React, { useState } from 'react';
import { Search, Music2, Disc3, User, Sparkles, Layers } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';

export default function SearchPage({ 
  searchQuery = '', 
  setSearchQuery, 
  tracks = [], 
  albums = [], 
  onSelectAlbum 
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'songs' | 'albums' | 'artists'

  const query = searchQuery.trim().toLowerCase();

  const matchingTracks = tracks.filter((track) => {
    const title = track.title?.toLowerCase() || '';
    const artist = typeof track.artist === 'object' ? track.artist?.username?.toLowerCase() : (track.artist?.toLowerCase() || '');
    return title.includes(query) || artist.includes(query);
  });

  const matchingAlbums = albums.filter((album) => {
    const title = album.title?.toLowerCase() || '';
    const artist = typeof album.artist === 'object' ? album.artist?.username?.toLowerCase() : (album.artist?.toLowerCase() || '');
    return title.includes(query) || artist.includes(query);
  });

  const uniqueArtists = Array.from(
    new Set(
      tracks.map((t) => typeof t.artist === 'object' ? t.artist?.username : t.artist).filter(Boolean)
    )
  ).filter(artistName => artistName.toLowerCase().includes(query));

  const totalResults = matchingTracks.length + matchingAlbums.length + (query ? uniqueArtists.length : 0);

  return (
    <div className="space-y-8 p-4 lg:p-8 pb-32">
      {/* Search Header & Inputs */}
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Search & Explore
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, album, or artist name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 shadow-xl"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Results' },
            { id: 'songs', label: `Songs (${matchingTracks.length})` },
            { id: 'albums', label: `Albums (${matchingAlbums.length})` },
            { id: 'artists', label: `Artists (${uniqueArtists.length})` },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === chip.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {query && totalResults === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-white/5 text-center space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No results found for "{searchQuery}"</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Check the spelling or try searching for another track or artist name.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Songs Results */}
          {(filterType === 'all' || filterType === 'songs') && matchingTracks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Songs</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {matchingTracks.map((track) => (
                  <TrackCard key={track._id || track.id} track={track} queueList={matchingTracks} />
                ))}
              </div>
            </div>
          )}

          {/* Albums Results */}
          {(filterType === 'all' || filterType === 'albums') && matchingAlbums.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Albums</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchingAlbums.map((album) => (
                  <AlbumCard key={album._id || album.id} album={album} onSelect={onSelectAlbum} />
                ))}
              </div>
            </div>
          )}

          {/* Artists Results */}
          {(filterType === 'all' || filterType === 'artists') && uniqueArtists.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Artists</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {uniqueArtists.map((artistName, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSearchQuery(artistName)}
                    className="p-4 rounded-2xl glass-card text-center cursor-pointer transition-all hover:scale-105"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-400 p-[2px] mx-auto mb-3 shadow-lg">
                      <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {artistName.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-white truncate">{artistName}</div>
                    <div className="text-[10px] text-purple-300 mt-0.5">Artist Profile</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
