import React, { useState } from 'react';
import { Disc3, Search, Plus, Sparkles, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AlbumCard from '../components/AlbumCard';

export default function Albums({ 
  albums = [], 
  loading = false, 
  onSelectAlbum, 
  setActiveTab 
}) {
  const { isArtist } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredAlbums = albums.filter((album) => {
    const title = album.title?.toLowerCase() || '';
    const artist = typeof album.artist === 'object' ? album.artist?.username?.toLowerCase() : (album.artist?.toLowerCase() || '');
    const q = filterQuery.toLowerCase();
    return title.includes(q) || artist.includes(q);
  });

  return (
    <div className="space-y-8 p-4 lg:p-8 pb-32">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Disc3 className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Albums & Extended Plays
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore curated studio records and community discographies
          </p>
        </div>

        {isArtist && (
          <button
            onClick={() => setActiveTab('studio')}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create Album</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter albums by title or artist..."
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
        />
      </div>

      {/* Albums Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-60 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-white/5 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No albums found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filterQuery ? 'Try changing your search keywords.' : 'No albums have been published yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAlbums.map((album) => (
            <AlbumCard key={album._id || album.id} album={album} onSelect={onSelectAlbum} />
          ))}
        </div>
      )}
    </div>
  );
}
