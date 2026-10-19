import React, { useState } from 'react';
import { Key, Plus, Trash2, CheckCircle, AlertTriangle, ShieldCheck, Zap, Activity, RefreshCw } from 'lucide-react';
import { GeminiKeyItem, RotationStrategy } from '../types/agent.ts';

interface KeyPoolManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  keys: GeminiKeyItem[];
  onAddKey: (label: string, rawKey: string) => void;
  onRemoveKey: (id: string) => void;
  strategy: RotationStrategy;
  onSetStrategy: (strategy: RotationStrategy) => void;
  onResetRateLimits: () => void;
  onTestKey: (key: string) => Promise<boolean>;
}

export const KeyPoolManagerModal: React.FC<KeyPoolManagerModalProps> = ({
  isOpen,
  onClose,
  keys,
  onAddKey,
  onRemoveKey,
  strategy,
  onSetStrategy,
  onResetRateLimits,
  onTestKey,
}) => {
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!newLabel.trim() || !newKey.trim()) return;
    setIsTesting(true);
    setTestResult('Verifying API key validity with Gemini server...');
    const isValid = await onTestKey(newKey.trim());
    setIsTesting(false);

    if (isValid) {
      onAddKey(newLabel.trim(), newKey.trim());
      setNewLabel('');
      setNewKey('');
      setTestResult('Key successfully verified and added to pool!');
    } else {
      setTestResult('Key validation failed. Please check key string.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-xs font-sans text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Multi-Key Pool & Load Balancer</h2>
              <p className="text-[11px] text-slate-400">
                Rotate across free Gemini API keys for unlimited zero-cost quota and automatic 429 failover.
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

        {/* Strategy Selector */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-200 block">Rotation Policy</span>
            <span className="text-[10px] text-slate-400">Strategy used when dispatching agent micro-actions</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            {(['round_robin', 'least_used', 'fastest_response', 'failover_chain'] as RotationStrategy[]).map(s => (
              <button
                key={s}
                onClick={() => onSetStrategy(s)}
                className={`px-2.5 py-1 rounded text-[10px] font-medium transition capitalize ${
                  strategy === s
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Keys List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-semibold text-slate-300">Active Keys in Pool ({keys.length})</span>
            <button
              onClick={onResetRateLimits}
              className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset Rate Limit Counters
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {keys.map(k => (
              <div
                key={k.id}
                className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      k.status === 'active'
                        ? 'bg-emerald-400 animate-pulse'
                        : k.status === 'rate_limited'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs truncate">{k.label}</span>
                      {k.isSystemKey && (
                        <span className="text-[9px] bg-sky-950 text-sky-400 border border-sky-800 px-1 rounded font-mono">
                          Default Env
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">{k.keyMasked}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                      <span>Requests: {k.requestCount}</span>
                      <span>•</span>
                      <span>Latency: {k.latencyMs}ms</span>
                      <span>•</span>
                      <span className="text-emerald-400">Cost: $0.00</span>
                    </div>
                  </div>
                </div>

                {!k.isSystemKey && (
                  <button
                    onClick={() => onRemoveKey(k.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                    title="Remove key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add New Key Form */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <span className="font-semibold text-slate-200 block">Add Additional Free Gemini API Key</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="Key Label (e.g. Free Tier Account 2)"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <input
              type="password"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="Paste Gemini API Key (AIzaSy...)"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500">
              Keys remain server-side and never leak to client bundle.
            </span>
            <button
              onClick={handleAdd}
              disabled={isTesting}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Verifying...' : 'Add to Pool'}</span>
            </button>
          </div>

          {testResult && (
            <p className={`text-[10px] font-mono ${testResult.includes('success') ? 'text-emerald-400' : 'text-amber-400'}`}>
              {testResult}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
