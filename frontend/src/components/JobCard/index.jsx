import React, { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { calculateJobMatch } from "../../utils/compatibilityHelper.js";
import {
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaBriefcase,
  FaDollarSign,
  FaArrowRight,
  FaBuilding,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const JobCard = ({ job, onDelete, onSelectJob }) => {
  const { user, skills } = useContext(AuthContext);

  // Compute live compatibility score
  const match = calculateJobMatch(skills, job);

  const isOwner = user && user._id && job.user && (user._id === job.user || user._id === job.user?._id);

  return (
    <div className="group relative rounded-2xl glass-panel glass-panel-hover p-6 flex flex-col justify-between border border-slate-800 transition-all duration-300">
      
      {/* Top Header: Company Info & Compatibility Meter */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <img
              src={job.logo || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop"}
              alt={job.company}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-800 p-0.5 shadow-md shrink-0"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop";
              }}
            />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {job.title}
              </h3>
              <p className="text-xs font-semibold text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <FaBuilding className="text-[11px] text-slate-500" />
                <span>{job.company}</span>
              </p>
            </div>
          </div>

          {/* Compatibility Ring / Score Badge */}
          <div
            className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border shrink-0 text-center shadow-lg transition-transform group-hover:scale-105"
            style={{
              backgroundColor: match.badgeBg,
              borderColor: `${match.tierColor}40`,
            }}
          >
            <div className="flex items-baseline space-x-0.5">
              <span className="text-xl font-extrabold" style={{ color: match.tierColor }}>
                {match.score}%
              </span>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5 whitespace-nowrap"
              style={{ color: match.tierColor }}
            >
              {match.matchTier.split(" ")[0]}
            </span>
          </div>
        </div>

        {/* Badges: Location, Type, Salary */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <FaMapMarkerAlt className="text-slate-400 text-[10px]" />
            <span>{job.location}</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
            <FaBriefcase className="text-indigo-400 text-[10px]" />
            <span>{job.jobType}</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
            <FaDollarSign className="text-emerald-400 text-[10px]" />
            <span>{job.salaryDisplay || (job.salary ? `$${job.salary.toLocaleString()}` : "Competitive")}</span>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-5 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills Compatibility Comparison Matrix */}
        <div className="mb-5 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Required Skills Match ({match.matchedRequired.length}/{job.requiredSkills?.length || 0})
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {match.matchedRequired.length === (job.requiredSkills?.length || 0)
                ? "All requirements met"
                : `${(job.requiredSkills?.length || 0) - match.matchedRequired.length} skill gap`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills?.map((skill, idx) => {
              const isMatched = match.matchedRequired.some(
                (m) => m.name.toLowerCase() === skill.toLowerCase()
              );

              return (
                <span
                  key={idx}
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                    isMatched
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                      : "bg-rose-500/10 text-rose-300/90 border-rose-500/30"
                  }`}
                  title={isMatched ? `You have ${skill} in your profile` : `Missing requirement: ${skill}`}
                >
                  {isMatched ? (
                    <FaCheck className="text-[9px] text-emerald-400" />
                  ) : (
                    <FaTimes className="text-[9px] text-rose-400" />
                  )}
                  <span>{skill}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
        <RouterLink
          to={`/jobs/${job._id}`}
          className="flex-1 py-2 px-3.5 rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>Check Compatibility & Roadmap</span>
          <FaArrowRight className="text-[10px]" />
        </RouterLink>

        {isOwner && (
          <div className="flex items-center space-x-1 shrink-0">
            <RouterLink
              to={`/jobs/edit/${job._id}`}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Edit Job"
            >
              <FaEdit className="text-xs" />
            </RouterLink>
            <button
              onClick={() => onDelete(job._id)}
              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
              title="Delete Job"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
