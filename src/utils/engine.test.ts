import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  KeyPoolManager, 
  WorkingMemoryBuffer, 
  CoordinateCalculator, 
  MacroCompiler 
} from './engine.ts';
import type { GeminiKeyItem, ActionStep } from '../types/agent.ts';

test('KeyPoolManager: balances requests across active keys and rotates', () => {
  const initialKeys: GeminiKeyItem[] = [
    {
      id: 'k1',
      label: 'Free Key A',
      keyMasked: 'AIza...1111',
      status: 'active',
      requestCount: 0,
      tokensUsed: 0,
      lastUsed: 0,
      latencyMs: 100,
      isSystemKey: true,
      errorCount: 0,
    },
    {
      id: 'k2',
      label: 'Free Key B',
      keyMasked: 'AIza...2222',
      status: 'active',
      requestCount: 0,
      tokensUsed: 0,
      lastUsed: 0,
      latencyMs: 80,
      isSystemKey: false,
      errorCount: 0,
    },
  ];

  const pool = new KeyPoolManager(initialKeys, 'round_robin');
  const first = pool.getActiveKey();
  const second = pool.getActiveKey();
  const third = pool.getActiveKey();

  assert.equal(first?.id, 'k1');
  assert.equal(second?.id, 'k2');
  assert.equal(third?.id, 'k1');
});

test('KeyPoolManager: automatically handles rate limits (HTTP 429) by switching keys', () => {
  const initialKeys: GeminiKeyItem[] = [
    {
      id: 'k1',
      label: 'Free Key A',
      keyMasked: 'AIza...1111',
      status: 'active',
      requestCount: 15,
      tokensUsed: 5000,
      lastUsed: Date.now(),
      latencyMs: 120,
      isSystemKey: true,
      errorCount: 0,
    },
    {
      id: 'k2',
      label: 'Free Key B',
      keyMasked: 'AIza...2222',
      status: 'active',
      requestCount: 0,
      tokensUsed: 0,
      lastUsed: 0,
      latencyMs: 90,
      isSystemKey: false,
      errorCount: 0,
    },
  ];

  const pool = new KeyPoolManager(initialKeys, 'failover_chain');
  assert.equal(pool.getActiveKey()?.id, 'k1');

  // Key 1 encounters 429
  const { nextKey } = pool.recordFailure('k1', true);
  assert.equal(nextKey?.id, 'k2');

  const updatedKeys = pool.getKeys();
  assert.equal(updatedKeys.find(k => k.id === 'k1')?.status, 'rate_limited');
  assert.equal(pool.getActiveKey()?.id, 'k2');
});

test('WorkingMemoryBuffer: updates RAM allocation and preserves context window', () => {
  const buffer = new WorkingMemoryBuffer(5);
  buffer.addMemory('user', 'Launch PUBG Mobile and monitor stats');
  buffer.addMemory('agent', 'Analyzing home screen');
  buffer.addMemory('agent', 'Launching PUBG Mobile tactical hud');

  const ram = buffer.getRAM();
  assert.equal(ram.shortTermHistory.length, 3);
  assert.ok(ram.allocatedKB >= 128);
  assert.ok(ram.activeContextTokens > 50);

  buffer.recordCacheHit();
  assert.equal(buffer.getRAM().cacheHits, 1);
});

test('CoordinateCalculator: accurately translates between pixels and normalized 0..1000 space', () => {
  const screenW = 1080;
  const screenH = 2400;

  const norm = CoordinateCalculator.normalize(540, 1200, screenW, screenH);
  assert.equal(norm.x, 500);
  assert.equal(norm.y, 500);

  const pixels = CoordinateCalculator.toPixels(500, 500, screenW, screenH);
  assert.equal(pixels.pxX, 540);
  assert.equal(pixels.pxY, 1200);

  const box = { x: 400, y: 400, width: 200, height: 200 };
  assert.equal(CoordinateCalculator.isWithinBounds({ x: 500, y: 500 }, box), true);
  assert.equal(CoordinateCalculator.isWithinBounds({ x: 100, y: 100 }, box), false);
});

test('MacroCompiler: converts action steps into an optimized zero-token procedural memory', () => {
  const steps: ActionStep[] = [
    {
      id: 'step_1',
      stepNumber: 1,
      timestamp: Date.now(),
      actionType: 'tap',
      coords: { x: 500, y: 500 },
      targetElement: 'Sheets App Icon',
      reasoning: 'Tap icon to open Excel',
      confidence: 0.98,
      status: 'completed',
    },
    {
      id: 'step_2',
      stepNumber: 2,
      timestamp: Date.now(),
      actionType: 'type_text',
      payload: 'Invoice #10492',
      targetElement: 'Cell B4',
      reasoning: 'Input invoice number into spreadsheet',
      confidence: 0.99,
      status: 'completed',
    },
  ];

  const macro = MacroCompiler.compileToMacro(
    "Mom's Data Entry Routine",
    'data_entry',
    'Automated row data entry from scanned invoices',
    'data entry|invoice|sheet',
    steps
  );

  assert.equal(macro.title, "Mom's Data Entry Routine");
  assert.equal(macro.isOptimized, true);
  assert.equal(macro.learnedMacro.length, 2);
  assert.ok(macro.tokensSavedTotal >= 500);
});
