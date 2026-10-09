import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import {
  FaBolt,
  FaCheckCircle,
  FaArrowRight,
  FaLayerGroup,
  FaGraduationCap,
  FaChartLine,
  FaBriefcase,
  FaUserAstronaut,
  FaSlidersH,
} from "react-icons/fa";

const Home = () => {
  const { skills, activeProfileName } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 overflow-hidden">
      
      {/* GLOWING AMBIENT BACKGROUND */}
      <div className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-xs font-semibold text-cyan-300 shadow-lg glow-indigo animate-in fade-in duration-700">
            <FaBolt className="text-cyan-400" />
            <span>AI-Powered Career & Skills Compatibility Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Match Your Technical Skills with{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Top Engineering Roles
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop guessing if your resume fits. Diagnose technical gaps, get personalized learning roadmaps, and see live compatibility scores across 12+ real-world tech positions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <RouterLink
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2.5 cursor-pointer group"
            >
              <span>Explore Roles & Check Compatibility</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </RouterLink>

            <RouterLink
              to="/profile"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/80 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FaUserAstronaut className="text-cyan-400" />
              <span>Configure My Skills Profile ({skills.length})</span>
            </RouterLink>

            <RouterLink
              to="/simulator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/80 font-bold text-sm border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FaSlidersH className="text-violet-400" />
              <span>Match Simulator</span>
            </RouterLink>
          </div>

          {/* ACTIVE CANDIDATE MINI BANNER */}
          <div className="pt-6">
            <div className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Current Candidate:</span>
              <span className="font-bold text-white">{activeProfileName}</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-semibold">{skills.length} Technical Skills Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* FEATURE PILLARS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xl border border-cyan-500/20">
              <FaBolt />
            </div>
            <h3 className="text-lg font-bold text-white">Real-Time Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every job posting evaluates your exact required and preferred skills, computing weighted compatibility scores between 0% and 100%.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl border border-indigo-500/20">
              <FaGraduationCap />
            </div>
            <h3 className="text-lg font-bold text-white">Actionable Roadmaps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When a job requires skills you don't yet have, get estimated learning time, core topics to study, official docs, and portfolio project suggestions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-xl border border-violet-500/20">
              <FaLayerGroup />
            </div>
            <h3 className="text-lg font-bold text-white">MongoDB Persistence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store custom skills, proficiencies, experience levels, and profile information permanently in MongoDB with seamless API integration.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;
