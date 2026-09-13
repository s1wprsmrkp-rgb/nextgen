import { TalentProfile, AISummary, Skill } from '../types';

/**
 * AI Service for TalentBridge
 * 
 * Analyzes talent profiles, extracts verified competencies, identifies
 * strengths, and recommends targeted growth paths.
 * 
 * Note: Profile confidence indicates how much supporting information
 * and evidence is available. It is not an objective measure of human potential.
 */
export async function analyzeTalentProfile(profile: TalentProfile): Promise<{
  aiSummary: AISummary;
  profileConfidence: number;
}> {
  // Simulate AI evaluation delay
  await new Promise(resolve => setTimeout(resolve, 1800));

  const category = profile.categories[0] || 'General Creative';
  const evidenceCount = profile.evidence.length;
  const verifiedCount = profile.evidence.filter(
    e => e.verificationStatus === 'Institution verified' || e.verificationStatus === 'Mentor verified' || e.verificationStatus === 'Evidence-backed'
  ).length;

  // Calculate evidence-backed confidence
  // Base 50% for declared profile details + ~8% per evidence item up to max 95%
  let confidence = 50 + (evidenceCount * 7) + (verifiedCount * 5);
  if (profile.skills.length >= 3) confidence += 8;
  confidence = Math.min(94, Math.max(55, confidence));

  const topSkills = profile.skills.map(s => s.name);
  const primaryTitle = profile.talentTitle || (topSkills.length > 0 ? `${topSkills[0]} Practitioner` : `${category} Specialist`);

  const strengths: string[] = [];
  if (profile.skills.some(s => s.level === 'Advanced')) {
    const adv = profile.skills.filter(s => s.level === 'Advanced').map(s => s.name);
    strengths.push(`Demonstrated advanced mastery in ${adv.join(' and ')}`);
  }
  if (evidenceCount >= 3) {
    strengths.push(`Rich multi-format evidence portfolio (${evidenceCount} documented artifacts)`);
  } else if (evidenceCount > 0) {
    strengths.push(`Emerging portfolio with initial evidence anchors`);
  }
  if (verifiedCount > 0) {
    strengths.push(`Verified credentials from mentors and established institutions`);
  }
  strengths.push(`Strong alignment with competitive auditions, fellowships, and creator showcases`);

  const recommendedNextSteps: string[] = [];
  if (evidenceCount < 4) {
    if (category === 'Music') {
      recommendedNextSteps.push('Upload one studio recording or original composition to verify audio arrangement');
    } else if (category === 'Coding') {
      recommendedNextSteps.push('Link an active GitHub repository or deploy an interactive live demo');
    } else {
      recommendedNextSteps.push('Upload one original project artifact or performance video');
    }
  }
  recommendedNextSteps.push('Seek mentor endorsement on primary technical skills to elevate verification level');
  recommendedNextSteps.push('Complete application to at least 2 high-matching demo opportunities this month');

  const recommendedOpportunityTypes: string[] = [
    'Audition',
    'Competition',
    'Scholarship',
    'Collaboration',
    'Mentorship'
  ];

  const coachNote = topSkills.length >= 2 
    ? `Your strongest demonstrated areas are ${topSkills[0]} and ${topSkills[1]}. Your next recommended action is to upload one original artifact or performance to boost your evidence tier.`
    : `Your profile is taking shape nicely in ${category}. Upload your first recorded artifact or certificate to strengthen your verified standing.`;

  return {
    profileConfidence: confidence,
    aiSummary: {
      primaryTalentTitle: primaryTitle,
      structuredSkills: topSkills.length > 0 ? topSkills : ['Core Fundamentals', 'Creative Direction'],
      strengths,
      evidenceSummary: `${evidenceCount} total submissions across media, with ${verifiedCount} institutionally or mentor verified milestones.`,
      recommendedNextSteps,
      recommendedOpportunityTypes,
      coachNote,
    }
  };
}
