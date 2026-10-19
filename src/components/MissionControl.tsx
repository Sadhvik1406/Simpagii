import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  AlertCircle,
  Volume2,
  VolumeX,
  Mic,
  Send,
  Radio,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { ActionStep, TaskPreset, QueuedTaskItem, TaskPriority, QueueSortMode } from '../types/agent.ts';
import { JarvisVoiceEngine } from '../utils/speech.ts';

interface MissionControlProps {
  currentTask: string;
  onSelectPreset: (preset: TaskPreset) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onStepForward: () => void;
  onReset: () => void;
  actionHistory: ActionStep[];
  onLearnRoutine: () => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  onRunCustomPrompt: (prompt?: string) => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  currentTask,
  onSelectPreset,
  isRunning,
  onToggleRun,
  onStepForward,
  onReset,
  actionHistory,
  onLearnRoutine,
  customPrompt,
  setCustomPrompt,
  onRunCustomPrompt,
}) => {
  // Voice Mute State
  const [isVoiceMuted, setIsVoiceMuted] = useState(JarvisVoiceEngine.getMuted());
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Dynamic Task Queue with Priorities and Deadlines
  const [sortMode, setSortMode] = useState<QueueSortMode>('urgency');
  const [taskQueue, setTaskQueue] = useState<QueuedTaskItem[]>([
    {
      id: 'task_pubg_tactical',
      title: 'PUBG Tactical Vision: Enemy Tracking & Recoil Analysis',
      category: 'gaming',
      targetApp: 'pubg',
      priority: 'P0_CRITICAL',
      deadlineMinutes: 1,
      deadlineTimestamp: Date.now() + 60 * 1000,
      status: 'running',
      urgencyScore: 98,
      prompt: 'Screen share PUBG Mobile, analyze enemy bearing, and talk out loud with tactical guidance.',
    },
    {
      id: 'task_mom_data',
      title: "Mom's Urgent Medical Ledger Data Entry",
      category: 'data_entry',
      targetApp: 'data_entry',
      priority: 'P1_HIGH',
      deadlineMinutes: 4,
      deadlineTimestamp: Date.now() + 240 * 1000,
      status: 'queued',
      urgencyScore: 82,
      prompt: 'Open Excel sheets, parse invoice #INV-4402, and type row data into table with verification.',
    },
    {
      id: 'task_insta_dms',
      title: 'Instagram Social: Check DMs & Auto-Reply to Mom',
      category: 'custom',
      targetApp: 'instagram',
      priority: 'P2_MEDIUM',
      deadlineMinutes: 12,
      deadlineTimestamp: Date.now() + 720 * 1000,
      status: 'queued',
      urgencyScore: 54,
      prompt: 'Open Instagram direct messages, check latest unread chat, and draft auto-reply.',
    },
    {
      id: 'task_storage_clean',
      title: 'Storage Optimization: Clean Duplicate PDF Invoices',
      category: 'files',
      targetApp: 'files',
      priority: 'P3_LOW',
      deadlineMinutes: 30,
      deadlineTimestamp: Date.now() + 1800 * 1000,
      status: 'queued',
      urgencyScore: 28,
      prompt: 'Scan internal downloads folder, delete duplicate invoices, and optimize memory.',
    },
  ]);

  // Form for adding custom queued tasks
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('P1_HIGH');
  const [newDeadlineMin, setNewDeadlineMin] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);

  // Dynamic sorting algorithm based on sortMode
  const sortQueue = (items: QueuedTaskItem[], mode: QueueSortMode) => {
    const sorted = [...items];
    if (mode === 'priority') {
      const rank = { P0_CRITICAL: 0, P1_HIGH: 1, P2_MEDIUM: 2, P3_LOW: 3 };
      sorted.sort((a, b) => rank[a.priority] - rank[b.priority]);
    } else if (mode === 'earliest_deadline') {
      sorted.sort((a, b) => a.deadlineTimestamp - b.deadlineTimestamp);
    } else {
      // Urgency Score: (Priority weight) + (Time urgency)
      sorted.sort((a, b) => b.urgencyScore - a.urgencyScore);
    }
    return sorted;
  };

  const handleSortChange = (newMode: QueueSortMode) => {
    setSortMode(newMode);
    setTaskQueue(prev => sortQueue(prev, newMode));
    JarvisVoiceEngine.speak(`Re-sorted task queue according to ${newMode.replace('_', ' ')} policy.`);
  };

  const moveTask = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= taskQueue.length) return;
    const copy = [...taskQueue];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setTaskQueue(copy);
  };

  const removeTask = (id: string) => {
    setTaskQueue(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const rankScore = newPriority === 'P0_CRITICAL' ? 95 : newPriority === 'P1_HIGH' ? 80 : newPriority === 'P2_MEDIUM' ? 50 : 25;
    const deadlineScore = Math.max(5, 50 - newDeadlineMin * 2);

    const newTask: QueuedTaskItem = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      category: 'custom',
      targetApp: 'home',
      priority: newPriority,
      deadlineMinutes: newDeadlineMin,
      deadlineTimestamp: Date.now() + newDeadlineMin * 60 * 1000,
      status: 'queued',
      urgencyScore: rankScore + deadlineScore,
      prompt: newTitle.trim(),
    };

    const updated = sortQueue([newTask, ...taskQueue], sortMode);
    setTaskQueue(updated);
    setNewTitle('');
    setShowAddForm(false);
    JarvisVoiceEngine.speak(`Added directive: ${newTask.title} with priority ${newTask.priority}.`);
  };

  const toggleVoiceMute = () => {
    const nextMuted = !isVoiceMuted;
    setIsVoiceMuted(nextMuted);
    JarvisVoiceEngine.setMuted(nextMuted);
  };

  const handleVoiceListen = () => {
    setIsVoiceListening(true);
    JarvisVoiceEngine.speak('Listening, sir. State your command.');
    setTimeout(() => {
      const simulatedVoice = 'Jarvis, analyze my screen and guide me in PUBG';
      setCustomPrompt(simulatedVoice);
      setIsVoiceListening(false);
      onRunCustomPrompt(simulatedVoice);
    }, 1800);
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'P0_CRITICAL':
        return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">P0 CRITICAL</span>;
      case 'P1_HIGH':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">P1 HIGH</span>;
      case 'P2_MEDIUM':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">P2 MEDIUM</span>;
      case 'P3_LOW':
      default:
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono">P3 LOW</span>;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
      {/* Jarvis Voice & Master Directive Commanding Slot */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border-2 border-sky-500/40 rounded-3xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shadow">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Jarvis Tactical Voice & Command Slot
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono">
                  Live Screen Guidance
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Talk to Simp AGI like Jarvis to Iron Man. It watches your screen, guides your gameplay, and executes tasks.
              </p>
            </div>
          </div>

          {/* Voice Audio Mute Toggle */}
          <button
            onClick={toggleVoiceMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition active:scale-95 ${
              isVoiceMuted
                ? 'bg-slate-800 text-slate-400 border-slate-700'
                : 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-md shadow-emerald-950'
            }`}
            title="Toggle audible voice spoken by Jarvis"
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
            <span>{isVoiceMuted ? 'Voice Muted' : 'Jarvis Voice: ON'}</span>
          </button>
        </div>

        {/* Commanding Input Slot */}
        <div className="flex gap-2">
          <button
            onClick={handleVoiceListen}
            className={`px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold transition active:scale-95 shrink-0 ${
              isVoiceListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40'
            }`}
            title="Click to speak command"
          >
            <Mic className="w-4 h-4" />
            <span>{isVoiceListening ? 'Listening...' : 'Speak'}</span>
          </button>

          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onRunCustomPrompt()}
            placeholder="Command Jarvis (e.g. 'Jarvis, guide me in PUBG' or 'Finish mom\'s invoice now')..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-sans"
            aria-label="Universal Agent Prompt"
          />

          <button
            onClick={() => onRunCustomPrompt()}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-sky-500/20 transition active:scale-95 shrink-0 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            Dispatch
          </button>
        </div>

        {/* Quick Tactical Command Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-400 text-[10px] font-semibold uppercase">Quick Directives:</span>
          {[
            { label: '🎯 Guide PUBG Gameplay', prompt: 'Play PUBG Mobile, analyze enemy bearings, and talk to me with live audio guidance.' },
            { label: "📊 Finish Mom's Invoices", prompt: "Open Excel sheets, parse invoice #INV-4402, and type row data into table with verification." },
            { label: '🛍️ Install Play Store App', prompt: 'Open Play Store and install Roblox app with verified security.' },
            { label: '💬 Check Instagram DMs', prompt: 'Open Instagram direct messages, check latest unread chat, and draft auto-reply.' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCustomPrompt(chip.prompt);
                onRunCustomPrompt(chip.prompt);
                JarvisVoiceEngine.speak(`Directive accepted: ${chip.label}`);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Queue Priority System with Dynamic Re-sorting */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Task Queue & Priority Preemption System
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Dynamically re-sorts tasks based on deadlines and importance levels. P0 Critical tasks preempt background work.
            </p>
          </div>

          {/* Dynamic Sorting Policy Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-500 px-1 font-semibold">Sort by:</span>
            {(['urgency', 'priority', 'earliest_deadline'] as QueueSortMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handleSortChange(mode)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition capitalize ${
                  sortMode === mode
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Task Queue List */}
        <div className="space-y-2">
          {taskQueue.map((task, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                  isFirst
                    ? 'bg-gradient-to-r from-sky-950/40 to-slate-950 border-sky-400/50 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/80 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex flex-col items-center justify-center shrink-0 pt-0.5">
                    <span className="text-[10px] font-mono font-bold text-slate-500">#{idx + 1}</span>
                    {isFirst && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mt-1" title="Currently Active" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-xs truncate">{task.title}</span>
                      {getPriorityBadge(task.priority)}
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1 bg-amber-950/30 px-1.5 py-0.2 rounded border border-amber-800/30">
                        <Clock className="w-3 h-3" /> Due in {task.deadlineMinutes}m
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                      <span>Target: <strong className="text-white">{task.targetApp}</strong></span>
                      <span>•</span>
                      <span>Urgency Score: <strong className="text-sky-400">{task.urgencyScore}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{task.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Queue Controls: Move Up/Down & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveTask(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move higher priority"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveTask(idx, 'down')}
                    disabled={idx === taskQueue.length - 1}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                    title="Move lower priority"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Custom Task Disclosure */}
        <div className="pt-1">
          {showAddForm ? (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs block">Enqueue New Priority Directive</span>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Directive title (e.g. 'Analyze PUBG weapon spray stats')..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Priority:</span>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as TaskPriority)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white"
                    >
                      <option value="P0_CRITICAL">P0 (Critical Preemption)</option>
                      <option value="P1_HIGH">P1 (High Urgency)</option>
                      <option value="P2_MEDIUM">P2 (Medium Normal)</option>
                      <option value="P3_LOW">P3 (Low Background)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Deadline:</span>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={newDeadlineMin}
                      onChange={e => setNewDeadlineMin(Number(e.target.value))}
                      className="w-14 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-white"
                    />
                    <span className="text-[10px] text-slate-400">mins</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="px-3.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Enqueue Task
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-dashed border-slate-700 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Add Custom Priority Task to Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Autopilot Execution Controls */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onToggleRun();
              if (!isRunning) {
                JarvisVoiceEngine.speak('Autopilot engaged. Monitoring screen and executing priority directive.');
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Autopilot</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Autopilot</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition active:scale-95"
          >
            <StepForward className="w-4 h-4 text-sky-400" />
            <span>Step Action</span>
          </button>

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Reset Mission"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {actionHistory.length > 0 && (
          <button
            onClick={onLearnRoutine}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Save as Zero-Token Macro</span>
          </button>
        )}
      </div>

      {/* Live Action & Reasoning Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Jarvis Reasoning & Tactical Screen Stream
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {actionHistory.length} actions logged
          </span>
        </div>

        {actionHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Standing by. Click &ldquo;Start Autopilot&rdquo; or dispatch a voice command above.
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {actionHistory.map(step => (
              <div
                key={step.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-400/30 text-sky-300 font-mono text-[10px] uppercase font-bold">
                      Step {step.stepNumber}: {step.actionType}
                    </span>
                    {step.coords && (
                      <span className="text-[10px] font-mono text-slate-400">
                        X: {step.coords.x}, Y: {step.coords.y}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Conf: {(step.confidence * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="text-slate-200 font-medium">
                    {step.reasoning}
                  </p>

                  {step.targetElement && (
                    <div className="text-[11px] text-slate-400">
                      Target: <span className="text-white font-mono">{step.targetElement}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Done</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
