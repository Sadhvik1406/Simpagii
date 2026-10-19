import React from 'react';
import { 
  Bot, 
  Cpu, 
  Key, 
  Download, 
  BrainCircuit, 
  Wifi, 
  ShieldCheck, 
  Zap,
  Smartphone
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { GeminiKeyItem, WorkingRAM } from '../types/agent.ts';

interface HeaderProps {
  activeTab: 'simulator' | 'mission' | 'keys' | 'memory' | 'apk';
  setActiveTab: (tab: 'simulator' | 'mission' | 'keys' | 'memory' | 'apk') => void;
  keys: GeminiKeyItem[];
  ram: WorkingRAM;
  tokensSaved: number;
  openApkModal: () => void;
  openKeyModal: () => void;
  openMemoryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  keys,
  ram,
  tokensSaved,
  openApkModal,
  openKeyModal,
  openMemoryModal,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const activeKeysCount = keys.filter(k => k.status === 'active').length;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Companion Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 shadow-lg shadow-sky-500/20 text-white">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                Simp AGI
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  Android Autonomous Agent
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <Wifi className="w-3 h-3" /> Server-Authoritative
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-300 font-mono">0.0% Phone GPU</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-300 font-mono">Free Multi-Key</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Device & Apps
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mission'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Mission Control
          </button>
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'keys'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Key Pool ({activeKeysCount})
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'memory'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            RAM & Memory
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            APK Packager
          </button>
        </nav>

        {/* Quick Actions & Telemetry Badges */}
        <div className="flex items-center gap-2">
          {/* Key Pool Pill */}
          <button
            onClick={openKeyModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
            title="Configure Multi-Key Pool for infinite free tokens"
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span>{activeKeysCount} Keys</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Working RAM Pill */}
          <button
            onClick={openMemoryModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-slate-700 transition"
            title="Short term memory & cached macros"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>RAM: {ram.allocatedKB} KB</span>
            <span className="text-[10px] text-emerald-400">({tokensSaved} tokens saved)</span>
          </button>

          {/* In-App Direct APK Install Button */}
          {isInstallable && !isInstalled ? (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-500/20 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install WebAPK</span>
            </button>
          ) : (
            <button
              onClick={openApkModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium text-xs transition"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>APK Format</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
