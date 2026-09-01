import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Disc3, 
  Music2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  FolderPlus, 
  Play, 
  FileAudio,
  Radio,
  Layers,
  Crown,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { musicApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';

export default function ArtistStudio({ 
  tracks = [], 
  albums = [], 
  onRefreshData, 
  onSelectAlbum 
}) {
  const { user, isArtist, openAuthModal } = useAuth();
  const { addToast } = useToast();
  const { playTrack } = usePlayer();

  const [activeSubTab, setActiveSubTab] = useState('upload'); // 'upload' | 'album' | 'discography'

  // Upload Form State
  const [songTitle, setSongTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Album Creation State
  const [albumTitle, setAlbumTitle] = useState('');
  const [selectedTrackIds, setSelectedTrackIds] = useState([]);
  const [creatingAlbum, setCreatingAlbum] = useState(false);
  const [albumSearchQuery, setAlbumSearchQuery] = useState('');

  if (!isArtist) {
    return (
      <div className="p-4 lg:p-8 max-w-xl mx-auto text-center space-y-6 pt-16">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Crown className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk']">Artist Studio Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Artist Studio is exclusively available for verified artists. Create or switch to an Artist account to upload music and release albums.
          </p>
        </div>
        <button
          onClick={() => openAuthModal('register')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-amber-600/20 transition-all hover:scale-105"
        >
          Create Artist Account
        </button>
      </div>
    );
  }

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (!songTitle) {
        // Auto populate title from file name without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setSongTitle(cleanName);
      }
    }
  };

  // Upload Song Handler
  const handleUploadSong = async (e) => {
    e.preventDefault();
    if (!selectedFile || !songTitle.trim()) {
      addToast('Please provide a song title and audio file', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('title', songTitle.trim());
      formData.append('music', selectedFile);

      setUploadProgress(60);
      await musicApi.uploadMusic(formData);
      setUploadProgress(100);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast(`"${songTitle}" uploaded successfully!`, 'success');
      setSongTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.message || 'Failed to upload song. Check file format and ImageKit credentials.';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Create Album Handler
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!albumTitle.trim()) {
      addToast('Please enter an album title', 'error');
      return;
    }
    if (selectedTrackIds.length === 0) {
      addToast('Please select at least one song for the album', 'error');
      return;
    }

    setCreatingAlbum(true);
    try {
      await musicApi.createAlbum({
        title: albumTitle.trim(),
        musics: selectedTrackIds,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      addToast(`Album "${albumTitle}" created with ${selectedTrackIds.length} tracks!`, 'success');
      setAlbumTitle('');
      setSelectedTrackIds([]);
      if (onRefreshData) onRefreshData();
      setActiveSubTab('discography');
    } catch (err) {
      console.error('Create album failed:', err);
      const msg = err.response?.data?.message || 'Failed to create album.';
      addToast(msg, 'error');
    } finally {
      setCreatingAlbum(false);
    }
  };

  const toggleTrackSelection = (id) => {
    setSelectedTrackIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Filter artist's uploaded music & albums
  const myTracks = tracks.filter(t => {
    const artistId = typeof t.artist === 'object' ? (t.artist?._id || t.artist?.id) : t.artist;
    return artistId === (user?.id || user?._id) || (typeof t.artist === 'object' && t.artist?.username === user?.username);
  });

  const myAlbums = albums.filter(a => {
    const artistId = typeof a.artist === 'object' ? (a.artist?._id || a.artist?.id) : a.artist;
    return artistId === (user?.id || user?._id) || (typeof a.artist === 'object' && a.artist?.username === user?.username);
  });

  return (
    <div className="space-y-8 p-4 lg:p-8 pb-32 max-w-6xl mx-auto">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-purple-500/20 p-6 md:p-8 shadow-2xl bg-gradient-to-r from-purple-950/50 via-[#131528] to-indigo-950/50">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>Artist Creator Suite</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Producer & Studio Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Logged in as <span className="text-purple-300 font-semibold">{user?.username}</span>. Publish lossless audio and organize discography.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/[0.04] p-3 rounded-2xl border border-white/5">
            <div className="text-center px-3 border-r border-white/10">
              <div className="text-lg font-bold text-white font-mono">{myTracks.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">My Tracks</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-bold text-purple-300 font-mono">{myAlbums.length}</div>
              <div className="text-[10px] text-slate-400 uppercase">My Albums</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex p-1.5 rounded-2xl glass-panel border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'upload'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Song</span>
        </button>

        <button
          onClick={() => setActiveSubTab('album')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'album'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Album</span>
        </button>

        <button
          onClick={() => setActiveSubTab('discography')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'discography'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Disc3 className="w-4 h-4" />
          <span>My Releases</span>
        </button>
      </div>

      {/* Tab 1: Upload Single / Song */}
      {activeSubTab === 'upload' && (
        <div className="max-w-2xl mx-auto glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Upload Single Track</h2>
            <p className="text-xs text-slate-400">Audio will be converted and hosted with instant global streaming</p>
          </div>

          <form onSubmit={handleUploadSong} className="space-y-5">
            {/* Drag & Drop Audio Upload Area */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Audio File (MP3, WAV, M4A, OGG)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-purple-500 bg-purple-950/20'
                    : 'border-white/15 hover:border-purple-500/50 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/30 text-purple-300 flex items-center justify-center mx-auto border border-purple-500/40">
                      <FileAudio className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">{selectedFile.name}</div>
                    <div className="text-xs text-purple-300 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-semibold text-white">Click or drag audio file here</div>
                    <div className="text-xs text-slate-500">Supports high-res MP3, FLAC, WAV, M4A</div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Preview Player */}
            {previewUrl && (
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2">
                <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Audio Preview</span>
                </div>
                <audio controls src={previewUrl} className="w-full h-8 accent-purple-500" />
              </div>
            )}

            {/* Song Title Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Track Title</label>
              <div className="relative">
                <Music2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Reverie (VIP Mix)"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading || !selectedFile || !songTitle.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading Track to Cloud...</span>
                </div>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Track</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Create Album */}
      {activeSubTab === 'album' && (
        <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">Assemble New Album</h2>
            <p className="text-xs text-slate-400">Bundle existing uploaded songs into an official Album or EP</p>
          </div>

          <form onSubmit={handleCreateAlbum} className="space-y-6">
            {/* Album Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Album Title</label>
              <div className="relative">
                <Disc3 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Horizon EP"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Song Picker from Library */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Select Songs to Include ({selectedTrackIds.length} chosen)
                </label>
                <span className="text-[11px] text-purple-300 font-mono">
                  {tracks.length} tracks available
                </span>
              </div>

              {/* Quick filter input for tracks */}
              <input
                type="text"
                placeholder="Search tracks to add..."
                value={albumSearchQuery}
                onChange={(e) => setAlbumSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/40"
              />

              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {tracks
                  .filter(t => t.title?.toLowerCase().includes(albumSearchQuery.toLowerCase()))
                  .map((track) => {
                    const isSelected = selectedTrackIds.includes(track._id || track.id);
                    return (
                      <div
                        key={track._id || track.id}
                        onClick={() => toggleTrackSelection(track._id || track.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-purple-600/20 border-purple-500/40 text-white'
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-purple-600 border-purple-400 text-white' : 'border-white/20'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate">{track.title}</div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {typeof track.artist === 'object' ? track.artist?.username : track.artist}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            playTrack(track);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                          title="Preview"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Create Album Submit Button */}
            <button
              type="submit"
              disabled={creatingAlbum || !albumTitle.trim() || selectedTrackIds.length === 0}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {creatingAlbum ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Building Album...</span>
                </div>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  <span>Publish Album ({selectedTrackIds.length} Tracks)</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Discography */}
      {activeSubTab === 'discography' && (
        <div className="space-y-8">
          {/* My Albums */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">My Published Albums</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{myAlbums.length} albums</span>
            </div>

            {myAlbums.length === 0 ? (
              <div className="p-8 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
                You haven't created any albums yet. Click "Create Album" above to assemble one!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {myAlbums.map((album) => (
                  <AlbumCard key={album._id || album.id} album={album} onSelect={onSelectAlbum} />
                ))}
              </div>
            )}
          </div>

          {/* My Tracks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">My Uploaded Tracks</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{myTracks.length} tracks</span>
            </div>

            {myTracks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl glass-panel border border-white/5 text-slate-400 text-xs">
                No songs uploaded yet. Switch to the "Upload Song" tab to release your music!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {myTracks.map((track) => (
                  <TrackCard key={track._id || track.id} track={track} queueList={myTracks} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
