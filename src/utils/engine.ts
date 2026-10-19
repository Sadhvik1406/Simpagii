import type { ActionStep, EpisodicMemory, GeminiKeyItem, RotationStrategy, WorkingRAM } from '../types/agent.ts';

export interface CircuitBreakerState {
  failureCount: number;
  lastFailureTime: number;
  coolingUntil: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN'; // CLOSED = healthy, OPEN = tripped/cooling, HALF_OPEN = trial
}

/**
 * Robust Multi-Key Manager & Load Balancer with Circuit Breaker and Auto-Failover
 */
export class RobustKeyPoolManager {
  private keys: GeminiKeyItem[];
  private circuitBreakers: Map<string, CircuitBreakerState>;
  private currentIndex: number = 0;
  private strategy: RotationStrategy;
  private failoverLogs: Array<{ timestamp: number; message: string; fromKey?: string; toKey?: string }> = [];

  constructor(initialKeys: GeminiKeyItem[], strategy: RotationStrategy = 'round_robin') {
    this.keys = [...initialKeys];
    this.circuitBreakers = new Map();
    this.strategy = strategy;

    for (const key of this.keys) {
      this.circuitBreakers.set(key.id, {
        failureCount: 0,
        lastFailureTime: 0,
        coolingUntil: 0,
        state: 'CLOSED',
      });
    }
  }

  public getKeys(): GeminiKeyItem[] {
    this.updateCircuitBreakers();
    return [...this.keys];
  }

  public getLogs() {
    return [...this.failoverLogs].slice(-20);
  }

  public setStrategy(strategy: RotationStrategy): void {
    this.strategy = strategy;
  }

  public getStrategy(): RotationStrategy {
    return this.strategy;
  }

  public addKey(label: string, rawKey: string): GeminiKeyItem {
    const masked = rawKey.length > 8 
      ? `${rawKey.substring(0, 4)}...${rawKey.substring(rawKey.length - 4)}` 
      : 'AIzaSy***';
    const newKey: GeminiKeyItem = {
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      label,
      keyMasked: masked,
      status: 'active',
      requestCount: 0,
      tokensUsed: 0,
      lastUsed: 0,
      latencyMs: 95,
      isSystemKey: false,
      errorCount: 0,
    };
    this.keys.push(newKey);
    this.circuitBreakers.set(newKey.id, {
      failureCount: 0,
      lastFailureTime: 0,
      coolingUntil: 0,
      state: 'CLOSED',
    });
    this.failoverLogs.unshift({
      timestamp: Date.now(),
      message: `Added key "${label}" to pool. Strategy: ${this.strategy}.`,
    });
    return newKey;
  }

  public addBulkKeys(rawKeys: string[]): number {
    let added = 0;
    for (const raw of rawKeys) {
      const clean = raw.trim();
      if (clean.length > 10) {
        this.addKey(`Free Account Key ${this.keys.length + 1}`, clean);
        added++;
      }
    }
    return added;
  }

  public removeKey(id: string): boolean {
    const prev = this.keys.length;
    this.keys = this.keys.filter(k => k.id !== id);
    this.circuitBreakers.delete(id);
    return this.keys.length < prev;
  }

  /**
   * Refreshes circuit breakers based on cooldown timers
   */
  private updateCircuitBreakers(): void {
    const now = Date.now();
    for (const key of this.keys) {
      const cb = this.circuitBreakers.get(key.id);
      if (cb && cb.state === 'OPEN' && now >= cb.coolingUntil) {
        cb.state = 'HALF_OPEN';
        key.status = 'standby';
        this.failoverLogs.unshift({
          timestamp: now,
          message: `Key "${key.label}" cooling window expired. Testing in HALF_OPEN state.`,
        });
      }
    }
  }

  public getActiveKey(): GeminiKeyItem | null {
    return this.selectKey();
  }

