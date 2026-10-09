import React, { useState, useEffect, useContext, useMemo } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { jobsApi } from "../../services/api.js";
import { calculateJobMatch } from "../../utils/compatibilityHelper.js";
import {
  FaSlidersH,
  FaBolt,
  FaCheck,
  FaPlus,
  FaArrowRight,
  FaMagic,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";

const SIMULATION_SUGGESTIONS = [
  "Docker",
  "Kubernetes",
  "AWS",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "Tailwind CSS",
  "CI/CD",
];

const Simulator = () => {
  const { skills, addSkill } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [simulatedAddedSkills, setSimulatedAddedSkills] = useState([]);
  const [customSimSkill, setCustomSimSkill] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await jobsApi.getJobs({ limit: 50 });
        setJobs(data.data || []);
        if (data.data?.length > 0) {
          setSelectedJobId(data.data[0]._id);
        }
      } catch (err) {
        console.error("Error loading jobs for simulator:", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j._id === selectedJobId) || jobs[0] || null;
  }, [jobs, selectedJobId]);

  // Baseline match score (with actual candidate skills)
  const baselineMatch = useMemo(() => {
    if (!selectedJob) return { score: 0, matchedRequired: [], missingRequired: [] };
    return calculateJobMatch(skills, selectedJob);
  }, [skills, selectedJob]);

  // Combined simulated skills (actual + simulated)
  const simulatedSkillsList = useMemo(() => {
    const simSet = new Set(skills.map((s) => s.name.toLowerCase()));
    const extras = simulatedAddedSkills
      .filter((s) => !simSet.has(s.toLowerCase()))
      .map((name) => ({ name, proficiency: "Advanced", yearsOfExperience: 1 }));
    return [...skills, ...extras];
  }, [skills, simulatedAddedSkills]);

  // Simulated match score
  const simulatedMatch = useMemo(() => {
    if (!selectedJob) return { score: 0, matchedRequired: [], missingRequired: [] };
    return calculateJobMatch(simulatedSkillsList, selectedJob);
  }, [simulatedSkillsList, selectedJob]);

  // Score delta
  const scoreDelta = simulatedMatch.score - baselineMatch.score;

  // Toggle simulated skill
  const toggleSimSkill = (skillName) => {
    if (simulatedAddedSkills.includes(skillName)) {
      setSimulatedAddedSkills(simulatedAddedSkills.filter((s) => s !== skillName));
    } else {
      setSimulatedAddedSkills([...simulatedAddedSkills, skillName]);
    }
  };

  const handleAddCustomSimSkill = (e) => {
    e.preventDefault();
    if (!customSimSkill.trim()) return;
    if (!simulatedAddedSkills.includes(customSimSkill.trim())) {
      setSimulatedAddedSkills([...simulatedAddedSkills, customSimSkill.trim()]);
    }
    setCustomSimSkill("");
  };

  // Permanently commit simulated skills to user profile
  const handleCommitToProfile = async () => {
    try {
      for (const skillName of simulatedAddedSkills) {
        const exists = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
        if (!exists) {
          await addSkill({
            name: skillName,
            proficiency: "Intermediate",
            yearsOfExperience: 1,
            category: "Other",
          });
        }
      }
      setSimulatedAddedSkills([]);
      alert("Successfully added simulated skills to your permanent profile!");
    } catch (err) {
      alert("Error committing skills: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HERO */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>

          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FaSlidersH />
              <span>Upskilling Sandbox</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Compatibility Match Simulator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Simulate the impact of learning new technologies before investing study time. Select a target job role, toggle new skills, and watch your compatibility score increase in real time.
            </p>
          </div>
        </div>

        {/* SELECT TARGET ROLE */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FaBriefcase className="text-indigo-400 text-sm" />
              <span>Target Role Selection</span>
            </h2>
            <span className="text-xs text-slate-400">
              Pick any of the 12 active positions to test
            </span>
          </div>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j._id} value={j._id} className="bg-slate-900 py-2">
                {j.title} at {j.company} — Req: [{j.requiredSkills?.join(", ")}]
              </option>
            ))}
          </select>
        </div>

        {/* COMPARISON METERS (BEFORE VS AFTER) */}
        {selectedJob && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CURRENT BASELINE */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Match (Baseline)
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {skills.length} existing skills
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border"
                  style={{
                    backgroundColor: baselineMatch.badgeBg,
                    borderColor: `${baselineMatch.tierColor}60`,
                    color: baselineMatch.tierColor,
                  }}
                >
                  {baselineMatch.score}%
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{baselineMatch.matchTier}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Matches {baselineMatch.matchedRequired?.length} of {selectedJob.requiredSkills?.length || 0} core requirements.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Missing from Target Role:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {baselineMatch.missingRequired?.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleSimSkill(m.name)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer flex items-center space-x-1"
                    >
                      <FaPlus className="text-[9px]" />
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SIMULATED IMPACT */}
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 bg-indigo-950/20 space-y-4 glow-indigo">
              <div className="flex justify-between items-center border-b border-indigo-900/40 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Simulated Upskill Match
                </span>
                {scoreDelta > 0 && (
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    +{scoreDelta}% Jump!
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border shadow-lg"
                  style={{
                    backgroundColor: simulatedMatch.badgeBg,
                    borderColor: `${simulatedMatch.tierColor}60`,
                    color: simulatedMatch.tierColor,
                  }}
                >
                  {simulatedMatch.score}%
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{simulatedMatch.matchTier}</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Matches {simulatedMatch.matchedRequired?.length} of {selectedJob.requiredSkills?.length || 0} core requirements!
                  </p>
                </div>
              </div>

              {simulatedAddedSkills.length > 0 && (
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Simulated Extra Skills ({simulatedAddedSkills.length}):
                    </span>
                    <button
                      onClick={handleCommitToProfile}
                      className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Make Permanent →
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {simulatedAddedSkills.map((name, idx) => (
                      <span
                        key={idx}
                        onClick={() => toggleSimSkill(name)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-pointer flex items-center space-x-1"
                        title="Click to remove from simulation"
                      >
                        <FaCheck className="text-[9px]" />
                        <span>{name}</span>
                        <span className="text-slate-400 hover:text-white ml-1">×</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TOGGLE SKILLS SANDBOX */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FaBolt className="text-cyan-400 text-sm" />
                <span>Toggle In-Demand Skills to Simulate</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any technology below to add or remove it from your simulated profile.
              </p>
            </div>

            {simulatedAddedSkills.length > 0 && (
              <button
                onClick={() => setSimulatedAddedSkills([])}
                className="text-xs font-semibold text-rose-400 hover:underline cursor-pointer self-start sm:self-auto"
              >
                Clear Simulation
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {SIMULATION_SUGGESTIONS.map((skillName) => {
              const inProfile = skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase());
              const isSimulated = simulatedAddedSkills.includes(skillName);

              return (
                <button
                  key={skillName}
                  onClick={() => !inProfile && toggleSimSkill(skillName)}
                  disabled={inProfile}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                    inProfile
                      ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-default"
                      : isSimulated
                      ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-105"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {inProfile ? (
                    <FaCheck className="text-[10px]" />
                  ) : isSimulated ? (
                    <FaCheck className="text-[10px]" />
                  ) : (
                    <FaPlus className="text-[10px]" />
                  )}
                  <span>{skillName}</span>
                  {inProfile && <span className="text-[10px] text-slate-500">(In Profile)</span>}
                </button>
              );
            })}
          </div>

          {/* Add custom technology to simulation */}
          <form onSubmit={handleAddCustomSimSkill} className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              placeholder="Or type custom skill to test..."
              value={customSimSkill}
              onChange={(e) => setCustomSimSkill(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Test Skill
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Simulator;
