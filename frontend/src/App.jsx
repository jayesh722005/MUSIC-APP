import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { LikesProvider } from './context/LikesContext';
import { musicApi } from './services/api';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import AuthModal from './components/AuthModal';
import QueueDrawer from './components/QueueDrawer';
import AudioVisualizerModal from './components/AudioVisualizerModal';

import Home from './pages/Home';
import Albums from './pages/Albums';
import AlbumDetail from './pages/AlbumDetail';
import ArtistStudio from './pages/ArtistStudio';
import SearchPage from './pages/SearchPage';
import Favorites from './pages/Favorites';

function MainApp() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all songs and albums from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [musicRes, albumRes] = await Promise.allSettled([
        musicApi.getAllMusic(),
        musicApi.getAllAlbums(),
      ]);

      if (musicRes.status === 'fulfilled') {
        setTracks(musicRes.value.musics || []);
      }
      if (albumRes.status === 'fulfilled') {
        setAlbums(albumRes.value.albums || []);
      }
    } catch (err) {
      console.error('Error loading library data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, isAuthenticated]);

  const handleSelectAlbum = (album) => {
    setSelectedAlbumId(album._id || album.id);
    setActiveTab('album-detail');
  };

  const handleSearchTrigger = (query) => {
    setSearchQuery(query);
    if (query.trim() && activeTab !== 'search') {
      setActiveTab('search');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090e] text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={handleSearchTrigger}
          setActiveTab={setActiveTab}
          setMobileOpen={setMobileOpen}
          allTracks={tracks}
          allAlbums={albums}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {activeTab === 'home' && (
            <Home
              tracks={tracks}
              albums={albums}
              loading={loading}
              onSelectAlbum={handleSelectAlbum}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'albums' && (
            <Albums
              albums={albums}
              loading={loading}
              onSelectAlbum={handleSelectAlbum}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'album-detail' && (
            <AlbumDetail
              albumId={selectedAlbumId}
              onBack={() => setActiveTab('albums')}
            />
          )}

          {activeTab === 'studio' && (
            <ArtistStudio
              tracks={tracks}
              albums={albums}
              onRefreshData={fetchData}
              onSelectAlbum={handleSelectAlbum}
            />
          )}

          {activeTab === 'search' && (
            <SearchPage
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              tracks={tracks}
              albums={albums}
              onSelectAlbum={handleSelectAlbum}
            />
          )}

          {activeTab === 'favorites' && (
            <Favorites setActiveTab={setActiveTab} />
          )}
        </main>
      </div>

      {/* Floating Sticky Player Bar */}
      <PlayerBar />

      {/* Slide-out Queue Drawer */}
      <QueueDrawer />

      {/* Fullscreen Visualizer Modal */}
      <AudioVisualizerModal />

      {/* Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <LikesProvider>
          <PlayerProvider>
            <MainApp />
          </PlayerProvider>
        </LikesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
