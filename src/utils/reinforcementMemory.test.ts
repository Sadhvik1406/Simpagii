import test from 'node:test';
import assert from 'node:assert/strict';
import { ReinforcementMemoryArchitecture } from './reinforcementMemory.ts';
import type { ActionStep } from '../types/agent.ts';

test('ReinforcementMemoryArchitecture: logs user interactions and updates prior state', () => {
  const rlm = new ReinforcementMemoryArchitecture();
  const log = rlm.logUserInteraction('voice_command', 'Open PUBG and analyze stats', 5.0);

  assert.equal(log.type, 'voice_command');
  assert.equal(log.rewardModifier, 5.0);
  assert.equal(rlm.getInteractionLogs().length, 1);
});

test('ReinforcementMemoryArchitecture: updates Q-values via Bellman updates', () => {
  const rlm = new ReinforcementMemoryArchitecture();
  const stateKey = 'pubg:hostile_spotted';

  // Test action selection before update
  const initial = rlm.selectBestAction(stateKey, ['tap', 'swipe', 'wait']);
  assert.ok(initial.action);

  // Apply a high reward for quick tap action
  const updatedQ = rlm.updateQValue(stateKey, 'tap', 10.0);
  assert.ok(updatedQ >= 6.0);

  // Verify Q-value table contains entry
  const qValues = rlm.getQValues();
  const entry = qValues.find(q => q.stateKey === stateKey && q.actionType === 'tap');
  assert.ok(entry);
  assert.equal(entry.actionType, 'tap');
});

test('ReinforcementMemoryArchitecture: records task trajectory, prunes steps, and compiles policy', () => {
  const rlm = new ReinforcementMemoryArchitecture();

  const steps: ActionStep[] = [
    {
      id: 's1',
      stepNumber: 1,
      timestamp: Date.now(),
      actionType: 'tap',
      coords: { x: 500, y: 500 },
      targetElement: 'Excel Sheets App Icon',
      reasoning: 'Launch sheets app',
      confidence: 0.96,
      status: 'completed',
    },
    {
      id: 's2',
      stepNumber: 2,
      timestamp: Date.now(),
      actionType: 'wait',
      reasoning: 'Waiting for render',
      confidence: 0.8,
      status: 'completed',
    },
    {
      id: 's3',
      stepNumber: 3,
      timestamp: Date.now(),
      actionType: 'type_text',
      payload: 'Invoice #10492',
      targetElement: 'Cell B2',
      reasoning: 'Input invoice number',
      confidence: 0.99,
      status: 'completed',
    },
  ];

  const trajectory = rlm.recordTaskCompletion("Mom's Data Entry", 'data_entry', steps, true);

  assert.equal(trajectory.success, true);
  assert.ok(trajectory.cumulativeReward > 10);
  assert.ok(trajectory.policyImprovementDelta > 0);
  assert.ok(trajectory.learnedRules.length >= 1);

  // Policy library should now have the reinforced policy
  const policies = rlm.getPolicies();
  assert.ok(policies.length >= 1);
  assert.equal(policies[0].learnedMacro.length, 2); // 'wait' step pruned!
});