  /**
   * Selects optimal healthy key based on active strategy
   */
  public selectKey(): GeminiKeyItem | null {
    this.updateCircuitBreakers();

    const candidates = this.keys.filter(k => {
      const cb = this.circuitBreakers.get(k.id);
      return cb?.state === 'CLOSED' || cb?.state === 'HALF_OPEN' || k.status === 'active' || k.status === 'standby';
    });

    if (candidates.length === 0) {
      // If all are cooling, force half-open on the key with earliest cooling expiry
      const sortedByCooling = [...this.keys].sort((a, b) => {
        const cbA = this.circuitBreakers.get(a.id)?.coolingUntil || 0;
        const cbB = this.circuitBreakers.get(b.id)?.coolingUntil || 0;
        return cbA - cbB;
      });
      const fallback = sortedByCooling[0] || null;
      if (fallback) {
        const cb = this.circuitBreakers.get(fallback.id);
        if (cb) cb.state = 'HALF_OPEN';
        fallback.status = 'active';
      }
      return fallback;
    }

    if (this.strategy === 'round_robin') {
      const selected = candidates[this.currentIndex % candidates.length];
      this.currentIndex = (this.currentIndex + 1) % candidates.length;
      return selected;
    }

    if (this.strategy === 'least_used') {
      return [...candidates].sort((a, b) => a.requestCount - b.requestCount)[0];
    }

    if (this.strategy === 'fastest_response') {
      return [...candidates].sort((a, b) => a.latencyMs - b.latencyMs)[0];
    }

    // failover_chain: pick first healthy candidate
    return candidates[0];
  }

  /**
   * Records successful response
   */
  public recordSuccess(keyId: string, tokens: number, latencyMs: number): void {
    const key = this.keys.find(k => k.id === keyId);
    if (!key) return;

    key.requestCount += 1;
    key.tokensUsed += tokens;
    key.lastUsed = Date.now();
    key.latencyMs = Math.round((key.latencyMs * 0.7) + (latencyMs * 0.3));
    key.status = 'active';

    const cb = this.circuitBreakers.get(keyId);
    if (cb) {
      cb.failureCount = 0;
      cb.state = 'CLOSED';
    }
  }

  /**
   * Records failure with circuit breaker tripping and seamless failover
   */
  public recordFailure(keyId: string, isRateLimit: boolean): { nextKey: GeminiKeyItem | null; cooldownSec: number } {
    const key = this.keys.find(k => k.id === keyId);
    const cb = this.circuitBreakers.get(keyId);
    const now = Date.now();

    // Exponential backoff cooldown: 30s for rate limit, 15s for transient error
    const cooldownSec = isRateLimit ? 35 : 15;

    if (key && cb) {
      key.errorCount += 1;
      cb.failureCount += 1;
      cb.lastFailureTime = now;
      cb.coolingUntil = now + (cooldownSec * 1000);
      cb.state = 'OPEN';
      key.status = 'rate_limited';

      this.failoverLogs.unshift({
        timestamp: now,
        message: `Key "${key.label}" hit ${isRateLimit ? '429 Rate Limit' : 'Error'}. Tripped circuit breaker for ${cooldownSec}s.`,
        fromKey: key.label,
      });
    }

    const nextKey = this.selectKey();
    if (nextKey && key) {
      this.failoverLogs.unshift({
        timestamp: now,
        message: `Seamless hot-failover: switched traffic from "${key.label}" to "${nextKey.label}".`,
        fromKey: key.label,
        toKey: nextKey.label,
      });
    }

    return { nextKey, cooldownSec };
  }

  /**
   * Resets all rate limits and circuit breakers manually
   */
  public resetAllLimits(): void {
    for (const key of this.keys) {
      key.status = 'active';
      key.errorCount = 0;
      const cb = this.circuitBreakers.get(key.id);
      if (cb) {
        cb.failureCount = 0;
        cb.state = 'CLOSED';
        cb.coolingUntil = 0;
      }
    }
    this.failoverLogs.unshift({
      timestamp: Date.now(),
      message: 'Manual reset triggered: all circuit breakers reset to CLOSED.',
    });
  }
}

