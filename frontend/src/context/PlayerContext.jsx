import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

const GRADIENT_PALETTES = [
  'from-violet-600 via-indigo-600 to-purple-800',
  'from-cyan-500 via-blue-600 to-indigo-900',
  'from-fuchsia-600 via-pink-600 to-rose-700',
  'from-emerald-500 via-teal-600 to-cyan-800',
  'from-amber-500 via-orange-600 to-red-700',
  'from-purple-600 via-violet-800 to-slate-900',
  'from-blue-600 via-teal-500 to-emerald-700',
];

export const getTrackGradient = (idOrTitle = '') => {
  let hash = 0;
  for (let i = 0; i < idOrTitle.length; i++) {
    hash = idOrTitle.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
};

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Initialize audio element settings & listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };

    const handleEnded = () => {
      handleTrackEnd();
    };

    const handleError = (e) => {
      console.warn('Audio playback error:', e);
      setAudioError('Failed to load audio stream');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().catch(console.error);
    } else {
      nextTrack();
    }
  };

  const playTrack = (track, newQueue = null) => {
    if (!track) return;
    const audio = audioRef.current;

    let targetQueue = queue;
    let targetIndex = -1;

    if (newQueue && Array.isArray(newQueue)) {
      targetQueue = newQueue;
      setQueue(newQueue);
      targetIndex = newQueue.findIndex(t => (t._id || t.id) === (track._id || track.id));
      setQueueIndex(targetIndex !== -1 ? targetIndex : 0);
    } else if (queue.length > 0) {
      targetIndex = queue.findIndex(t => (t._id || t.id) === (track._id || track.id));
      if (targetIndex !== -1) {
        setQueueIndex(targetIndex);
      } else {
        targetQueue = [...queue, track];
        setQueue(targetQueue);
        setQueueIndex(targetQueue.length - 1);
      }
    } else {
      targetQueue = [track];
      setQueue(targetQueue);
      setQueueIndex(0);
    }

    setCurrentTrack(track);
    setAudioError(null);

    if (audio.src !== track.url) {
      audio.src = track.url;
      audio.load();
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback error / auto-play policy:', err);
        setIsPlaying(false);
      });
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setQueueIndex(randomIndex);
      playTrack(queue[randomIndex]);
      return;
    }

    const nextIdx = queueIndex + 1;
    if (nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      playTrack(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setQueueIndex(0);
      playTrack(queue[0]);
    } else {
      pauseTrack();
    }
  };

  const prevTrack = () => {
    if (queue.length === 0) return;
    const audio = audioRef.current;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const prevIdx = queueIndex - 1;
    if (prevIdx >= 0) {
      setQueueIndex(prevIdx);
      playTrack(queue[prevIdx]);
    } else {
      audio.currentTime = 0;
    }
  };

  const seek = (time) => {
    if (audioRef.current && !isNaN(time)) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const addToQueue = (track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index === queueIndex) {
      nextTrack();
    } else if (index < queueIndex) {
      setQueueIndex(prev => prev - 1);
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setQueueIndex(-1);
  };

  const playAlbum = (album) => {
    if (!album || !album.musics || album.musics.length === 0) return;
    const tracks = album.musics;
    playTrack(tracks[0], tracks);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        isVisualizerOpen,
        isQueueOpen,
        audioError,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playAlbum,
        setIsVisualizerOpen,
        setIsQueueOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
