// Client-side skill normalization and compatibility calculator for real-time reactivity

export const normalizeSkill = (skill) => {
  if (!skill) return '';
  const s = skill.toString().trim().toLowerCase();
  if (s === 'react' || s === 'react.js' || s === 'reactjs') return 'react';
  if (s === 'node' || s === 'node.js' || s === 'nodejs') return 'node.js';
  if (s === 'ts' || s === 'typescript') return 'typescript';
  if (s === 'js' || s === 'javascript') return 'javascript';
  if (s === 'next' || s === 'next.js' || s === 'nextjs') return 'next.js';
  if (s === 'k8s' || s === 'kubernetes') return 'kubernetes';
  if (s === 'mongo' || s === 'mongodb') return 'mongodb';
  if (s === 'postgres' || s === 'postgresql' || s === 'psql') return 'postgresql';
  if (s === 'tailwind' || s === 'tailwindcss' || s === 'tailwind css') return 'tailwind css';
  if (s === 'ci/cd' || s === 'cicd' || s === 'ci-cd') return 'ci/cd';
  return s;
};

export const calculateJobMatch = (userSkills = [], job) => {
  if (!job) return { score: 0, matchTier: 'Unknown', tierColor: '#6b7280' };

  const userSkillMap = new Map();
  (userSkills || []).forEach((item) => {
    if (!item) return;
    const name = typeof item === 'string' ? item : item.name;
    const proficiency = typeof item === 'object' ? item.proficiency || 'Intermediate' : 'Intermediate';
    const years = typeof item === 'object' ? item.yearsOfExperience || 1 : 1;
    if (name) {
      userSkillMap.set(normalizeSkill(name), {
        name: name.trim(),
        proficiency,
        years,
      });
    }
  });

  const requiredList = job.requiredSkills || [];
  const preferredList = job.preferredSkills || [];

  const matchedRequired = [];
  const missingRequired = [];
  const matchedPreferred = [];
  const missingPreferred = [];

  requiredList.forEach((reqSkill) => {
    const rawName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name;
    if (!rawName) return;
    const norm = normalizeSkill(rawName);

    if (userSkillMap.has(norm)) {
      matchedRequired.push({
        name: rawName,
        userProficiency: userSkillMap.get(norm).proficiency,
        status: 'Matched',
      });
    } else {
      missingRequired.push({
        name: rawName,
        status: 'Missing',
        importance: 'Required',
      });
    }
  });

  preferredList.forEach((prefSkill) => {
    const rawName = typeof prefSkill === 'string' ? prefSkill : prefSkill.name;
    if (!rawName) return;
    const norm = normalizeSkill(rawName);

    if (userSkillMap.has(norm)) {
      matchedPreferred.push({
        name: rawName,
        userProficiency: userSkillMap.get(norm).proficiency,
        status: 'Bonus Matched',
      });
    } else {
      missingPreferred.push({
        name: rawName,
        status: 'Missing',
        importance: 'Preferred',
      });
    }
  });

  let requiredRatio = requiredList.length > 0 ? matchedRequired.length / requiredList.length : 1;
  let preferredRatio = preferredList.length > 0 ? matchedPreferred.length / preferredList.length : requiredRatio;

  let calculatedScore = 0;
  if (requiredList.length === 0 && preferredList.length === 0) {
    calculatedScore = 100;
  } else if (preferredList.length === 0) {
    calculatedScore = Math.round(requiredRatio * 100);
  } else {
    calculatedScore = Math.round(requiredRatio * 80 + preferredRatio * 20);
  }

  const score = Math.max(0, Math.min(100, calculatedScore));

  let matchTier = 'Low Match';
  let tierColor = '#f43f5e'; // rose-500
  let badgeBg = 'rgba(244, 63, 94, 0.15)';
  let verdict = 'Significant skills gap. Review recommendations below.';
  let readiness = 'Low Readiness';

  if (score >= 85) {
    matchTier = 'Outstanding Match';
    tierColor = '#10b981'; // emerald-500
    badgeBg = 'rgba(16, 185, 129, 0.15)';
    verdict = 'Excellent fit! You meet or exceed nearly all requirements.';
    readiness = 'Interview Ready (Top 10%)';
  } else if (score >= 70) {
    matchTier = 'Strong Match';
    tierColor = '#06b6d4'; // cyan-500
    badgeBg = 'rgba(6, 182, 212, 0.15)';
    verdict = 'High potential! Competitive overlap on core technologies.';
    readiness = 'High Readiness';
  } else if (score >= 50) {
    matchTier = 'Moderate Match';
    tierColor = '#f59e0b'; // amber-500
    badgeBg = 'rgba(245, 158, 11, 0.15)';
    verdict = 'Good foundation with key skill gaps to bridge.';
    readiness = 'Moderate Readiness';
  }

  return {
    score,
    matchTier,
    tierColor,
    badgeBg,
    verdict,
    readiness,
    counts: {
      matchedRequired: matchedRequired.length,
      totalRequired: requiredList.length,
      matchedPreferred: matchedPreferred.length,
      totalPreferred: preferredList.length,
    },
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
  };
};
