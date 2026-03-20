// ============================================================
// Schemes Engine — Eligibility matching & benefit calculation
// ============================================================

import { type Scheme, type UserProfile, type EligibilityResult } from "./schemes-data";

/**
 * Calculate a relevance score (0-100) for a scheme given a user profile.
 */
function calculateRelevance(scheme: Scheme, profile: UserProfile): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // ── State match ──
  const stateMatch =
    scheme.eligibility.states.length === 0 ||
    scheme.eligibility.states.includes(profile.state);

  if (!stateMatch) {
    return { score: 0, reasons: ["Not available in your state"] };
  }

  if (scheme.eligibility.states.length === 0) {
    score += 20;
    reasons.push("Available across all of India");
  } else {
    score += 30;
    reasons.push(`Available in ${profile.state}`);
  }

  // ── Crop match ──
  const cropMatch =
    scheme.eligibility.crops.length === 0 ||
    scheme.eligibility.crops.includes(profile.cropType);

  if (!cropMatch) {
    return { score: 0, reasons: ["Your crop type is not covered"] };
  }

  if (scheme.eligibility.crops.length > 0) {
    score += 25;
    reasons.push(`Covers ${profile.cropType} crops`);
  } else {
    score += 15;
    reasons.push("Covers all crop types");
  }

  // ── Land size match ──
  const landMatch =
    profile.landSizeAcres >= scheme.eligibility.minLandAcres &&
    profile.landSizeAcres <= scheme.eligibility.maxLandAcres;

  if (!landMatch) {
    return { score: 0, reasons: ["Your land size doesn't qualify"] };
  }

  score += 20;
  reasons.push("Your land size qualifies");

  // ── Impact bonus ──
  if (scheme.impactLevel === "HIGH") {
    score += 20;
    reasons.push("High financial impact");
  } else if (scheme.impactLevel === "MEDIUM") {
    score += 10;
    reasons.push("Moderate financial impact");
  } else {
    score += 5;
  }

  // ── Urgency bonus (Closing Soon) ──
  if (scheme.status === "Closing Soon") {
    score += 10;
    reasons.push("⏰ Closing soon — apply quickly!");
  }

  return { score: Math.min(score, 100), reasons };
}

/**
 * Get eligible schemes for a user profile, sorted by relevance.
 * Returns top N schemes (default 5).
 */
export function getEligibleSchemes(
  profile: UserProfile,
  allSchemes: Scheme[],
  maxResults: number = 5
): EligibilityResult[] {
  const results: EligibilityResult[] = [];

  for (const scheme of allSchemes) {
    const { score, reasons } = calculateRelevance(scheme, profile);
    if (score > 0) {
      results.push({ scheme, relevanceScore: score, matchReasons: reasons });
    }
  }

  // Sort by relevance score descending, then by impact level
  results.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    const impactOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return impactOrder[b.scheme.impactLevel] - impactOrder[a.scheme.impactLevel];
  });

  return results.slice(0, maxResults);
}

/**
 * Calculate total potential benefit (₹/year) from eligible schemes.
 */
export function calculateTotalBenefit(results: EligibilityResult[]): number {
  return results.reduce((sum, r) => sum + r.scheme.benefitAmount, 0);
}

/**
 * Get a breakdown of benefits per scheme.
 */
export function getBenefitBreakdown(results: EligibilityResult[]): {
  schemeName: string;
  amount: number;
  label: string;
  type: string;
}[] {
  return results.map((r) => ({
    schemeName: r.scheme.shortName,
    amount: r.scheme.benefitAmount,
    label: r.scheme.benefitLabel,
    type: r.scheme.benefitType,
  }));
}
