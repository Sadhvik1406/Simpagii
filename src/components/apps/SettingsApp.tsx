import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Accessibility, 
  FolderLock, 
  Layers, 
  BatteryCharging, 
  Wifi, 
  Cpu, 
  Info,
  Terminal,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SettingsAppProps {
  isAgentActive?: boolean;
}

export const SettingsApp: React.FC<SettingsAppProps> = () => {
  const [permissions, setPermissions] = useState({
    accessibility: true,
    allFiles: true,
    overlay: true,
    batteryOpt: false, // battery optimization disabled = unrestricted
    installApk: true,
    notificationListener: true,
  });

  const toggle = (key: keyof typeof permissions) => {
    setPermissions(p => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="w-full h-full bg-[#121212] text-white flex flex-col font-sans select-none overflow-y-auto text-xs">
      {/* Settings Header */}
      <div className="bg-[#1e1e1e] px-4 py-3 border-b border-white/10 flex items-center gap-2 shrink-0">
        <Settings className="w-4 h-4 text-slate-300" />
        <h2 className="text-sm font-bold text-white">Android System Settings</h2>
      </div>

      <div className="p-3 space-y-4">
        {/* AGI Agent Permissions Banner */}
        <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 rounded-xl p-3 shadow-md space-y-1">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>AstraClaw AGI Agent Super-Privileges</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Unrestricted device permissions enabled. The agent can perceive the entire display, touch UI elements, modify files, and run background tasks without human intervention.
          </p>
        </div>

        {/* Permission Toggles */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Permissions & Accessibility
          </h3>

          <div className="bg-[#1c1c1c] rounded-xl border border-white/5 divide-y divide-white/5">
            {/* Accessibility Service */}
            <div
              onClick={() => toggle('accessibility')}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Accessibility Service</div>
                  <div className="text-[10px] text-slate-400">Allows global screen reading and touch dispatch</div>
                </div>
              </div>
              {permissions.accessibility ? (
                <span className="text-emerald-400 font-bold text-[11px]">ON</span>
              ) : (
                <span className="text-slate-500 font-bold text-[11px]">OFF</span>
              )}
            </div>

            {/* All Files Access */}
            <div
              onClick={() => toggle('allFiles')}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <FolderLock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Manage All Files (MANAGE_EXTERNAL_STORAGE)</div>
                  <div className="text-[10px] text-slate-400">Full read/write/edit access to internal storage & SD card</div>
                </div>
              </div>
              {permissions.allFiles ? (
                <span className="text-emerald-400 font-bold text-[11px]">ON</span>
              ) : (
                <span className="text-slate-500 font-bold text-[11px]">OFF</span>
              )}
            </div>

            {/* Draw Over Other Apps */}
            <div
              onClick={() => toggle('overlay')}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Display Over Other Apps (Overlay)</div>
                  <div className="text-[10px] text-slate-400">Renders floating Astra neural companion HUD</div>
                </div>
              </div>
              {permissions.overlay ? (
                <span className="text-emerald-400 font-bold text-[11px]">ON</span>
              ) : (
                <span className="text-slate-500 font-bold text-[11px]">OFF</span>
              )}
            </div>

            {/* Silent APK Installation */}
            <div
              onClick={() => toggle('installApk')}
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Install Unknown Apps (Package Installer)</div>
                  <div className="text-[10px] text-slate-400">Allows autonomous one-tap APK installation</div>
                </div>
              </div>
              {permissions.installApk ? (
                <span className="text-emerald-400 font-bold text-[11px]">ON</span>
              ) : (
                <span className="text-slate-500 font-bold text-[11px]">OFF</span>
              )}
            </div>
          </div>
        </div>

        {/* Device Specifications & Hardware Info */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Device Information
          </h3>

          <div className="bg-[#1c1c1c] rounded-xl border border-white/5 p-3 space-y-2">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Device Model</span>
              <span className="font-semibold text-white">Pixel Tablet / Galaxy Ultra</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Android Version</span>
              <span className="font-semibold text-white">Android 15 (Vanilla Ice Cream)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Device RAM</span>
              <span className="font-mono text-emerald-400 font-semibold">12 GB LPDDR5X</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Companion CPU Burden</span>
              <span className="font-mono text-emerald-400 font-semibold">0.4% (Zero-GPU mobile)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
