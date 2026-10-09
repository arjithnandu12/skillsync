import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { jobsApi } from "../../services/api.js";
import {
  FaBriefcase,
  FaSave,
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaDollarSign,
  FaLayerGroup,
  FaCheckCircle,
} from "react-icons/fa";

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    logo: "",
    location: "Remote",
    jobType: "Full-time",
    experienceLevel: "Mid-Level",
    category: "Fullstack",
    salary: "",
    salaryDisplay: "",
    description: "",
    requiredSkills: "",
    preferredSkills: "",
    responsibilities: "",
    benefits: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load job if editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchJob = async () => {
      try {
        const data = await jobsApi.getJobById(id);
        setFormData({
          title: data.title || "",
          company: data.company || "",
          logo: data.logo || "",
          location: data.location || "Remote",
          jobType: data.jobType || "Full-time",
          experienceLevel: data.experienceLevel || "Mid-Level",
          category: data.category || "Fullstack",
          salary: data.salary || "",
          salaryDisplay: data.salaryDisplay || "",
          description: data.description || "",
          requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills.join(", ") : "",
          preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills.join(", ") : "",
          responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.join("\n") : "",
          benefits: Array.isArray(data.benefits) ? data.benefits.join("\n") : "",
        });
      } catch (err) {
        console.error("Error loading job:", err);
        setError("Failed to load job data for editing.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) {
      alert("Please fill in Title, Company, and Description.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      title: formData.title.trim(),
      company: formData.company.trim(),
      logo: formData.logo.trim() || undefined,
      location: formData.location.trim(),
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      category: formData.category,
      salary: formData.salary ? Number(formData.salary) : undefined,
      salaryDisplay: formData.salaryDisplay.trim() || undefined,
      description: formData.description.trim(),
      requiredSkills: formData.requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      preferredSkills: formData.preferredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      responsibilities: formData.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: formData.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing) {
        await jobsApi.updateJob(id, payload);
      } else {
        await jobsApi.createJob(payload);
      }
      navigate("/jobs");
    } catch (err) {
      console.error("Error submitting job:", err);
      setError(err.response?.data?.message || "Failed to save job posting.");
    } finally {
      setSubmitting(false);
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
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/jobs")}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <FaArrowLeft />
            <span>Back to Explorer</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
              <FaBriefcase className="text-indigo-400" />
              <span>{isEditing ? "Edit Job Position" : "Create New Job Position"}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Specify required and preferred skills to enable intelligent candidate compatibility matching.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            
            {/* Title & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Fullstack Engineer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Vercel, Stripe, Datadog"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Location & Job Type & Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Remote, San Francisco, CA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Job Type
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Entry">Entry</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
            </div>

            {/* Category & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  <option value="Fullstack">Fullstack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Salary Number (Annual)
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. 150000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Salary Display Text
                </label>
                <input
                  type="text"
                  value={formData.salaryDisplay}
                  onChange={(e) => setFormData({ ...formData, salaryDisplay: e.target.value })}
                  placeholder="e.g. $140,000 - $160,000 / yr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* REQUIRED SKILLS */}
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                These are critical core competencies that carry 80% of candidate match calculation weight.
              </p>
            </div>

            {/* PREFERRED SKILLS */}
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Preferred / Nice-to-Have Skills (Comma separated)
              </label>
              <input
                type="text"
                value={formData.preferredSkills}
                onChange={(e) => setFormData({ ...formData, preferredSkills: e.target.value })}
                placeholder="e.g. Docker, Redis, Next.js, GraphQL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Bonus skills that give candidates extra competitive points.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Detailed Job Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive summary of the role, team context, and mission..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* RESPONSIBILITIES */}
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Key Responsibilities (One item per line)
              </label>
              <textarea
                rows={3}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Architect reactive frontend systems&#10;Write integration test suites&#10;Mentor junior developers"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* BENEFITS */}
            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Perks & Benefits (One item per line)
              </label>
              <textarea
                rows={2}
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                placeholder="Health, Dental, Optical&#10;Flexible PTO&#10;$3,000 learning budget"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              >
                <FaSave />
                <span>{submitting ? "Saving Job..." : isEditing ? "Update Job" : "Publish Job Posting"}</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default JobForm;
