import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Shield, 
  Compass, 
  MapPin, 
  Zap, 
  Volume2, 
  VolumeX, 
  Eye, 
  Flame, 
  Radio, 
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { JarvisVoiceEngine } from '../../utils/speech.ts';

interface PubgAppProps {
  isAgentActive?: boolean;
}

export const PubgApp: React.FC<PubgAppProps> = ({ isAgentActive = false }) => {
  const [ammo, setAmmo] = useState(38);
  const [kills, setKills] = useState(8);
  const [alive, setAlive] = useState(14);
  const [zoneTimer, setZoneTimer] = useState(24);
  const [isScoped, setIsScoped] = useState(false);
  const [jarvisCallout, setJarvisCallout] = useState(
    'Sir, 2 hostiles detected behind the boulder at 315° NW. Blue zone shrinking in 24 seconds.'
  );
  const [statsView, setStatsView] = useState(false);

  // Auto tactical loop
  useEffect(() => {
    const timer = setInterval(() => {
      setZoneTimer(z => (z > 0 ? z - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // When agent is active, Jarvis gives live guidance
  useEffect(() => {
    if (!isAgentActive) return;

    const interval = setInterval(() => {
      const callouts = [
        'Sir, sniper glare detected at water tower, bearing 290. Deploying smoke screen.',
        'Hostile eliminated by our squad. 13 players remain. Recommending UAZ vehicle rotation.',
        'Target in crosshairs. Recoil pattern compensated by 18 percent. Fire at will, sir.',
        'Safe zone boundary updated. Distance: 120 meters. You have clear line of sight.',
      ];
      const pick = callouts[Math.floor(Math.random() * callouts.length)];
      setJarvisCallout(pick);
      JarvisVoiceEngine.speak(pick);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAgentActive]);

  const handleFire = () => {
    if (ammo > 0) {
      setAmmo(a => a - 1);
      if (ammo % 10 === 0) {
        setKills(k => k + 1);
        setAlive(a => Math.max(1, a - 1));
        const callout = 'Direct hit, sir! Hostile squad leader eliminated.';
        setJarvisCallout(callout);
        JarvisVoiceEngine.speak(callout);
      }
    } else {
      setAmmo(40);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#1e2518] text-white flex flex-col justify-between font-mono select-none overflow-hidden text-xs">
      {/* 3D Battleground Environment */}
      <div className="absolute inset-0 z-0">
        {/* Sky */}
        <div className="h-2/5 bg-gradient-to-b from-[#4a6b82] via-[#7d95a5] to-[#c5b497] relative overflow-hidden">
          {/* Distant Hills & Military Water Tower */}
          <div className="absolute bottom-0 w-full h-12 bg-[#5d6854] opacity-80" />
          <div className="absolute bottom-2 left-20 w-8 h-20 bg-slate-800 opacity-60 border-t-2 border-slate-600" />
        </div>

        {/* Grassy Battlefield Terrain */}
        <div className="h-3/5 bg-gradient-to-b from-[#6b7c4d] via-[#4e5b35] to-[#2c351f] relative border-t-4 border-[#889868]">
          {/* Rocks & Cover */}
          <div className="absolute top-10 left-1/3 w-20 h-14 bg-[#4a4f44] rounded-t-2xl border-t-2 border-slate-400" />
          <div className="absolute top-16 right-16 w-16 h-10 bg-[#3b4036] rounded-t-xl" />
        </div>
      </div>

      {/* Top Compass Tape (0° to 360°) */}
      <div className="relative z-10 bg-black/70 backdrop-blur-xs px-4 py-1.5 flex items-center justify-between text-[11px] border-b border-white/10">
        <div className="flex items-center gap-3 font-bold text-amber-400">
          <Compass className="w-4 h-4 text-sky-400" />
          <span>NW 315°</span>
          <span className="text-slate-400 font-normal">| 330° | N 0° | 15°</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-red-950/80 text-rose-300 border border-red-800 px-2 py-0.5 rounded font-bold">
            Zone: {zoneTimer}s
          </span>
          <span className="text-slate-300">
            Alive: <strong className="text-emerald-400">{alive}</strong>/100
          </span>
          <span className="text-slate-300">
            Kills: <strong className="text-amber-400">{kills}</strong>
          </span>
        </div>
      </div>

      {/* Center Reticle & Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className={`relative flex items-center justify-center ${isScoped ? 'scale-150' : ''} transition-transform`}>
          <Crosshair className="w-8 h-8 text-emerald-400 drop-shadow-md" />
          <div className="absolute w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </div>
      </div>

      {/* Jarvis Real-Time Tactical Vision Grounding Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Enemy Bounding Box */}
        <div className="absolute top-28 left-1/3 w-24 h-32 border-2 border-rose-500 rounded bg-rose-500/10 shadow-lg">
          <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow uppercase tracking-wide">
            Enemy (180m • L3)
          </span>
        </div>

        {/* Dacia Vehicle Marker */}
        <div className="absolute bottom-32 left-12 w-20 h-14 border border-sky-400/80 rounded bg-sky-500/10 border-dashed">
          <span className="absolute -top-4 left-0 bg-sky-500 text-slate-950 text-[9px] font-bold px-1 py-0.2 rounded">
            UAZ Jeep (65m)
          </span>
        </div>

        {/* Jarvis Live Audio Callout Banner */}
        <div className="absolute top-12 inset-x-3 bg-slate-950/90 backdrop-blur-md border border-sky-500/60 rounded-xl p-2.5 text-xs text-sky-200 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider flex items-center gap-1.5">
                <span>Jarvis Tactical Voice</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[11px] text-white truncate font-sans">{jarvisCallout}</p>
            </div>
          </div>

          <button
            onClick={() => setStatsView(!statsView)}
            className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-[10px] border border-sky-400/30 shrink-0"
          >
            {statsView ? 'Game View' : 'Stats Analysis'}
          </button>
        </div>
      </div>

      {/* Stats Analysis Modal Overlay */}
      {statsView && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-xs">Simp AGI Live PUBG Combat Analysis</h3>
              </div>
              <button onClick={() => setStatsView(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400">Overall K/D Ratio</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">5.42</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400">Headshot Accuracy</span>
                <div className="text-lg font-bold text-sky-400 font-mono">38.6%</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400">Damage Dealt</span>
                <div className="text-lg font-bold text-amber-400 font-mono">1,420 HP</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400">Recoil Compensation</span>
                <div className="text-lg font-bold text-purple-400 font-mono">94% Perfect</div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-white/5 space-y-1">
              <span className="text-[11px] font-bold text-slate-200">Jarvis Tactical Recommendation:</span>
              <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                Enemy squad is split into 2 scouts. Flank from north ridge with M416 4x spray while companion tracks enemy footsteps via audio telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStatsView(false)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
          >
            Return to Match
          </button>
        </div>
      )}

      {/* Bottom Weapon HUD & Controls */}
      <div className="relative z-10 bg-black/80 backdrop-blur-md p-3 border-t border-white/10 flex items-center justify-between">
        {/* Weapon Slots */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900/90 border border-emerald-500/50 p-2 rounded-xl text-left">
            <div className="font-bold text-white text-xs">M416 (Assault)</div>
            <div className="text-[11px] text-emerald-400 font-mono">
              Ammo: <strong className="text-white">{ammo}</strong>/180
            </div>
          </div>
          <div className="bg-slate-900/50 border border-white/10 p-2 rounded-xl text-left hidden sm:block">
            <div className="font-bold text-slate-400 text-xs">Kar98k (Sniper)</div>
            <div className="text-[11px] text-slate-500 font-mono">Ammo: 5/45</div>
          </div>
        </div>

        {/* Action Buttons: Fire & Scope */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScoped(!isScoped)}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs border transition ${
              isScoped ? 'bg-sky-500 text-slate-950 border-sky-400' : 'bg-slate-800 text-slate-300 border-white/10'
            }`}
          >
            4x Scope
          </button>

          <button
            onClick={handleFire}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/30 active:scale-95 transition"
          >
            🔥 Fire ({ammo})
          </button>
        </div>
      </div>
    </div>
  );
};
