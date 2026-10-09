const {
  normalizeSkillName,
  getSuggestionForSkill,
} = require("./skillSuggestions");

/**
 * Calculates detailed skills compatibility between a user's skills and a job's requirements
 * 
 * @param {Array<string|object>} userSkills - User's skill list
 * @param {Object} job - Job object containing requiredSkills, preferredSkills, title, etc.
 * @returns {Object} compatibility analysis
 */
const calculateCompatibility = (userSkills = [], job) => {
  // Normalize user skills list into a Map of normalizedName -> { originalName, proficiency, years }
  const userSkillMap = new Map();
  (userSkills || []).forEach((item) => {
    if (!item) return;
    const name = typeof item === "string" ? item : item.name;
    const proficiency = typeof item === "object" ? item.proficiency || "Intermediate" : "Intermediate";
    const years = typeof item === "object" ? item.yearsOfExperience || 1 : 1;
    if (name) {
      userSkillMap.set(normalizeSkillName(name), {
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

  // Evaluate Required Skills
  requiredList.forEach((reqSkill) => {
    const rawName = typeof reqSkill === "string" ? reqSkill : reqSkill.name;
    if (!rawName) return;
    const norm = normalizeSkillName(rawName);

    if (userSkillMap.has(norm)) {
      const userItem = userSkillMap.get(norm);
      matchedRequired.push({
        name: rawName,
        userProficiency: userItem.proficiency,
        status: "Matched",
      });
    } else {
      missingRequired.push({
        name: rawName,
        status: "Missing",
        importance: "Required",
      });
    }
  });

  // Evaluate Preferred Skills
  preferredList.forEach((prefSkill) => {
    const rawName = typeof prefSkill === "string" ? prefSkill : prefSkill.name;
    if (!rawName) return;
    const norm = normalizeSkillName(rawName);

    if (userSkillMap.has(norm)) {
      const userItem = userSkillMap.get(norm);
      matchedPreferred.push({
        name: rawName,
        userProficiency: userItem.proficiency,
        status: "Bonus Matched",
      });
    } else {
      missingPreferred.push({
        name: rawName,
        status: "Missing",
        importance: "Preferred",
      });
    }
  });

  // Scoring weights:
  // Required skills are 80% of score, preferred are 20%.
  // If no required skills specified, base 100%.
  let requiredRatio = 1;
  if (requiredList.length > 0) {
    requiredRatio = matchedRequired.length / requiredList.length;
  }

  let preferredRatio = 0;
  if (preferredList.length > 0) {
    preferredRatio = matchedPreferred.length / preferredList.length;
  } else {
    // If no preferred skills defined, distribute weight back to required
    preferredRatio = requiredRatio;
  }

  let calculatedScore = 0;
  if (requiredList.length === 0 && preferredList.length === 0) {
    calculatedScore = 100;
  } else if (preferredList.length === 0) {
    calculatedScore = Math.round(requiredRatio * 100);
  } else {
    calculatedScore = Math.round((requiredRatio * 80) + (preferredRatio * 20));
  }

  // Ensure score is between 0 and 100
  const score = Math.max(0, Math.min(100, calculatedScore));

  // Determine Match Tier & Summary
  let matchTier = "Low Match";
  let tierColor = "#ef4444"; // red
  let verdict = "Needs significant upskilling before applying";
  let interviewReadiness = "Low";

  if (score >= 85) {
    matchTier = "Outstanding Match";
    tierColor = "#10b981"; // emerald
    verdict = "Excellent fit! You exceed or meet nearly all requirements.";
    interviewReadiness = "High (Ready for Technical Rounds)";
  } else if (score >= 70) {
    matchTier = "Strong Match";
    tierColor = "#06b6d4"; // cyan
    verdict = "Very competitive profile with strong overlap on core competencies.";
    interviewReadiness = "Moderate to High";
  } else if (score >= 50) {
    matchTier = "Moderate Match";
    tierColor = "#f59e0b"; // amber
    verdict = "Good foundational match, but notable core skill gaps remain.";
    interviewReadiness = "Moderate (Bridge key gaps first)";
  } else {
    matchTier = "Skill Gap Detected";
    tierColor = "#f43f5e"; // rose
    verdict = "Major skills gap for this role. Follow the tailored learning paths below.";
    interviewReadiness = "Upskilling Recommended";
  }

  // Generate learning suggestions for all missing required skills + top missing preferred skills
  const suggestions = [
    ...missingRequired.map((m) => getSuggestionForSkill(m.name)),
    ...missingPreferred.slice(0, 2).map((m) => getSuggestionForSkill(m.name)),
  ];

  return {
    score,
    matchTier,
    tierColor,
    verdict,
    interviewReadiness,
    counts: {
      matchedRequired: matchedRequired.length,
      totalRequired: requiredList.length,
      matchedPreferred: matchedPreferred.length,
      totalPreferred: preferredList.length,
      totalUserSkills: userSkillMap.size,
    },
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
    suggestions,
    summaryAdvice: generateSummaryAdvice(score, missingRequired, matchedRequired, job.title),
  };
};

function generateSummaryAdvice(score, missingRequired, matchedRequired, jobTitle) {
  if (score >= 85) {
    return `You are in the top tier for this ${jobTitle} position. Highlight your experience in ${matchedRequired.map(s => s.name).slice(0, 3).join(", ")} prominently in your resume bullets and portfolio.`;
  }
  if (score >= 70) {
    const missingNames = missingRequired.map(s => s.name).join(", ");
    return `Strong potential! Closing the gap on ${missingNames || "the remaining tools"} will make you an irresistible applicant. Consider highlighting transferable skills.`;
  }
  if (score >= 50) {
    const missingNames = missingRequired.slice(0, 3).map(s => s.name).join(", ");
    return `Focus your prep on ${missingNames || "core competencies"}. Building a focused proof-of-concept project demonstrating these technologies will significantly improve your match rate.`;
  }
  return `This role requires core tech stacks that aren't yet in your profile. Review the step-by-step roadmap and learning resources provided below to ramp up efficiently.`;
}

module.exports = {
  calculateCompatibility,
};
