import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRuleScore, getSeverity, calculateDistance } from './rules.ts';

test('calculates score correctly for critical live wire + complete block on hospital route', () => {
  const score = calculateRuleScore({
    obstruction: 'complete_block',
    hazard: 'live_electrical_wire',
    roadType: 'Hospital Route',
  });
  // 3.0 + 3.0 (block) + 2.5 (wire) + 1.5 (hospital) = 10.0
  assert.equal(score, 10.0);
  assert.equal(getSeverity(score), 'Critical');
});

test('calculates score correctly for low severity residential single lane', () => {
  const score = calculateRuleScore({
    obstruction: 'single_lane',
    hazard: 'none',
    roadType: 'Residential',
  });
  // 3.0 + 1.5 + 0 + 0 = 4.5
  assert.equal(score, 4.5);
  assert.equal(getSeverity(score), 'Medium');
});

test('caps score at 10.0', () => {
  const score = calculateRuleScore({
    obstruction: 'complete_block',
    hazard: 'live_electrical_wire',
    roadType: 'Emergency Shelter',
  });
  assert.ok(score <= 10.0);
});

test('calculates distance correctly between two Visakhapatnam points', () => {
  // Maddilapalem (17.7385, 83.3150) and RK Beach (17.7120, 83.3230)
  const dist = calculateDistance(17.7385, 83.3150, 17.7120, 83.3230);
  assert.ok(dist > 2 && dist < 5); // approx 3.1 km
});
