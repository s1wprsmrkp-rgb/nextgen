import { TalentProfile, Opportunity, MatchScoreDetails } from '../types';

/**
 * Calculates a match score between a Talent Profile and an Opportunity.
 * 
 * Formula:
 * - 30% Skill match
 * - 20% Category match
 * - 15% Experience match
 * - 15% Eligibility match
 * - 10% Location compatibility
 * - 10% Interest compatibility
 */
export function calculateMatchScore(
  talent: TalentProfile,
  opportunity: Opportunity
): MatchScoreDetails {
  const reasons: string[] = [];
  const gaps: string[] = [];

  // 1. Skill Match (30 points max)
  let skillPoints = 0;
  const talentSkillNames = talent.skills.map(s => s.name.toLowerCase());
  const requiredSkills = opportunity.requiredSkills.map(s => s.toLowerCase());

  if (requiredSkills.length === 0) {
    skillPoints = 30;
    reasons.push('Broad skill acceptance');
  } else {
    let matchedCount = 0;
    const matchedSkillNames: string[] = [];

    for (const reqSkill of requiredSkills) {
      const found = talent.skills.find(s => 
        s.name.toLowerCase().includes(reqSkill) || reqSkill.includes(s.name.toLowerCase())
      );
      if (found) {
        matchedCount++;
        matchedSkillNames.push(found.name);
      }
    }

    const ratio = matchedCount / requiredSkills.length;
    skillPoints = Math.round(ratio * 30);

    if (matchedCount > 0) {
      reasons.push(`Core skills aligned (${matchedSkillNames.slice(0, 2).join(', ')})`);
    } else {
      gaps.push('Specific required skills not yet demonstrated');
    }
  }

  // 2. Category Match (20 points max)
  let categoryPoints = 0;
  if (talent.categories.includes(opportunity.category)) {
    categoryPoints = 20;
    reasons.push(`Category match in ${opportunity.category}`);
  } else {
    categoryPoints = 5; // adjacent cross-disciplinary credit
    gaps.push(`Primary field differs from ${opportunity.category}`);
  }

  // 3. Experience Match (15 points max)
  let experiencePoints = 0;
  if (opportunity.experienceLevel === 'Any') {
    experiencePoints = 15;
    reasons.push('Open to all experience levels');
  } else if (talent.experienceLevel === opportunity.experienceLevel) {
    experiencePoints = 15;
    reasons.push(`Experience level matches (${opportunity.experienceLevel})`);
  } else if (
    (talent.experienceLevel === 'Advanced' && opportunity.experienceLevel === 'Intermediate') ||
    (talent.experienceLevel === 'Intermediate' && opportunity.experienceLevel === 'Beginner')
  ) {
    experiencePoints = 14;
    reasons.push(`Meets or exceeds required experience level`);
  } else {
    experiencePoints = 6;
    gaps.push(`Requires ${opportunity.experienceLevel} level`);
  }

  // 4. Eligibility Match (15 points max)
  let eligibilityPoints = 15;
  const eligLower = opportunity.eligibility.toLowerCase();
  if (eligLower.includes('student') || eligLower.includes('open') || eligLower.includes('emerging') || eligLower.includes('all')) {
    reasons.push('Meets applicant eligibility criteria');
  } else {
    eligibilityPoints = 12;
    reasons.push('Standard eligibility requirements met');
  }

  // 5. Location Compatibility (10 points max)
  let locationPoints = 0;
  if (opportunity.remoteOnsite === 'Remote') {
    locationPoints = 10;
    reasons.push('Online / Remote participation available');
  } else if (
    opportunity.location.toLowerCase().includes(talent.location.toLowerCase()) ||
    talent.location.toLowerCase().includes(opportunity.location.toLowerCase())
  ) {
    locationPoints = 10;
    reasons.push(`Local match in ${opportunity.location}`);
  } else if (opportunity.remoteOnsite === 'Hybrid') {
    locationPoints = 7;
    reasons.push('Hybrid format with flexible attendance');
  } else {
    locationPoints = 4;
    gaps.push(`Onsite in ${opportunity.location}`);
  }

  // 6. Interest Compatibility (10 points max)
  let interestPoints = 0;
  const oppTypeLower = opportunity.type.toLowerCase();
  const matchedGoal = talent.careerGoals.find(g => 
    g.toLowerCase().includes(oppTypeLower) || oppTypeLower.includes(g.toLowerCase())
  );
  const matchedInterest = talent.interests.find(i => 
    opportunity.title.toLowerCase().includes(i.toLowerCase()) ||
    opportunity.description.toLowerCase().includes(i.toLowerCase())
  );

  if (matchedGoal || matchedInterest) {
    interestPoints = 10;
    reasons.push('Strongly matches your stated aspirations');
  } else {
    interestPoints = 7;
    reasons.push('Compatible with emerging career path');
  }

  const total = Math.min(
    99,
    Math.max(40, skillPoints + categoryPoints + experiencePoints + eligibilityPoints + locationPoints + interestPoints)
  );

  return {
    percentage: total,
    skillScore: skillPoints,
    categoryScore: categoryPoints,
    experienceScore: experiencePoints,
    eligibilityScore: eligibilityPoints,
    locationScore: locationPoints,
    interestScore: interestPoints,
    reasons: reasons.slice(0, 4),
    gaps: gaps.length > 0 ? gaps.slice(0, 2) : undefined
  };
}
