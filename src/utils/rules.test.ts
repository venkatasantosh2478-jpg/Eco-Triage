import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRuleScore,
  getSeverity,
  calculateDistance,
  getModeBannerVisibility,
  toggleHeroSaluteState,
} from './rules.ts';
import {
  DEFAULT_MODE_FEATURES,
  DEFAULT_MODE_ASSETS,
  DEFAULT_MODE_CONTENT,
  canUserSwitchMode,
  resolveEffectiveMode,
  isModeFeatureEnabled,
  getModeAssetForSlot,
  getModeAssetAlt,
  getModeContentText,
  getStatusLabelForMode,
} from './modeConfig.ts';
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

test('adds +0.5 in Emergency mode on Hospital Route and Emergency Shelter, capped at 10.0 (Section 14.4)', () => {
  const dailyHospitalScore = calculateRuleScore(
    {
      obstruction: 'single_lane',
      hazard: 'none',
      roadType: 'Hospital Route',
    },
    'daily'
  );
  // 3.0 + 1.5 (single_lane) + 0 + 1.5 (hospital) = 6.0
  assert.equal(dailyHospitalScore, 6.0);

  const emergencyHospitalScore = calculateRuleScore(
    {
      obstruction: 'single_lane',
      hazard: 'none',
      roadType: 'Hospital Route',
    },
    'emergency'
  );
  // 6.0 + 0.5 emergency boost = 6.5
  assert.equal(emergencyHospitalScore, 6.5);

  const emergencyShelterCapped = calculateRuleScore(
    {
      obstruction: 'complete_block',
      hazard: 'live_electrical_wire',
      roadType: 'Emergency Shelter',
    },
    'emergency'
  );
  assert.equal(emergencyShelterCapped, 10.0);
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

test('calculates distance correctly between two Visakhapatnam points', () => {
  // Maddilapalem (17.7385, 83.3150) and RK Beach (17.7120, 83.3230)
  const dist = calculateDistance(17.7385, 83.3150, 17.7120, 83.3230);
  assert.ok(dist > 2 && dist < 5); // approx 3.1 km
});

test('Section 14.2: only Admin can switch or manage mode, while officers see mode bar in daily mode', () => {
  const publicDaily = getModeBannerVisibility('public', 'daily');
  assert.equal(publicDaily.showOfficerModeBar, false);
  assert.equal(publicDaily.showEmergencyAlertBanner, false);
  assert.equal(publicDaily.canManageMode, false);

  const publicEmergency = getModeBannerVisibility('public', 'emergency');
  assert.equal(publicEmergency.showOfficerModeBar, false);
  assert.equal(publicEmergency.showEmergencyAlertBanner, true);
  assert.equal(publicEmergency.canManageMode, false);

  const officerDaily = getModeBannerVisibility('field', 'daily');
  assert.equal(officerDaily.showOfficerModeBar, true);
  assert.equal(officerDaily.showEmergencyAlertBanner, false);
  assert.equal(officerDaily.canManageMode, false);

  const commandDaily = getModeBannerVisibility('command', 'daily');
  assert.equal(commandDaily.canManageMode, false);

  const adminDaily = getModeBannerVisibility('admin', 'daily');
  assert.equal(adminDaily.showOfficerModeBar, true);
  assert.equal(adminDaily.canManageMode, true);

  assert.equal(canUserSwitchMode('admin'), true);
  assert.equal(canUserSwitchMode('command'), false);
  assert.equal(canUserSwitchMode('field'), false);
  assert.equal(canUserSwitchMode('viewer'), false);
  assert.equal(canUserSwitchMode('public'), false);
});

test('Section 14.7 & 14.4: resolves Preview-As mode for Admin only and evaluates feature flags per mode', () => {
  assert.equal(resolveEffectiveMode('daily', 'emergency', 'admin'), 'emergency');
  assert.equal(resolveEffectiveMode('daily', 'emergency', 'command'), 'daily');
  assert.equal(resolveEffectiveMode('daily', null, 'admin'), 'daily');

  // Red emergency strip is OFF in Daily and ON in Emergency
  assert.equal(isModeFeatureEnabled(DEFAULT_MODE_FEATURES, 'daily', 'red_emergency_strip'), false);
  assert.equal(isModeFeatureEnabled(DEFAULT_MODE_FEATURES, 'emergency', 'red_emergency_strip'), true);

  // Weather widget is ON in Daily and OFF in Emergency
  assert.equal(isModeFeatureEnabled(DEFAULT_MODE_FEATURES, 'daily', 'weather_widget'), true);
  assert.equal(isModeFeatureEnabled(DEFAULT_MODE_FEATURES, 'emergency', 'weather_widget'), false);
});

test('Section 14.5 & 14.6: resolves mode image slots, trilingual alt text, trilingual content, and status labels', () => {
  const dailyHero = getModeAssetForSlot(DEFAULT_MODE_ASSETS, 'daily', 'home_hero');
  const emergencyHero = getModeAssetForSlot(DEFAULT_MODE_ASSETS, 'emergency', 'home_hero');
  assert.ok(dailyHero && emergencyHero);
  assert.notEqual(dailyHero.image_url_desktop, emergencyHero.image_url_desktop);
  assert.ok(getModeAssetAlt(dailyHero, 'te').length > 0);
  assert.ok(getModeAssetAlt(emergencyHero, 'hi').length > 0);

  const dailyHeadlineEn = getModeContentText(DEFAULT_MODE_CONTENT, 'daily', 'hero_headline', 'en');
  const emergencyHeadlineEn = getModeContentText(DEFAULT_MODE_CONTENT, 'emergency', 'hero_headline', 'en');
  assert.equal(dailyHeadlineEn, 'Safer roads, every day.');
  assert.equal(emergencyHeadlineEn, 'Help reaches blocked roads faster.');

  // Status labels differ by mode
  assert.equal(getStatusLabelForMode('Pending', 'daily', 'en'), 'Open');
  assert.equal(getStatusLabelForMode('Pending', 'emergency', 'en'), 'Pending');
  assert.equal(getStatusLabelForMode('Assigned', 'daily', 'en'), 'Scheduled');
  assert.equal(getStatusLabelForMode('Assigned', 'emergency', 'en'), 'On the way');
  assert.equal(getStatusLabelForMode('In Progress', 'emergency', 'en'), 'Working');
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
