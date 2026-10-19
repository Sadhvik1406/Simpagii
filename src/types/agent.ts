export type ActionType = 
  | 'tap'
  | 'double_tap'
  | 'long_press'
  | 'swipe'
  | 'type_text'
  | 'press_key'
  | 'wait'
  | 'extract_data'
  | 'scroll'
  | 'back'
  | 'home';

export interface ActionCoordinates {
  x: number; // 0 - 1000 normalized
  y: number; // 0 - 1000 normalized
  endX?: number; // for swiping/dragging
  endY?: number;
}

export interface ActionStep {
  id: string;
  stepNumber: number;
  timestamp: number;
  actionType: ActionType;
  coords?: ActionCoordinates;
  targetElement?: string;
  payload?: string;
  reasoning: string;
  confidence: number;
  memoryReferenced?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface DeviceState {
  model: string;
  osVersion: string;
  resolution: { width: number; height: number };
  batteryLevel: number;
  isCharging: boolean;
  networkType: 'WiFi 6' | '5G' | 'Offline';
  activeAppId: string;
  activeAppName: string;
  isScreenOn: boolean;
  fps: number;
  touchIndicator?: { x: number; y: number; active: boolean; type?: string; endX?: number; endY?: number };
  boundingBoxes?: Array<{ id: string; label: string; x: number; y: number; width: number; height: number; color?: string }>;
}

export interface GeminiKeyItem {
  id: string;
  label: string;
  keyMasked: string;
  status: 'active' | 'standby' | 'rate_limited' | 'failed';
  requestCount: number;
  tokensUsed: number;
  lastUsed: number;
  latencyMs: number;
  isSystemKey: boolean;
  errorCount: number;
}

export type RotationStrategy = 'round_robin' | 'least_used' | 'fastest_response' | 'failover_chain';

export interface WorkingRAM {
  allocatedKB: number;
  maxAllocatedKB: number;
  activeContextTokens: number;
  cacheHits: number;
  shortTermHistory: Array<{
    id: string;
    role: 'user' | 'agent' | 'vision_sensor';
    content: string;
    timestamp: number;
  }>;
  activeVisualVectors: number;
}

export interface EpisodicMemory {
  id: string;
  title: string;
  category: 'gaming' | 'data_entry' | 'music' | 'system' | 'custom';
  description: string;
  triggerPattern: string;
  learnedAt: string;
  executionCount: number;
  successRate: number;
  tokensSavedTotal: number;
  learnedMacro: ActionStep[];
  isOptimized: boolean;
}

export interface TaskPreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'gaming' | 'data_entry' | 'music' | 'files' | 'custom';
  targetApp: string;
  icon: string;
  prompt: string;
  estimatedSteps: number;
  memoryKey?: string;
}

export type TaskPriority = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';

export interface QueuedTaskItem {
  id: string;
  title: string;
  category: 'gaming' | 'data_entry' | 'music' | 'files' | 'custom' | 'security';
  targetApp: string;
  priority: TaskPriority;
  deadlineMinutes: number; // e.g. 2 means due in 2 minutes
  deadlineTimestamp: number;
  status: 'queued' | 'running' | 'completed' | 'preempted';
  urgencyScore: number;
  prompt: string;
}

export type QueueSortMode = 'urgency' | 'priority' | 'earliest_deadline';

