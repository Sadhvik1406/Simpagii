import React from 'react';
import { BrainCircuit, Cpu, Zap, Sparkles, CheckCircle2, Play, HardDrive, Trash2 } from 'lucide-react';
import { EpisodicMemory, WorkingRAM } from '../types/agent.ts';

interface MemoryMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  ram: WorkingRAM;
  memories: EpisodicMemory[];
  onExecuteMacro: (macro: EpisodicMemory) => void;
  onClearRAM: () => void;
}

export const MemoryMatrixModal: React.FC<MemoryMatrixModalProps> = ({
  isOpen,
  onClose,
  ram,
  memories,
  onExecuteMacro,
  onClearRAM,
}) => {
  if (!isOpen) return null;

  const totalTokensSaved = memories.reduce((acc, m) => acc + m.tokensSavedTotal, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-xs font-sans text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Neural Memory & Procedural Macro Bank</h2>
              <p className="text-[11px] text-slate-400">
                Working RAM context vector buffer and learned episodic macros that run at 0 token cost.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Working RAM Telemetry Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Allocated RAM</span>
            <div className="text-base font-bold font-mono text-white mt-0.5">{ram.allocatedKB} KB</div>
            <span className="text-[9px] text-slate-500">Max 4096 KB</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Context Tokens</span>
            <div className="text-base font-bold font-mono text-sky-400 mt-0.5">{ram.activeContextTokens}</div>
            <span className="text-[9px] text-slate-500">Short-term working memory</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">RAM Cache Hits</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{ram.cacheHits}</div>
            <span className="text-[9px] text-slate-500">Instant bypass</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tokens Saved</span>
            <div className="text-base font-bold font-mono text-purple-400 mt-0.5">{totalTokensSaved.toLocaleString()}</div>
            <span className="text-[9px] text-emerald-400">$0.00 Cost</span>
          </div>
        </div>

        {/* Short Term Memory History Viewer */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="font-semibold text-slate-300">Active Working Memory Logs</span>
            <button
              onClick={onClearRAM}
              className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Clear RAM Buffer
            </button>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 max-h-32 overflow-y-auto space-y-1 font-mono text-[10px]">
            {ram.shortTermHistory.length === 0 ? (
              <span className="text-slate-500">Working memory empty. Ready for new task.</span>
            ) : (
              ram.shortTermHistory.map(item => (
                <div key={item.id} className="flex items-start gap-2 text-slate-300">
                  <span className={`font-bold ${item.role === 'user' ? 'text-sky-400' : 'text-purple-400'}`}>
                    [{item.role}]:
                  </span>
                  <span className="truncate flex-1">{item.content}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Learned Episodic Macros */}
        <div className="space-y-2">
          <span className="font-semibold text-slate-300 px-1 block">
            Compiled Zero-Token Macros ({memories.length})
          </span>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {memories.map(m => (
              <div
                key={m.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{m.title}</span>
                    <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded font-mono">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      +{m.tokensSavedTotal} tokens saved
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{m.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                    <span>{m.learnedMacro.length} Steps</span>
                    <span>•</span>
                    <span>Success Rate: {m.successRate}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onExecuteMacro(m)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition active:scale-95 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute (0-Token)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
