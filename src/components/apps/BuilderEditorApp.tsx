import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Terminal, 
  FileCode, 
  FolderGit2, 
  Check, 
  Save, 
  Sparkles, 
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

interface BuilderEditorAppProps {
  isAgentActive?: boolean;
}

export const BuilderEditorApp: React.FC<BuilderEditorAppProps> = ({ isAgentActive = false }) => {
  const [activeFile, setActiveFile] = useState('mom_invoice_parser.ts');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([
    '[AstraClaw Builder] Environment: Android Termux / Server V8 Engine',
    '[AstraClaw Builder] Super-Permissions: BIND_ACCESSIBILITY_SERVICE active',
    '[AstraClaw Builder] Ready for autonomous file editing and building.',
  ]);

  const files = [
    {
      name: 'mom_invoice_parser.ts',
      language: 'typescript',
      content: `// Autonomous Mom Data Entry Parser
import { extractInvoiceData } from './ocr_vision';

export async function processScannedInvoice(imageBuffer: Uint8Array) {
  const invoice = await extractInvoiceData(imageBuffer);
  console.log(\`Parsed Invoice: \${invoice.vendor} - $\${invoice.total}\`);
  
  // Auto-inject rows into Excel spreadsheet
  await android.sheets.appendRow({
    date: invoice.date,
    number: invoice.number,
    amount: invoice.total,
    verified: true
  });
  return { status: 'COMPLETED', savedTokens: 1400 };
}`,
    },
    {
      name: 'pubg_tactical_bot.js',
      language: 'javascript',
      content: `// PUBG Mobile Real-Time Screen Vision & Tactical Guidance
function onVisionTick(screenFrame) {
  const hostileTarget = detectObject(screenFrame, 'enemy_player');
  if (hostileTarget && hostileTarget.confidence > 0.92) {
    // Notify Jarvis voice engine and mark target
    speakJarvis(\`Hostile spotted at bearing \${hostileTarget.bearing}°, \${hostileTarget.distanceMeters}m\`);
    renderTacticalOverlay(hostileTarget.x, hostileTarget.y, 'HOSTILE_LOCKED');
    console.log('[Tactical] Target locked at (' + hostileTarget.x + ', ' + hostileTarget.y + ')');
  }
}`,
    },
    {
      name: 'build_apk.sh',
      language: 'bash',
      content: `#!/bin/bash
# Autonomous APK packager on device (Zero PC needed!)
echo "Building AstraClaw Standalone WebAPK..."
export ANDROID_HOME=/data/data/com.termux/files/usr/opt/android-sdk
gradle assembleRelease --no-daemon
echo "Built: app-release.apk (14.2 MB) [SIGNED]"`,
    },
  ];

  const currentFileObj = files.find(f => f.name === activeFile) || files[0];
  const [editorText, setEditorText] = useState(currentFileObj.content);

  const handleSelectFile = (fileName: string) => {
    setActiveFile(fileName);
    const found = files.find(f => f.name === fileName);
    if (found) setEditorText(found.content);
  };

  const runBuild = () => {
    setIsBuilding(true);
    setBuildLogs(prev => [
      ...prev,
      `[Compile] Compiling ${activeFile}...`,
      '[Transform] Generating bytecode for Android V8 runtime...',
    ]);

    setTimeout(() => {
      setBuildLogs(prev => [
        ...prev,
        `[Build Success] Built ${activeFile} in 312ms. Output verified.`,
        '[Deploy] Micro-routine registered into AstraClaw Memory Bank (0 Token Cost).',
      ]);
      setIsBuilding(false);
    }, 900);
  };

  return (
    <div className="w-full h-full bg-[#181824] text-slate-100 flex flex-col font-mono text-xs select-none overflow-hidden">
      {/* Top IDE Toolbar */}
      <div className="bg-[#12121c] px-3 py-2 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white text-xs">Astra Developer Studio</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded">
            Full System Permissions
          </span>
        </div>

        <button
          onClick={runBuild}
          disabled={isBuilding}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition active:scale-95 shadow-sm"
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isBuilding ? 'animate-spin' : ''}`} />
          <span>{isBuilding ? 'Building...' : 'Build & Run'}</span>
        </button>
      </div>

      {/* File Tabs */}
      <div className="bg-[#151522] px-2 pt-1 border-b border-slate-800 flex gap-1 overflow-x-auto shrink-0">
        {files.map(f => (
          <button
            key={f.name}
            onClick={() => handleSelectFile(f.name)}
            className={`px-2.5 py-1.5 rounded-t text-[11px] font-medium flex items-center gap-1.5 border-t-2 transition ${
              activeFile === f.name
                ? 'bg-[#181824] border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-400" />
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* Code Editor Surface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-[#12121c] py-2 px-2 text-right text-slate-600 select-none font-mono text-[11px] border-r border-slate-800/80">
          {editorText.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={editorText}
          onChange={e => setEditorText(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent p-2 text-sky-100 font-mono text-[11px] leading-relaxed resize-none focus:outline-none overflow-y-auto selection:bg-sky-500/30"
          aria-label="Code Editor"
        />
      </div>

      {/* Build & Terminal Logs */}
      <div className="h-28 bg-[#0d0d15] border-t border-slate-800 flex flex-col shrink-0">
        <div className="bg-[#14141e] px-2.5 py-1 text-[10px] text-slate-400 flex items-center justify-between border-b border-slate-800">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-emerald-400" /> Terminal & Build Output
          </span>
          <span className="text-emerald-400 font-mono">Status: Ready</span>
        </div>
        <div className="flex-1 p-2 overflow-y-auto text-[10px] text-slate-300 font-mono space-y-0.5">
          {buildLogs.map((log, idx) => (
            <div
              key={idx}
              className={log.includes('Success') ? 'text-emerald-400 font-bold' : log.includes('Compile') ? 'text-sky-300' : 'text-slate-400'}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
