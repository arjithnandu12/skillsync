import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaSearch, FaPlus, FaFilter, FaSlidersH, FaBolt, FaCheckCircle, FaUserAstronaut } from "react-icons/fa";
import JobCard from "../JobCard/index.jsx";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { jobsApi } from "../../services/api.js";
import { calculateJobMatch } from "../../utils/compatibilityHelper.js";

const CATEGORIES = ["All", "Fullstack", "Frontend", "Backend", "DevOps & Cloud", "AI & Data", "Mobile"];
const MATCH_FILTERS = ["All Matches", "Outstanding (85%+)", "Strong (70%+)", "Moderate (50-69%)", "Skill Gap (<50%)"];

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMatchFilter, setSelectedMatchFilter] = useState("All Matches");
  const [sortBy, setSortBy] = useState("compatibility"); // "compatibility" | "newest" | "salary"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { skills, activeProfileName } = useContext(AuthContext);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch jobs from MongoDB backend
  useEffect(() => {
    fetchJobs();
    if (currentPage !== 1 && debouncedSearch) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, selectedCategory]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 20,
        search: debouncedSearch,
        category: selectedCategory === "All" ? "" : selectedCategory,
      };
      const response = await jobsApi.getJobs(params);
      setJobs(response.data || []);
      setTotalPages(response.pages || 1);
    } catch {
      setError("Failed to fetch jobs from server. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await jobsApi.deleteJob(jobId);
      fetchJobs();
    } catch {
      alert("Failed to delete job. You may not be authorized.");
    }
  };

  // Compute live match score for every job and apply match filter and sorting
  const processedJobs = useMemo(() => {
    const mapped = jobs.map((job) => {
      const analysis = calculateJobMatch(skills, job);
      return { ...job, matchScore: analysis.score, matchTier: analysis.matchTier };
    });

    // Filter by match tier
    const filtered = mapped.filter((job) => {
      if (selectedMatchFilter === "Outstanding (85%+)") return job.matchScore >= 85;
      if (selectedMatchFilter === "Strong (70%+)") return job.matchScore >= 70 && job.matchScore < 85;
      if (selectedMatchFilter === "Moderate (50-69%)") return job.matchScore >= 50 && job.matchScore < 70;
      if (selectedMatchFilter === "Skill Gap (<50%)") return job.matchScore < 50;
      return true;
    });

    // Sort jobs
    return filtered.sort((a, b) => {
      if (sortBy === "compatibility") {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === "salary") {
        return (b.salary || 0) - (a.salary || 0);
      }
      return new Date(b.postedAt) - new Date(a.postedAt);
    });
  }, [jobs, skills, selectedMatchFilter, sortBy]);

  // Aggregate candidate match stats
  const stats = useMemo(() => {
    let high = 0;
    let moderate = 0;
    let low = 0;
    jobs.forEach((job) => {
      const { score } = calculateJobMatch(skills, job);
      if (score >= 70) high++;
      else if (score >= 50) moderate++;
      else low++;
    });
    return { high, moderate, low, total: jobs.length };
  }, [jobs, skills]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HERO / STATUS BAR */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <FaBolt />
                <span>Live Skills Compatibility Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Role Compatibility Explorer
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Real-time compatibility matching against your{" "}
                <span className="text-cyan-300 font-bold">{skills.length} stored skills</span> for{" "}
                <span className="text-white font-bold">{activeProfileName}</span>. Click on any job to view detailed gap analysis and tailored learning roadmaps.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-900/90 border border-emerald-500/30 px-4 py-3 rounded-2xl text-center min-w-[100px]">
                <p className="text-2xl font-black text-emerald-400">{stats.high}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  High Matches (70%+)
                </p>
              </div>

              <div className="bg-slate-900/90 border border-amber-500/30 px-4 py-3 rounded-2xl text-center min-w-[100px]">
                <p className="text-2xl font-black text-amber-400">{stats.moderate}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Moderate (50-69%)
                </p>
              </div>

              <div className="bg-slate-900/90 border border-rose-500/30 px-4 py-3 rounded-2xl text-center min-w-[100px]">
                <p className="text-2xl font-black text-rose-400">{stats.low}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Skill Gaps (&lt;50%)
                </p>
              </div>

              <RouterLink
                to="/profile"
                className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-indigo-600/30 self-stretch sm:self-auto justify-center"
              >
                <FaUserAstronaut />
                <span>Edit Skills</span>
              </RouterLink>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search by job title, company, or required skill (e.g. React, Docker)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            {/* Sort & Post Job */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700/80 text-xs">
                <FaSlidersH className="text-slate-400" />
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="compatibility" className="bg-slate-900">Highest Match</option>
                  <option value="salary" className="bg-slate-900">Highest Salary</option>
                  <option value="newest" className="bg-slate-900">Recently Posted</option>
                </select>
              </div>

              <RouterLink
                to="/jobs/new"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-colors shadow-md shrink-0"
              >
                <FaPlus className="text-[10px]" />
                <span>Post Job</span>
              </RouterLink>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
            
            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-slate-400 font-semibold mr-1 shrink-0">Role:</span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Match Tier Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-slate-400 font-semibold mr-1 shrink-0">Match Tier:</span>
              {MATCH_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedMatchFilter(filter)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedMatchFilter === filter
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Computing live skills compatibility...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center text-sm font-semibold">
            {error}
          </div>
        )}

        {/* JOBS GRID */}
        {!loading && !error && (
          <div>
            {processedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 p-8 space-y-3">
                <p className="text-lg font-bold text-white">No jobs matched your current criteria.</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try broadening your search keywords or resetting the match filters to explore all available tech roles.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setSelectedMatchFilter("All Matches");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-3 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold glass-panel text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold glass-panel text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default JobsList;
