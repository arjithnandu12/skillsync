import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { jobsApi } from "../../services/api.js";
import { calculateJobMatch } from "../../utils/compatibilityHelper.js";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBookOpen,
  FaExternalLinkAlt,
  FaLightbulb,
  FaClock,
  FaPlus,
  FaCheck,
  FaBriefcase,
  FaMapMarkerAlt,
  FaBuilding,
  FaDollarSign,
  FaLayerGroup,
  FaAward,
  FaMagic,
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { skills, addSkill } = useContext(AuthContext);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendAnalysis, setBackendAnalysis] = useState(null);
  const [addingSkillName, setAddingSkillName] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch job details and server compatibility analysis
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const jobData = await jobsApi.getJobById(id);
        setJob(jobData);

        // Fetch backend suggestions & analysis
        try {
          const compat = await jobsApi.checkCompatibility(id, skills);
          setBackendAnalysis(compat);
        } catch (e) {
          console.warn("Backend compatibility fetch fallback to client:", e);
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, skills]);

  // Client-side real-time match calculation
  const match = calculateJobMatch(skills, job);

  // Handle quick-adding a missing skill directly to user profile
  const handleQuickAddSkill = async (skillName) => {
    setAddingSkillName(skillName);
    try {
      await addSkill({
        name: skillName,
        proficiency: "Intermediate",
        yearsOfExperience: 1,
        category: "Other",
      });
      setToastMessage(`Added "${skillName}" to your skills! Score updated.`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      setToastMessage(err.message || "Failed to add skill");
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setAddingSkillName(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Analyzing skills compatibility...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-500/30 text-center space-y-4">
          <FaExclamationTriangle className="text-4xl text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Job Not Found</h2>
          <p className="text-sm text-slate-400">{error || "The requested job posting could not be found."}</p>
          <button
            onClick={() => navigate("/jobs")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer"
          >
            ← Back to Job Explorer
          </button>
        </div>
      </div>
    );
  }

  // Use suggestions from backend analysis if available, otherwise construct from missing skills
  const suggestions = backendAnalysis?.suggestions || [];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-5">
            <FaCheckCircle className="text-base" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back navigation & Quick meta */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold cursor-pointer"
          >
            <FaArrowLeft />
            <span>Back to Explorer</span>
          </button>

          <span className="text-xs text-slate-500">
            Job ID: {job._id?.slice(-8)}
          </span>
        </div>

        {/* Hero Section: Job Overview Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
              <img
                src={job.logo || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&h=120&fit=crop"}
                alt={job.company}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 bg-slate-800 p-1 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {job.title}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {job.category || "Fullstack"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-xs text-slate-300 font-medium">
                  <span className="flex items-center space-x-1.5 text-slate-200 font-bold">
                    <FaBuilding className="text-slate-400" />
                    <span>{job.company}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <FaMapMarkerAlt className="text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <FaBriefcase className="text-slate-400" />
                    <span>{job.jobType}</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <FaDollarSign className="text-emerald-400" />
                    <span>{job.salaryDisplay || (job.salary ? `$${job.salary.toLocaleString()}` : "Competitive")}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Match Ribbon */}
            <div className="flex items-center space-x-4 bg-slate-900/80 px-6 py-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Your Match Score
                </p>
                <p className="text-xs font-semibold" style={{ color: match.tierColor }}>
                  {match.matchTier}
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner border"
                style={{
                  backgroundColor: match.badgeBg,
                  borderColor: `${match.tierColor}60`,
                  color: match.tierColor,
                }}
              >
                {match.score}%
              </div>
            </div>
          </div>
        </div>

        {/* MAIN COMPATIBILITY ANALYSIS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Compatibility Breakdown & Readiness Card */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Compatibility Scorecard */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <FaAward className="text-cyan-400" />
                  <span>Skills Compatibility</span>
                </h2>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-bold"
                  style={{ backgroundColor: match.badgeBg, color: match.tierColor }}
                >
                  {match.score}% Match
                </span>
              </div>

              {/* Visual Progress Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Candidate Match Strength</span>
                  <span style={{ color: match.tierColor }}>{match.matchTier}</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${match.score}%`,
                      backgroundColor: match.tierColor,
                    }}
                  ></div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-center">
                  <p className="text-2xl font-black text-emerald-400">
                    {match.matchedRequired.length} / {job.requiredSkills?.length || 0}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    Req. Skills Met
                  </p>
                </div>

                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-center">
                  <p className="text-2xl font-black text-rose-400">
                    {match.missingRequired.length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                    Skill Gaps
                  </p>
                </div>
              </div>

              {/* AI Strategic Verdict */}
              <div className="bg-indigo-950/30 p-4 rounded-2xl border border-indigo-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <FaMagic className="text-cyan-400" />
                  <span>AI Compatibility Assessment</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {backendAnalysis?.summaryAdvice || match.verdict}
                </p>
                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-indigo-900/40">
                  <span>Readiness:</span>
                  <span className="font-bold text-slate-200">{match.readiness}</span>
                </div>
              </div>

              {/* Action Link to Customize Skills */}
              <RouterLink
                to="/profile"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center block bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
              >
                ⚙ Manage & Add My Skills ({skills.length} stored)
              </RouterLink>
            </div>

            {/* Matched Skills Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FaCheckCircle className="text-emerald-400 text-sm" />
                <span>Matched Skills ({match.matchedRequired.length + match.matchedPreferred.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Skills in your profile that directly satisfy job requirements.
              </p>

              <div className="space-y-2">
                {match.matchedRequired.length > 0 ? (
                  match.matchedRequired.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium"
                    >
                      <div className="flex items-center space-x-2">
                        <FaCheck className="text-emerald-400 text-[10px]" />
                        <span className="font-bold text-emerald-300">{item.name}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {item.userProficiency || "Proficient"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    None of the required skills match your current profile yet.
                  </p>
                )}

                {match.matchedPreferred.map((item, idx) => (
                  <div
                    key={`pref-${idx}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <FaCheck className="text-cyan-400 text-[10px]" />
                      <span className="font-bold text-cyan-300">{item.name} (Bonus)</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Bonus Match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tailored Suggestions, Missing Skills Roadmap & Job Description */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Actionable Learning Suggestions & Roadmap */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2.5">
                    <FaLightbulb className="text-amber-400" />
                    <span>Missing Skills & Tailored Learning Roadmap</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recommended learning pathways and practice projects to close the gap for this role.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 self-start sm:self-auto">
                  {match.missingRequired.length} Gaps Identified
                </span>
              </div>

              {match.missingRequired.length === 0 ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <FaCheckCircle className="text-3xl text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Full Requirements Met!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    You possess every single required skill for this role. You are an exceptional fit for the technical requirements!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 rounded-lg text-sm font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              {sug.skill}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center space-x-1">
                              <FaClock className="text-slate-500 text-[11px]" />
                              <span>Est. Time: {sug.estimatedTime || "1-2 weeks"}</span>
                            </span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {sug.difficulty || "Intermediate"}
                            </span>
                          </div>

                          {/* Quick Add Button to Profile */}
                          <button
                            onClick={() => handleQuickAddSkill(sug.skill)}
                            disabled={addingSkillName === sug.skill}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer self-start sm:self-auto disabled:opacity-50"
                            title="If you already know this skill, click to add it directly to your profile"
                          >
                            <FaPlus className="text-[10px]" />
                            <span>
                              {addingSkillName === sug.skill ? "Adding..." : "I Know This Skill (+Add)"}
                            </span>
                          </button>
                        </div>

                        {/* Topics to master */}
                        {sug.keyTopics && sug.keyTopics.length > 0 && (
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              Core Topics to Study:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {sug.keyTopics.map((topic, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/50 p-2 rounded-lg"
                                >
                                  <span className="text-cyan-400 font-bold">•</span>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Practical Project Recommendation */}
                        {sug.practicalTip && (
                          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-300 flex items-start space-x-2.5">
                            <FaMagic className="text-indigo-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-indigo-300">Portfolio Proof Tip: </span>
                              <span>{sug.practicalTip}</span>
                            </div>
                          </div>
                        )}

                        {/* Recommended Curated Learning Resources */}
                        {sug.resources && sug.resources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center space-x-1">
                              <FaBookOpen className="text-slate-500" />
                              <span>Learning Guides:</span>
                            </span>
                            {sug.resources.map((res, rIdx) => (
                              <a
                                key={rIdx}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                              >
                                <span>{res.title}</span>
                                <FaExternalLinkAlt className="text-[9px] text-slate-400" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    // Fallback when suggestions list is empty
                    match.missingRequired.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                      >
                        <span className="text-sm font-bold text-rose-300">{m.name}</span>
                        <button
                          onClick={() => handleQuickAddSkill(m.name)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 cursor-pointer"
                        >
                          ＋ Add to My Skills
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Complete Job Description & Responsibilities */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-2">Job Description</h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-white mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preferred Skills */}
              {job.preferredSkills && job.preferredSkills.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-white mb-3">Preferred / Bonus Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((pref, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits & Perks */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-white mb-3">Benefits & Perks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {job.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 flex items-center space-x-2"
                      >
                        <span className="text-emerald-400">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDetails;
