import React from 'react';
import { Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

interface AstraCompanionOrbProps {
  status: 'idle' | 'thinking' | 'executing' | 'learning' | 'error';
  currentThought: string;
  activeAppName: string;
  keyLabel?: string;
  latencyMs?: number;
}

export const AstraCompanionOrb: React.FC<AstraCompanionOrbProps> = ({
  status,
  currentThought,
  activeAppName,
  keyLabel,
  latencyMs = 18,
}) => {
  const getOrbGradient = () => {
    switch (status) {
      case 'thinking':
        return 'from-sky-400 via-indigo-500 to-purple-600 shadow-sky-500/50';
      case 'executing':
        return 'from-emerald-400 via-teal-500 to-cyan-500 shadow-emerald-500/50';
      case 'learning':
        return 'from-fuchsia-500 via-pink-500 to-purple-600 shadow-fuchsia-500/50';
      case 'error':
        return 'from-rose-500 via-amber-500 to-red-600 shadow-rose-500/50';
      case 'idle':
      default:
        return 'from-sky-500/80 via-blue-600/70 to-indigo-800/80 shadow-indigo-500/30';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'thinking':
        return 'Analyzing Visual Frame & Planning';
      case 'executing':
        return 'Injecting Micro-Action to Device';
      case 'learning':
        return 'Compiling Zero-Token Macro to Memory';
      case 'error':
        return 'Failover Retrying on Next Key';
      case 'idle':
      default:
        return 'Companion Online • Zero Phone Load';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-950/90 border border-slate-800/90 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Reactive Astra Neural Orb */}
      <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 shrink-0">
        {/* Orbital rings */}
        <div className={`absolute inset-0 rounded-full border border-sky-400/30 ${status === 'thinking' ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        <div className={`absolute -inset-1.5 rounded-full border border-purple-400/20 ${status === 'executing' ? 'animate-ping' : ''}`} style={{ animationDuration: '3s' }} />
        
        {/* Core Glowing Sphere */}
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${getOrbGradient()} shadow-xl flex items-center justify-center text-white transition-all duration-500 animate-pulse-glow`}
        >
          <Sparkles className={`w-6 h-6 ${status === 'thinking' ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Companion Reasoning & State */}
      <div className="flex-1 text-center sm:text-left min-w-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-slate-800 border border-slate-700 text-sky-400">
            <span className={`w-2 h-2 rounded-full ${status === 'thinking' ? 'bg-sky-400 animate-ping' : status === 'executing' ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            {getStatusText()}
          </span>

          <span className="text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            App: <span className="text-white font-medium">{activeAppName}</span>
          </span>

          {keyLabel && (
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 hidden md:inline">
              {keyLabel}
            </span>
          )}

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {latencyMs}ms
          </span>
        </div>

        {/* Dynamic Thought Stream */}
        <p className="text-sm text-slate-200 font-medium tracking-tight line-clamp-2">
          &ldquo;{currentThought || 'Ready to assist on Android device. Choose a mission or tap any app.'}&rdquo;
        </p>
      </div>

      {/* Server Zero-Mobile-Load Seal */}
      <div className="hidden lg:flex flex-col items-end shrink-0 pl-3 border-l border-slate-800/80 text-right">
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Zero Mobile Load
        </div>
        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
          Mobile CPU: <span className="text-white">0.4%</span>
        </p>
        <p className="text-[11px] text-slate-400 font-mono">
          Mobile GPU: <span className="text-white">0.0%</span>
        </p>
      </div>
    </div>
  );
};
