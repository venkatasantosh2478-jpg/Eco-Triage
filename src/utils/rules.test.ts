import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRuleScore,
  getSeverity,
  calculateDistance,
  getModeBannerVisibility,
  toggleHeroSaluteState,
} from './rules.ts';
import { t } from './translations.ts';

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

test('daily mode bar is visible only to officers while emergency banner notifies public and officers', () => {
  const publicDaily = getModeBannerVisibility('public', 'daily');
  assert.equal(publicDaily.showOfficerModeBar, false);
  assert.equal(publicDaily.showEmergencyAlertBanner, false);

  const publicEmergency = getModeBannerVisibility('public', 'emergency');
  assert.equal(publicEmergency.showOfficerModeBar, false);
  assert.equal(publicEmergency.showEmergencyAlertBanner, true);

  const officerDaily = getModeBannerVisibility('field', 'daily');
  assert.equal(officerDaily.showOfficerModeBar, true);
  assert.equal(officerDaily.showEmergencyAlertBanner, false);
  assert.equal(officerDaily.canManageMode, true);
});

test('allows liking multiple heroes independently on their cards', () => {
  const initialHeroes = [
    { id: 'hero_1', name: 'K. Appa Rao', thankCount: 428 },
    { id: 'hero_2', name: 'S. Nageswara Rao', thankCount: 389 },
    { id: 'hero_3', name: 'Dr. P. Sirisha', thankCount: 512 },
  ];

  // Like hero_1 (top hero)
  const step1 = toggleHeroSaluteState(initialHeroes, [], 'hero_1');
  assert.deepEqual(step1.updatedLikedIds, ['hero_1']);
  assert.equal(step1.updatedHeroes[0].thankCount, 429);

  // Like hero_2 (second card in grid)
  const step2 = toggleHeroSaluteState(step1.updatedHeroes, step1.updatedLikedIds, 'hero_2');
  assert.deepEqual(step2.updatedLikedIds, ['hero_1', 'hero_2']);
  assert.equal(step2.updatedHeroes[0].thankCount, 429);
  assert.equal(step2.updatedHeroes[1].thankCount, 390);

  // Like hero_3 (third card in grid)
  const step3 = toggleHeroSaluteState(step2.updatedHeroes, step2.updatedLikedIds, 'hero_3');
  assert.deepEqual(step3.updatedLikedIds, ['hero_1', 'hero_2', 'hero_3']);
  assert.equal(step3.updatedHeroes[2].thankCount, 513);

  // Unlike hero_2
  const step4 = toggleHeroSaluteState(step3.updatedHeroes, step3.updatedLikedIds, 'hero_2');
  assert.deepEqual(step4.updatedLikedIds, ['hero_1', 'hero_3']);
  assert.equal(step4.updatedHeroes[1].thankCount, 389);
});

test('translates UI strings across English, Telugu, and Hindi', () => {
  assert.equal(t('ourHeroes', 'en'), 'Our Heroes');
  assert.equal(t('ourHeroes', 'te'), 'మన హీరోలు');
  assert.equal(t('ourHeroes', 'hi'), 'हमारे नायक');
  assert.equal(t('cardReliefTitle', 'te'), 'సమీప పునరావాస శిబిరాలు');
  assert.equal(t('cardReliefTitle', 'hi'), 'नज़दीकी राहत शिविर');
});

