import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { musicApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../components/Toast';

const LikesContext = createContext(null);

export const LikesProvider = ({ children }) => {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const { addToast } = useToast();

  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [likedTracks, setLikedTracks] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);

  // Fetch liked tracks when authenticated user logs in
  const fetchLikedTracks = useCallback(async () => {
    if (!isAuthenticated) {
      setLikedTrackIds(new Set());
      setLikedTracks([]);
      return;
    }

    try {
      setLoadingLikes(true);
      const res = await musicApi.getLikedMusic();
      const tracks = res.musics || [];
      setLikedTracks(tracks);
      const idSet = new Set(tracks.map(t => String(t._id || t.id)));
      setLikedTrackIds(idSet);
    } catch (err) {
      console.warn('Failed to fetch liked tracks:', err);
    } finally {
      setLoadingLikes(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLikedTracks();
  }, [fetchLikedTracks]);

  const isLiked = useCallback((trackOrId) => {
    if (!trackOrId) return false;
    const id = typeof trackOrId === 'object' ? (trackOrId._id || trackOrId.id) : trackOrId;
    return likedTrackIds.has(String(id));
  }, [likedTrackIds]);

  const toggleLike = async (track) => {
    if (!track) return;

    if (!isAuthenticated) {
      addToast('Please sign in with your Gmail or account to save liked tracks', 'info');
      openAuthModal('login');
      return;
    }

    const trackId = String(track._id || track.id);
    const currentlyLiked = likedTrackIds.has(trackId);

    // 1. Optimistic UI update
    setLikedTrackIds(prev => {
      const next = new Set(prev);
      if (currentlyLiked) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });

    if (currentlyLiked) {
      setLikedTracks(prev => prev.filter(t => String(t._id || t.id) !== trackId));
      addToast(`Removed "${track.title || 'track'}" from favorites`, 'info');
    } else {
      setLikedTracks(prev => [track, ...prev]);
      addToast(`Added "${track.title || 'track'}" to favorites ❤️`, 'success');
    }

    // 2. Network sync
    try {
      const res = await musicApi.toggleLike(trackId);
      if (res.music) {
        // If track was liked, update with server response
        if (res.isLiked) {
          setLikedTracks(prev => {
            const index = prev.findIndex(t => String(t._id || t.id) === trackId);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = res.music;
              return updated;
            }
            return [res.music, ...prev];
          });
        }
      }
    } catch (err) {
      console.error('Failed to sync like with backend:', err);
      // Rollback optimistic update
      setLikedTrackIds(prev => {
        const next = new Set(prev);
        if (currentlyLiked) {
          next.add(trackId);
        } else {
          next.delete(trackId);
        }
        return next;
      });

      if (currentlyLiked) {
        setLikedTracks(prev => [track, ...prev]);
      } else {
        setLikedTracks(prev => prev.filter(t => String(t._id || t.id) !== trackId));
      }

      addToast('Failed to update favorite status. Please try again.', 'error');
    }
  };

  return (
    <LikesContext.Provider
      value={{
        likedTrackIds,
        likedTracks,
        loadingLikes,
        isLiked,
        toggleLike,
        refreshLikes: fetchLikedTracks,
        likedCount: likedTrackIds.size,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