/**
 * Backward compatibility alias
 */
export { RobustKeyPoolManager as KeyPoolManager };

/**
 * WorkingMemoryBuffer:
 * Manages the agent's short-term working RAM.
 */
export class WorkingMemoryBuffer {
  private ram: WorkingRAM;
  private maxHistoryItems: number;

  constructor(maxHistoryItems: number = 20) {
    this.maxHistoryItems = maxHistoryItems;
    this.ram = {
      allocatedKB: 256,
      maxAllocatedKB: 4096,
      activeContextTokens: 140,
      cacheHits: 0,
      shortTermHistory: [],
      activeVisualVectors: 12,
    };
  }

  public getRAM(): WorkingRAM {
    return { ...this.ram, shortTermHistory: [...this.ram.shortTermHistory] };
  }

  public addMemory(role: 'user' | 'agent' | 'vision_sensor', content: string): void {
    this.ram.shortTermHistory.push({
      id: `ram_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      role,
      content,
      timestamp: Date.now(),
    });

    if (this.ram.shortTermHistory.length > this.maxHistoryItems) {
      this.ram.shortTermHistory.shift();
    }

    this.ram.activeContextTokens = this.ram.shortTermHistory.reduce(
      (acc, item) => acc + Math.ceil(item.content.length / 4), 
      100
    );
    this.ram.allocatedKB = Math.min(
      this.ram.maxAllocatedKB,
      128 + Math.round((this.ram.activeContextTokens * 1.5) / 10)
    );
  }

  public recordCacheHit(): void {
    this.ram.cacheHits += 1;
  }

  public clearWorkingRAM(): void {
    this.ram.shortTermHistory = [];
    this.ram.activeContextTokens = 50;
    this.ram.allocatedKB = 128;
  }
}

/**
 * CoordinateCalculator:
 * Translates between normalized 0..1000 coordinate space and native phone screen pixels.
 */
export class CoordinateCalculator {
  public static normalize(pixelX: number, pixelY: number, screenW: number, screenH: number): { x: number; y: number } {
    return {
      x: Math.round(Math.max(0, Math.min(1000, (pixelX / screenW) * 1000))),
      y: Math.round(Math.max(0, Math.min(1000, (pixelY / screenH) * 1000))),
    };
  }

  public static toPixels(normX: number, normY: number, screenW: number, screenH: number): { pxX: number; pxY: number } {
    return {
      pxX: Math.round((normX / 1000) * screenW),
      pxY: Math.round((normY / 1000) * screenH),
    };
  }

  public static isWithinBounds(
    point: { x: number; y: number },
    box: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      point.x >= box.x &&
      point.x <= box.x + box.width &&
      point.y >= box.y &&
      point.y <= box.y + box.height
    );
  }
}

/**
 * MacroCompiler:
 * Compiles a series of executed actions into a reusable Episodic Macro.
 */
export class MacroCompiler {
  public static compileToMacro(
    title: string,
    category: EpisodicMemory['category'],
    description: string,
    triggerPattern: string,
    steps: ActionStep[]
  ): EpisodicMemory {
    const optimizedSteps: ActionStep[] = steps
      .filter(s => s.status === 'completed' && s.actionType !== 'wait')
      .map((s, idx) => ({
        ...s,
        stepNumber: idx + 1,
        id: `macro_step_${idx + 1}`,
        confidence: 0.99,
        reasoning: `Cached procedural step ${idx + 1}: ${s.actionType} ${s.targetElement || ''}`,
      }));

    const tokensSavedEstimate = steps.length * 350;

    return {
      id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title,
      category,
      description,
      triggerPattern,
      learnedAt: new Date().toISOString(),
      executionCount: 1,
      successRate: 100,
      tokensSavedTotal: tokensSavedEstimate,
      learnedMacro: optimizedSteps,
      isOptimized: true,
    };
  }
}
