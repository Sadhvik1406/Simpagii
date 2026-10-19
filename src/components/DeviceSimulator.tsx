import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  Signal, 
  Circle, 
  Square, 
  ChevronLeft, 
  Bell, 
  Sliders, 
  Bluetooth, 
  Sun, 
  Plane, 
  Volume2, 
  RotateCw,
  Sparkles,
  MousePointer2,
  Layers
} from 'lucide-react';
import { HomeScreenApp } from './apps/HomeScreenApp.tsx';
import { PlayStoreApp, PlayStoreAppItem } from './apps/PlayStoreApp.tsx';
import { DataEntryApp } from './apps/DataEntryApp.tsx';
import { MusicApp } from './apps/MusicApp.tsx';
import { FilesApp } from './apps/FilesApp.tsx';
import { BrowserApp } from './apps/BrowserApp.tsx';
import { MessagesApp } from './apps/MessagesApp.tsx';
import { BuilderEditorApp } from './apps/BuilderEditorApp.tsx';
import { SettingsApp } from './apps/SettingsApp.tsx';
import { PubgApp } from './apps/PubgApp.tsx';
import { InstagramApp } from './apps/InstagramApp.tsx';
import { CoordinateCalculator } from '../utils/engine.ts';

interface TouchRipple {
  id: string;
  x: number; // percentage
  y: number; // percentage
  timestamp: number;
}

interface SwipeVector {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  timestamp: number;
}

