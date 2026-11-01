import { HazardFlag, ObstructionType, RoadType, SeverityLevel } from '../types.ts';

export interface ScoreInput {
  obstruction: ObstructionType;
  hazard: HazardFlag;
  roadType: RoadType;
}

export function calculateRuleScore(input: ScoreInput): number {
  let score = 3.0;

  // Obstruction score
  if (input.obstruction === 'complete_block') {
    score += 3.0;
  } else if (input.obstruction === 'single_lane') {
    score += 1.5;
  }

  // Hazard score
  if (input.hazard === 'live_electrical_wire') {
    score += 2.5;
  }

  // Road type priority boost
  if (input.roadType === 'Hospital Route' || input.roadType === 'Emergency Shelter') {
    score += 1.5;
  } else if (input.roadType === 'Major Artery' || input.roadType === 'Industrial Lifeline') {
    score += 1.2;
  } else if (input.roadType === 'Transit Route') {
    score += 0.5;
  }

  // Cap at 10.0 and round to one decimal
  const finalScore = Math.min(10.0, Math.max(1.0, score));
  return Math.round(finalScore * 10) / 10;
}

export function getSeverity(score: number): SeverityLevel {
  if (score >= 9.0) return 'Critical';
  if (score >= 7.0) return 'High';
  if (score >= 4.0) return 'Medium';
  return 'Low';
}

export function getSeverityColors(severity: SeverityLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  pillBg: string;
} {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-[#FDECEA]',
        text: 'text-[#D32F2F]',
        border: 'border-[#D32F2F]',
        dot: 'bg-[#D32F2F]',
        pillBg: 'bg-[#D32F2F]/10',
      };
    case 'High':
      return {
        bg: 'bg-[#FFF3E0]',
        text: 'text-[#EF6C00]',
        border: 'border-[#EF6C00]',
        dot: 'bg-[#EF6C00]',
        pillBg: 'bg-[#EF6C00]/10',
      };
    case 'Medium':
      return {
        bg: 'bg-[#FFF4DB]',
        text: 'text-[#B78103]',
        border: 'border-[#F2A900]',
        dot: 'bg-[#F2A900]',
        pillBg: 'bg-[#F2A900]/15',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-[#E8F5EC]',
        text: 'text-[#16834A]',
        border: 'border-[#16834A]',
        dot: 'bg-[#16834A]',
        pillBg: 'bg-[#16834A]/10',
      };
  }
}

export function getRecommendedEquipment(obstruction: ObstructionType, hazard: HazardFlag): string {
  if (hazard === 'live_electrical_wire' && obstruction === 'complete_block') {
    return 'PWD Heavy Unit + State Electricity Board Team';
  }
  if (hazard === 'live_electrical_wire') {
    return 'State Electricity Board Team + Wire Isolator';
  }
  if (obstruction === 'complete_block') {
    return 'PWD Heavy Unit + Industrial Tree Cutter';
  }
  if (obstruction === 'single_lane') {
    return 'Municipal Clearance Squad + Chainsaws';
  }
  return 'Municipal Inspection Squad';
}

// Haversine formula to compute distance in km
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}
