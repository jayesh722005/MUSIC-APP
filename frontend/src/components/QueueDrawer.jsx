import React from 'react';
import { X, Trash2, Music2, Play, Pause } from 'lucide-react';
import { usePlayer, getTrackGradient } from '../context/PlayerContext';

export default function QueueDrawer() {
  const { 
    isQueueOpen, 
    setIsQueueOpen, 
    queue, 
    queueIndex, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlay, 
    removeFromQueue, 
    clearQueue 
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsQueueOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-panel border-l border-white/10 p-6 flex flex-col bg-[#0d0f1a]/95 shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">Up Next Queue</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                {queue.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {queue.length > 0 && (
                <button
                  onClick={clearQueue}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition-colors flex items-center gap-1"
                  title="Clear Queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsQueueOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Currently Playing Section */}
          {currentTrack && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent border border-purple-500/30">
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Now Playing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getTrackGradient(currentTrack.title)} flex items-center justify-center text-white shrink-0 shadow-md`}>
                  <Music2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{currentTrack.title}</div>
                  <div className="text-xs text-slate-400 truncate">
                    {typeof currentTrack.artist === 'object' ? currentTrack.artist?.username : currentTrack.artist}
                  </div>
                </div>
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Queue Tracklist */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
            <div className="text-xs font-semibold text-slate-400 mb-2">Queue Playlist</div>
            {queue.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No upcoming songs in the queue. Add songs from Discover or Albums.
              </div>
            ) : (
              queue.map((track, idx) => {
                const isCurrent = idx === queueIndex;
                return (
                  <div
                    key={`${track._id || track.id}-${idx}`}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${
                      isCurrent
                        ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => playTrack(track)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors"
                    >
                      {isCurrent && isPlaying ? (
                        <div className="flex items-center gap-0.5">
                          <span className="eq-bar h-2 animate-soundwave-1" />
                          <span className="eq-bar h-3 animate-soundwave-2" />
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current opacity-70 group-hover:opacity-100" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => playTrack(track)}>
                      <div className={`text-xs font-medium truncate ${isCurrent ? 'text-purple-300 font-bold' : 'text-slate-200'}`}>
                        {track.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {typeof track.artist === 'object' ? track.artist?.username : track.artist}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-white/5"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