interface DeviceSimulatorProps {
  activeAppId: string;
  setActiveAppId: (appId: string) => void;
  isAgentActive: boolean;
  lastAgentAction?: {
    type: string;
    coords?: { x: number; y: number; endX?: number; endY?: number };
    targetElement?: string;
    reasoning?: string;
  };
  installedApps: PlayStoreAppItem[];
  onInstallApp: (app: PlayStoreAppItem) => void;
  onDispatchCommand?: (command: string) => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  activeAppId,
  setActiveAppId,
  isAgentActive,
  lastAgentAction,
  installedApps,
  onInstallApp,
  onDispatchCommand,
}) => {
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [ripples, setRipples] = useState<TouchRipple[]>([]);
  const [swipeTrace, setSwipeTrace] = useState<SwipeVector | null>(null);
  const [liveCoord, setLiveCoord] = useState<{ x: number; y: number } | null>(null);

  const screenRef = useRef<HTMLDivElement>(null);

  // Trigger visual ripples whenever agent touches the screen
  useEffect(() => {
    if (lastAgentAction?.coords) {
      const { x, y, endX, endY } = lastAgentAction.coords;
      const rippleId = `rip_${Date.now()}`;
      setRipples(prev => [...prev.slice(-4), { id: rippleId, x: x / 10, y: y / 10, timestamp: Date.now() }]);
      setLiveCoord({ x, y });

      if (endX !== undefined && endY !== undefined) {
        setSwipeTrace({
          startX: x / 10,
          startY: y / 10,
          endX: endX / 10,
          endY: endY / 10,
          timestamp: Date.now(),
        });
      }

      const timer = setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [lastAgentAction]);

  // Handle manual user clicks on the screen ("Touching things")
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;

    const norm = CoordinateCalculator.normalize(pxX, pxY, rect.width, rect.height);
    setLiveCoord(norm);

    const rippleId = `user_rip_${Date.now()}`;
    setRipples(prev => [
      ...prev.slice(-4),
      { id: rippleId, x: (norm.x / 10), y: (norm.y / 10), timestamp: Date.now() },
    ]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1000);
  };

  const getAppName = (id: string) => {
    switch (id) {
      case 'home': return 'Home Launcher';
      case 'pubg': return 'PUBG Mobile';
      case 'data_entry': return "Mom's Data Entry";
      case 'instagram': return 'Instagram';
      case 'playstore': return 'Google Play Store';
      case 'spotify': return 'Spotify Music';
      case 'files': return 'Files & Storage';
      case 'browser': return 'Chrome Browser';
      case 'messages': return 'WhatsApp Messages';
      case 'builder': return 'Astra Code & Build';
      case 'settings': return 'System Settings';
      default: return id;
    }
  };

  const openAppIdsList = ['home', 'pubg', 'data_entry', 'instagram', 'playstore', 'spotify', 'files', 'builder', 'settings'];

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Device Bezel & Outer Frame (Tablet / Phone hybrid) */}
      <div className="relative w-[340px] sm:w-[380px] md:w-[400px] h-[720px] sm:h-[760px] bg-slate-900 rounded-[44px] p-3 shadow-2xl shadow-sky-950/50 border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col justify-between overflow-hidden">
        
        {/* Dynamic Island / Punch Hole Camera Slit */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black px-4 py-1 rounded-full border border-slate-800 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500/80 animate-pulse" />
          {isAgentActive && (
            <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider">
              SIMP AGI ACTIVE
            </span>
          )}
        </div>

        {/* Screen Bezel Inner Border */}
        <div 
          ref={screenRef}
          onClick={handleScreenClick}
          className="relative w-full h-full bg-black rounded-[34px] overflow-hidden flex flex-col justify-between border border-slate-800/80 cursor-crosshair"
        >
          {/* Top Android Status Bar */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickSettings(!showQuickSettings);
            }}
            className="relative z-40 bg-black/80 backdrop-blur-md px-5 pt-2 pb-1 text-white flex items-center justify-between text-[11px] font-sans font-medium select-none cursor-pointer hover:bg-black/90 transition"
            title="Click to pull down Quick Settings drawer"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 font-mono">12:45</span>
              <Bell className="w-3 h-3 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[10px] font-bold text-sky-400 font-mono">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/80" />
                <span className="text-[10px] font-mono">98%</span>
              </div>
            </div>
          </div>

          {/* Quick Settings & Notification Drawer (Pull-down) */}
          {showQuickSettings && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 top-8 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-700 p-4 rounded-b-3xl shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-200"
            >
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-400" /> Quick Settings
                </span>
                <button 
                  onClick={() => setShowQuickSettings(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-0.5 rounded bg-slate-800"
                >
                  Close
                </button>
              </div>

              {/* Quick Setting Tiles */}
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="bg-sky-500 text-slate-950 p-2 rounded-xl flex flex-col items-center justify-center font-bold">
                  <Wifi className="w-4 h-4 mb-1" />
                  WiFi 6
                </div>
                <div className="bg-sky-500 text-slate-950 p-2 rounded-xl flex flex-col items-center justify-center font-bold">
                  <Bluetooth className="w-4 h-4 mb-1" />
                  Bluetooth
                </div>
                <div className="bg-slate-800 text-slate-300 p-2 rounded-xl flex flex-col items-center justify-center font-medium">
                  <Plane className="w-4 h-4 mb-1" />
                  Airplane
                </div>
                <div className="bg-slate-800 text-slate-300 p-2 rounded-xl flex flex-col items-center justify-center font-medium">
                  <RotateCw className="w-4 h-4 mb-1" />
                  Auto-Rotate
                </div>
              </div>

              {/* Brightness Slider */}
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Sun className="w-4 h-4 text-amber-400" />
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  defaultValue="85"
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-sky-400"
                  aria-label="Display Brightness"
                />
              </div>

              {/* Ongoing Companion Notification */}
              <div className="bg-slate-900 border border-sky-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">AstraClaw Daemon Running</div>
                    <div className="text-[10px] text-slate-400">Zero phone battery drain • Server-hosted</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                  0% GPU
                </span>
              </div>
            </div>
          )}

          {/* App Switcher / Multitasking Carousel (Recents) */}
          {showAppSwitcher ? (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-slate-950/95 p-4 flex flex-col justify-between overflow-y-auto"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" /> Open Apps Carousel
                </span>
                <button
                  onClick={() => setShowAppSwitcher(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 my-auto py-2">
                {openAppIdsList.map(appId => (
                  <button
                    key={appId}
                    onClick={() => {
                      setActiveAppId(appId);
                      setShowAppSwitcher(false);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 text-center transition ${
                      activeAppId === appId
                        ? 'bg-sky-500/20 border-sky-400 shadow-md text-white'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xl">
                      {appId === 'pubg' ? '🎯' : appId === 'home' ? '🏠' : appId === 'playstore' ? '🛍️' : appId === 'data_entry' ? '📊' : appId === 'spotify' ? '🎵' : appId === 'files' ? '📁' : appId === 'builder' ? '💻' : '⚙️'}
                    </span>
                    <span className="text-[11px] font-semibold truncate w-full">
                      {getAppName(appId)}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setActiveAppId('home');
                  setShowAppSwitcher(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium"
              >
                Clear All Apps
              </button>
            </div>
          ) : (
            /* Active App Surface Rendering */
            <div className="flex-1 relative overflow-hidden">
              {activeAppId === 'home' && (
                <HomeScreenApp
                  onOpenApp={id => setActiveAppId(id)}
                  installedApps={installedApps}
                  onDispatchCommand={onDispatchCommand}
                />
              )}
              {activeAppId === 'playstore' && (
                <PlayStoreApp
                  installedAppIds={installedApps.map(a => a.id)}
                  onInstallApp={onInstallApp}
                  onOpenApp={id => setActiveAppId(id)}
                  isAgentActive={isAgentActive}
                />
              )}
              {activeAppId === 'pubg' && (
                <PubgApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'instagram' && (
                <InstagramApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'data_entry' && (
                <DataEntryApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'spotify' && (
                <MusicApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'files' && (
                <FilesApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'browser' && (
                <BrowserApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'messages' && (
                <MessagesApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'builder' && (
                <BuilderEditorApp isAgentActive={isAgentActive} />
              )}
              {activeAppId === 'settings' && (
                <SettingsApp isAgentActive={isAgentActive} />
              )}

              {/* Floating Jarvis Screen-Share Assistant Head (Overlaying other apps like a chathead) */}
              {activeAppId !== 'home' && (
                <div 
                  className="absolute bottom-16 right-3 z-30 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-sky-400/50 p-1.5 rounded-full shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition pointer-events-auto"
                  title="Simp AGI Jarvis Screen-Share Daemon (Watching your screen via Accessibility)"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAppId('home');
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-sky-300 pr-1.5 font-mono hidden sm:inline">
                    Jarvis Live
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Real Touch Ripples Layer ("Touching things") */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {ripples.map(r => (
              <div
                key={r.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-400 bg-sky-400/30 animate-ping"
                style={{
                  left: `${r.x}%`,
                  top: `${r.y}%`,
                  width: '36px',
                  height: '36px',
                  animationDuration: '0.8s',
                }}
              />
            ))}

            {/* Swipe trace vector line */}
            {swipeTrace && (
              <svg className="absolute inset-0 w-full h-full">
                <line
                  x1={`${swipeTrace.startX}%`}
                  y1={`${swipeTrace.startY}%`}
                  x2={`${swipeTrace.endX}%`}
                  y2={`${swipeTrace.endY}%`}
                  stroke="#38bdf8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                <circle cx={`${swipeTrace.endX}%`} cy={`${swipeTrace.endY}%`} r="6" fill="#38bdf8" />
              </svg>
            )}

            {/* Coordinate Overlay Badge */}
            {liveCoord && (
              <div 
                className="absolute bg-slate-950/90 text-[10px] text-sky-300 font-mono px-2 py-0.5 rounded border border-sky-500/40 shadow-lg pointer-events-none transition-all duration-150"
                style={{
                  left: `${Math.min(75, Math.max(5, liveCoord.x / 10))}%`,
                  top: `${Math.min(90, Math.max(5, liveCoord.y / 10 + 4))}%`,
                }}
              >
                Touch: ({liveCoord.x}, {liveCoord.y})
              </div>
            )}
          </div>

          {/* Android Navigation Bar (Back, Home, Recents) */}
          <div className="relative z-40 bg-black/90 backdrop-blur-md h-11 px-8 flex items-center justify-around text-slate-400 border-t border-slate-900 shrink-0">
            {/* Back Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (showQuickSettings) setShowQuickSettings(false);
                else if (showAppSwitcher) setShowAppSwitcher(false);
                else if (activeAppId !== 'home') setActiveAppId('home');
              }}
              className="p-2 hover:text-white active:scale-90 transition"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Home Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickSettings(false);
                setShowAppSwitcher(false);
                setActiveAppId('home');
              }}
              className="p-2 hover:text-white active:scale-90 transition"
              aria-label="Home"
            >
              <Circle className="w-4 h-4" />
            </button>

            {/* Recents / Multitasking Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAppSwitcher(!showAppSwitcher);
              }}
              className="p-2 hover:text-white active:scale-90 transition"
              aria-label="Recent Apps"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
