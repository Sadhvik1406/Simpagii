import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  ShoppingBag, 
  Folder, 
  Music, 
  FileSpreadsheet, 
  Settings, 
  Globe, 
  MessageSquare, 
  Phone,
  Sparkles,
  Target,
  Volume2
} from 'lucide-react';
import { PlayStoreAppItem } from './PlayStoreApp.tsx';
import { JarvisVoiceEngine } from '../../utils/speech.ts';

interface HomeScreenAppProps {
  onOpenApp: (appId: string) => void;
  installedApps: PlayStoreAppItem[];
  onDispatchCommand?: (command: string) => void;
}

export const HomeScreenApp: React.FC<HomeScreenAppProps> = ({
  onOpenApp,
  installedApps,
  onDispatchCommand,
}) => {
  const [commandText, setCommandText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const defaultAppIcons = [
    { id: 'pubg', name: 'PUBG Mobile', icon: '🎯', bg: 'bg-[#2d3a1f]' },
    { id: 'builder', name: 'Code IDE', icon: '💻', bg: 'bg-[#1e1e2e]' },
    { id: 'data_entry', name: 'Excel Sheets', icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />, bg: 'bg-emerald-950' },
    { id: 'instagram', name: 'Instagram', icon: '📸', bg: 'bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-800' },
    { id: 'playstore', name: 'Play Store', icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />, bg: 'bg-[#1e293b]' },
    { id: 'spotify', name: 'Spotify Music', icon: <Music className="w-6 h-6 text-green-400" />, bg: 'bg-slate-900' },
    { id: 'files', name: 'Files Manager', icon: <Folder className="w-6 h-6 text-amber-400" />, bg: 'bg-amber-950/40' },
    { id: 'browser', name: 'Chrome', icon: <Globe className="w-6 h-6 text-sky-400" />, bg: 'bg-sky-950' },
  ];

  const handleCommandSubmit = () => {
    if (!commandText.trim()) return;
    const cmd = commandText.trim();
    JarvisVoiceEngine.speak(`Right away, sir. Executing command: ${cmd}`);
    if (onDispatchCommand) {
      onDispatchCommand(cmd);
    }
    setCommandText('');
  };

  const toggleMic = () => {
    setIsListening(true);
    JarvisVoiceEngine.speak('Listening, sir. State your directive.');
    setTimeout(() => {
      setCommandText('Jarvis, analyze my screen and guide me in PUBG');
      setIsListening(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#020617] text-white flex flex-col justify-between p-4 font-sans select-none relative overflow-hidden">
      {/* Dynamic Wallpaper Cosmic Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

      {/* Top Clock & Weather Widget */}
      <div className="relative z-10 pt-3 text-center space-y-1">
        <div className="text-4xl font-extralight tracking-tight font-mono text-slate-100">
          12:45
        </div>
        <div className="text-xs text-sky-300/80 font-medium flex items-center justify-center gap-2">
          <span>{currentDate}</span>
          <span>•</span>
          <span>72°F Sunny</span>
        </div>

        {/* Jarvis Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-xs text-sky-300 shadow-sm mt-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Jarvis Screen-Share AI Active</span>
        </div>
      </div>

      {/* Commanding Slot (Replaces passive search bar) */}
      <div className="relative z-10 my-3">
        <div className="flex items-center gap-2 bg-slate-900/95 border-2 border-sky-500/40 focus-within:border-sky-400 rounded-full px-3.5 py-2 shadow-xl backdrop-blur-md transition-all">
          <button
            onClick={toggleMic}
            className={`p-1.5 rounded-full transition ${
              isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-sky-400 hover:bg-white/10'
            }`}
            title="Speak command to Jarvis"
            aria-label="Voice command"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={commandText}
            onChange={e => setCommandText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCommandSubmit()}
            placeholder="Command Jarvis (e.g. 'Play PUBG and guide me')..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            aria-label="Jarvis Command Slot"
          />

          <button
            onClick={handleCommandSubmit}
            className="p-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 active:scale-95 transition"
            aria-label="Execute command"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* App Grid */}
      <div className="relative z-10 grid grid-cols-4 gap-3 text-center my-auto">
        {defaultAppIcons.map(app => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="group flex flex-col items-center gap-1.5 active:scale-90 transition transform"
            aria-label={`Open ${app.name}`}
          >
            <div className={`w-13 h-13 rounded-2xl ${app.bg} border border-white/10 flex items-center justify-center text-xl shadow-md group-hover:border-sky-400/50 transition`}>
              {app.icon}
            </div>
            <span className="text-[10px] text-slate-300 font-medium tracking-tight truncate w-14">
              {app.name}
            </span>
          </button>
        ))}

        {/* Custom installed apps */}
        {installedApps
          .filter(a => !defaultAppIcons.some(d => d.id === a.id))
          .map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="group flex flex-col items-center gap-1.5 active:scale-90 transition transform"
              aria-label={`Open ${app.name}`}
            >
              <div className="w-13 h-13 rounded-2xl bg-[#1e293b] border border-white/10 flex items-center justify-center text-2xl shadow-md group-hover:border-sky-400/50 transition">
                {app.icon}
              </div>
              <span className="text-[10px] text-slate-300 font-medium tracking-tight truncate w-14">
                {app.name}
              </span>
            </button>
          ))}
      </div>

      {/* Bottom Dock */}
      <div className="relative z-10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-2 border border-slate-800/80 flex items-center justify-around">
        <button
          onClick={() => onOpenApp('pubg')}
          className="w-11 h-11 rounded-xl bg-amber-600/80 active:bg-amber-500 flex items-center justify-center shadow"
          aria-label="PUBG Mobile"
          title="PUBG Mobile with Jarvis Voice Guidance"
        >
          <Target className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => onOpenApp('messages')}
          className="w-11 h-11 rounded-xl bg-emerald-600/80 active:bg-emerald-500 flex items-center justify-center shadow"
          aria-label="WhatsApp / Messages"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => onOpenApp('browser')}
          className="w-11 h-11 rounded-xl bg-sky-600/80 active:bg-sky-500 flex items-center justify-center shadow"
          aria-label="Chrome Web Browser"
        >
          <Globe className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => onOpenApp('settings')}
          className="w-11 h-11 rounded-xl bg-slate-800 active:bg-slate-700 flex items-center justify-center shadow border border-slate-700"
          aria-label="System Settings"
        >
          <Settings className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
