import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { profileApi } from "../../services/api.js";
import {
  FaUserTie,
  FaPlus,
  FaTrash,
  FaCheck,
  FaSave,
  FaBolt,
  FaLayerGroup,
  FaCheckCircle,
  FaSlidersH,
  FaBookOpen,
} from "react-icons/fa";

const POPULAR_SKILL_SHELF = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Docker", category: "DevOps & Cloud" },
  { name: "Kubernetes", category: "DevOps & Cloud" },
  { name: "AWS", category: "DevOps & Cloud" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "GraphQL", category: "Backend" },
  { name: "CI/CD", category: "DevOps & Cloud" },
  { name: "Git", category: "Tools & Methodologies" },
  { name: "Linux", category: "DevOps & Cloud" },
];

const PRESET_PROFILES = [
  {
    id: "fullstack",
    title: "Senior Fullstack Engineer",
    experienceLevel: "Senior",
    yearsOfExperience: 5,
    location: "San Francisco, CA (Remote)",
    bio: "Fullstack builder passionate about reactive frontends, resilient microservices, and high-performance MongoDB/PostgreSQL backends.",
    skills: [
      { name: "React", proficiency: "Expert", yearsOfExperience: 5, category: "Frontend" },
      { name: "TypeScript", proficiency: "Advanced", yearsOfExperience: 4, category: "Frontend" },
      { name: "Node.js", proficiency: "Advanced", yearsOfExperience: 4, category: "Backend" },
      { name: "MongoDB", proficiency: "Advanced", yearsOfExperience: 4, category: "Database" },
      { name: "Tailwind CSS", proficiency: "Expert", yearsOfExperience: 3, category: "Frontend" },
      { name: "Git", proficiency: "Expert", yearsOfExperience: 5, category: "Tools & Methodologies" },
      { name: "Docker", proficiency: "Intermediate", yearsOfExperience: 2, category: "DevOps & Cloud" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend UI Specialist",
    experienceLevel: "Mid-Level",
    yearsOfExperience: 3,
    location: "New York, NY",
    bio: "Obsessed with design systems, modern React, Next.js App Router, and fluid CSS animations.",
    skills: [
      { name: "React", proficiency: "Advanced", yearsOfExperience: 3, category: "Frontend" },
      { name: "Next.js", proficiency: "Advanced", yearsOfExperience: 2, category: "Frontend" },
      { name: "TypeScript", proficiency: "Intermediate", yearsOfExperience: 2, category: "Frontend" },
      { name: "Tailwind CSS", proficiency: "Expert", yearsOfExperience: 3, category: "Frontend" },
      { name: "JavaScript", proficiency: "Advanced", yearsOfExperience: 3, category: "Frontend" },
      { name: "HTML5", proficiency: "Expert", yearsOfExperience: 4, category: "Frontend" },
      { name: "CSS3", proficiency: "Expert", yearsOfExperience: 4, category: "Frontend" },
      { name: "Git", proficiency: "Intermediate", yearsOfExperience: 3, category: "Tools & Methodologies" },
    ],
  },
  {
    id: "devops",
    title: "Cloud & DevOps Architect",
    experienceLevel: "Senior",
    yearsOfExperience: 6,
    location: "Austin, TX (Remote)",
    bio: "Designing automated container platforms, cloud infrastructure on AWS, and zero-downtime CI/CD deployment pipelines.",
    skills: [
      { name: "Docker", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
      { name: "Kubernetes", proficiency: "Expert", yearsOfExperience: 4, category: "DevOps & Cloud" },
      { name: "AWS", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
      { name: "CI/CD", proficiency: "Expert", yearsOfExperience: 5, category: "DevOps & Cloud" },
      { name: "Python", proficiency: "Advanced", yearsOfExperience: 4, category: "Backend" },
      { name: "Linux", proficiency: "Expert", yearsOfExperience: 6, category: "DevOps & Cloud" },
      { name: "Git", proficiency: "Expert", yearsOfExperience: 6, category: "Tools & Methodologies" },
    ],
  },
  {
    id: "backend",
    title: "Backend & Systems Developer",
    experienceLevel: "Mid-Level",
    yearsOfExperience: 3,
    location: "Seattle, WA",
    bio: "Specializing in distributed database optimization, Python FastAPI microservices, and Redis caching.",
    skills: [
      { name: "Python", proficiency: "Advanced", yearsOfExperience: 3, category: "Backend" },
      { name: "PostgreSQL", proficiency: "Advanced", yearsOfExperience: 3, category: "Database" },
      { name: "Node.js", proficiency: "Intermediate", yearsOfExperience: 2, category: "Backend" },
      { name: "Redis", proficiency: "Intermediate", yearsOfExperience: 2, category: "Database" },
      { name: "Docker", proficiency: "Intermediate", yearsOfExperience: 2, category: "DevOps & Cloud" },
      { name: "Git", proficiency: "Advanced", yearsOfExperience: 3, category: "Tools & Methodologies" },
    ],
  },
];

const Profile = () => {
  const {
    user,
    skills,
    profile,
    addSkill,
    removeSkill,
    updateSkillsList,
    updateProfileData,
  } = useContext(AuthContext);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    title: profile.title || "Software Developer",
    bio: profile.bio || "",
    experienceLevel: profile.experienceLevel || "Mid-Level",
    yearsOfExperience: profile.yearsOfExperience || 3,
    location: profile.location || "Remote",
  });

  // New Skill input state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProficiency, setNewSkillProficiency] = useState("Intermediate");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");
  const [newSkillYears, setNewSkillYears] = useState(2);

  // Filter skills in list
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");

  // Status & feedback
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setProfileForm({
      title: profile.title || "Software Developer",
      bio: profile.bio || "",
      experienceLevel: profile.experienceLevel || "Mid-Level",
      yearsOfExperience: profile.yearsOfExperience || 3,
      location: profile.location || "Remote",
    });
  }, [profile]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add custom skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      await addSkill({
        name: newSkillName.trim(),
        proficiency: newSkillProficiency,
        category: newSkillCategory,
        yearsOfExperience: newSkillYears,
      });
      setNewSkillName("");
      showToast(`Added "${newSkillName.trim()}" to your skills!`);
    } catch (err) {
      alert(err.message || "Failed to add skill");
    }
  };

  // Quick add from popular shelf
  const handleQuickShelfAdd = async (item) => {
    try {
      await addSkill({
        name: item.name,
        proficiency: "Intermediate",
        category: item.category,
        yearsOfExperience: 2,
      });
      showToast(`Added "${item.name}" from popular skills shelf!`);
    } catch (err) {
      alert(err.message || "Skill already in profile");
    }
  };

  // Remove skill
  const handleRemoveSkill = async (skillName) => {
    try {
      await removeSkill(skillName);
      showToast(`Removed "${skillName}" from profile.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Load a complete preset
  const handleLoadPreset = async (preset) => {
    setProfileForm({
      title: preset.title,
      bio: preset.bio,
      experienceLevel: preset.experienceLevel,
      yearsOfExperience: preset.yearsOfExperience,
      location: preset.location,
    });
    await updateProfileData({
      title: preset.title,
      bio: preset.bio,
      experienceLevel: preset.experienceLevel,
      yearsOfExperience: preset.yearsOfExperience,
      location: preset.location,
    });
    await updateSkillsList(preset.skills);
    showToast(`Loaded preset profile: "${preset.title}" with ${preset.skills.length} skills!`);
  };

  // Save profile changes to MongoDB
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData(profileForm);
      showToast("Profile data saved to MongoDB successfully!");
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    if (selectedFilterCategory === "All") return true;
    return s.category === selectedFilterCategory;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-5">
            <FaCheckCircle className="text-base" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SECTION HEADER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <FaUserTie />
                <span>Candidate Profile & Skills Hub</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Manage Your Skills Profile
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Stored in MongoDB. Add, edit, or remove technical skills and experience levels. The compatibility checker recalibrates in real-time across all job postings.
              </p>
            </div>

            <div className="bg-slate-900/90 px-5 py-3 rounded-2xl border border-slate-800 flex items-center space-x-4 shrink-0">
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Skills
                </p>
                <p className="text-2xl font-black text-cyan-400">{skills.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/30">
                <FaBolt />
              </div>
            </div>
          </div>
        </div>

        {/* PRESET PROFILES SWITCHER */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FaBolt className="text-amber-400 text-sm" />
              <span>1-Click Candidate Presets</span>
            </h2>
            <span className="text-xs text-slate-400">
              Switch profiles to test different compatibility matches
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_PROFILES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleLoadPreset(preset)}
                className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 text-left transition-all cursor-pointer group"
              >
                <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {preset.experienceLevel} • {preset.yearsOfExperience} yrs
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.skills.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                    >
                      {s.name}
                    </span>
                  ))}
                  <span className="text-[10px] text-cyan-400 font-semibold">
                    +{preset.skills.length - 3} more
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN TWO-COLUMN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Candidate Info Editor */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FaUserTie className="text-indigo-400 text-sm" />
                <span>Candidate Details</span>
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Job Title / Specialty
                  </label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Senior Fullstack Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Level
                    </label>
                    <select
                      value={profileForm.experienceLevel}
                      onChange={(e) => setProfileForm({ ...profileForm, experienceLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Entry">Entry</option>
                      <option value="Junior">Junior</option>
                      <option value="Mid-Level">Mid-Level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                      Years Exp.
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={profileForm.yearsOfExperience}
                      onChange={(e) => setProfileForm({ ...profileForm, yearsOfExperience: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Location Preference
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g. Remote, San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Bio & Focus Area
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Brief background or target goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  <FaSave />
                  <span>{saving ? "Saving..." : "Save Profile to MongoDB"}</span>
                </button>
              </form>
            </div>

            {/* Popular Skills Quick Shelf */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FaLayerGroup className="text-cyan-400" />
                  <span>Quick-Add Popular Skills</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Click any skill below to add it immediately to your profile.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILL_SHELF.map((item, idx) => {
                  const alreadyHas = skills.some(
                    (s) => s.name.toLowerCase() === item.name.toLowerCase()
                  );

                  return (
                    <button
                      key={idx}
                      onClick={() => !alreadyHas && handleQuickShelfAdd(item)}
                      disabled={alreadyHas}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 ${
                        alreadyHas
                          ? "bg-slate-800 text-slate-500 cursor-default opacity-60"
                          : "bg-slate-900 hover:bg-indigo-600/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer"
                      }`}
                    >
                      {alreadyHas ? <FaCheck className="text-[9px]" /> : <FaPlus className="text-[9px]" />}
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Add Skill Form & Skills Inventory */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Add New Custom Skill Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FaPlus className="text-cyan-400 text-xs" />
                <span>Add Skill to Your Profile</span>
              </h2>

              <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g. Next.js, Kubernetes, Redis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Proficiency
                  </label>
                  <select
                    value={newSkillProficiency}
                    onChange={(e) => setNewSkillProficiency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Tools & Methodologies">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-4 flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md"
                  >
                    <FaPlus className="text-[10px]" />
                    <span>Add to Stored Profile</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Current Skills Inventory Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>Stored Skills Inventory ({skills.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Your skills used for real-time job compatibility checking.
                  </p>
                </div>

                {/* Category filter */}
                <div className="flex items-center space-x-1 overflow-x-auto text-xs">
                  {["All", "Frontend", "Backend", "Database", "DevOps & Cloud"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedFilterCategory === cat
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Grid */}
              {filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{skill.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {skill.proficiency || "Intermediate"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {skill.category || "General"} • {skill.yearsOfExperience || 1} yrs exp.
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveSkill(skill.name)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title={`Remove ${skill.name}`}
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No skills matching the "{selectedFilterCategory}" category filter.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
