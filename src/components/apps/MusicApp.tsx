import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc, Heart, Music, ListMusic } from 'lucide-react';

interface MusicAppProps {
  isAgentActive?: boolean;
}

export const MusicApp: React.FC<MusicAppProps> = ({ isAgentActive = false }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const [trackProgress, setTrackProgress] = useState(42);

  const tracks = [
    {
      title: 'Neon Horizon',
      artist: 'Synthwave Nightdrive',
      duration: '3:45',
      genre: 'Electronic / Synthwave',
      color: 'from-cyan-500 to-blue-700',
    },
    {
      title: "Mom's Golden 80s Hits",
      artist: 'Retro Pop Collective',
      duration: '4:15',
      genre: 'Synthpop & Disco',
      color: 'from-amber-500 to-rose-600',
    },
    {
      title: 'Lofi Coding Session',
      artist: 'Chillhop Beats',
      duration: '2:50',
      genre: 'Lofi Hip Hop',
      color: 'from-purple-500 to-indigo-700',
    },
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Auto-progress bar simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTrackProgress(p => (p >= 100 ? 0 : p + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white flex flex-col justify-between p-4 font-sans select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Music className="w-4 h-4 text-sky-400" />
          Astra Sound Player
        </span>
        <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded text-[10px] font-mono border border-sky-500/20">
          Lossless 320kbps
        </span>
      </div>

      {/* Vinyl Art & Spinning Record */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative flex items-center justify-center">
          {/* Animated Vinyl Disc */}
          <div
            className={`w-36 h-36 rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative transition-transform ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '8s' }}
          >
            {/* Grooves */}
            <div className="w-28 h-28 rounded-full border border-slate-700/60 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border border-slate-700/40 flex items-center justify-center">
                {/* Center Label */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${currentTrack.color} flex items-center justify-center text-[10px] font-bold text-white shadow-inner`}>
                  <Disc className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="text-center mt-4">
          <h3 className="text-sm font-bold text-white tracking-tight">{currentTrack.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{currentTrack.artist}</p>
          <span className="inline-block mt-1 text-[10px] text-sky-400/80 bg-sky-950/40 px-2 py-0.5 rounded">
            {currentTrack.genre}
          </span>
        </div>
      </div>

      {/* Player Controls & Scrubber */}
      <div className="space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${trackProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1:{trackProgress < 10 ? `0${trackProgress}` : trackProgress}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setCurrentTrackIndex(i => (i === 0 ? tracks.length - 1 : i - 1))}
            className="text-slate-400 hover:text-white transition active:scale-95"
            aria-label="Previous Track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTrackIndex(i => (i + 1) % tracks.length)}
            className="text-slate-400 hover:text-white transition active:scale-95"
            aria-label="Next Track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 px-4 text-slate-400">
          <Volume2 className="w-4 h-4 shrink-0 text-slate-300" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            aria-label="Volume Slider"
          />
          <span className="text-[10px] font-mono text-slate-400 w-6 text-right">{volume}%</span>
        </div>
      </div>
    </div>
  );
};
