import React, { useContext, useState, useRef, useEffect } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import {
  FaBolt,
  FaBriefcase,
  FaUserAstronaut,
  FaPlus,
  FaSignOutAlt,
  FaSignInAlt,
  FaChevronDown,
  FaSlidersH,
  FaCheck,
  FaCode,
  FaLayerGroup,
} from "react-icons/fa";

const Header = () => {
  const {
    user,
    skills,
    profile,
    demoProfiles,
    activeProfileName,
    logout,
    switchDemoProfile,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <RouterLink to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] glow-indigo transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <FaBolt className="text-cyan-400 text-lg group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SkillSync
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI Match
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Skills Compatibility Checker
            </p>
          </div>
        </RouterLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <RouterLink
            to="/jobs"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/jobs") || isActive("/")
                ? "bg-indigo-600/20 text-cyan-400 border border-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FaBriefcase className="text-xs" />
            <span>Job Explorer</span>
          </RouterLink>

          <RouterLink
            to="/profile"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
              isActive("/profile")
                ? "bg-indigo-600/20 text-cyan-400 border border-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FaUserAstronaut className="text-xs" />
            <span>My Skills & Profile</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {skills.length}
            </span>
          </RouterLink>

          <RouterLink
            to="/simulator"
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/simulator")
                ? "bg-indigo-600/20 text-cyan-400 border border-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <FaSlidersH className="text-xs" />
            <span>Match Simulator</span>
          </RouterLink>

          <RouterLink
            to="/jobs/new"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive("/jobs/new")
                ? "bg-indigo-600/20 text-cyan-400 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <FaPlus className="text-xs" />
            <span>Post Job</span>
          </RouterLink>
        </nav>

        {/* Right Action Bar: Profile Switcher & Auth */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Profile Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 transition-all text-xs font-medium cursor-pointer shadow-sm group"
              title="Switch profile to test different skill sets instantly"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-inner">
                {activeProfileName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] text-slate-400 leading-tight">Active Candidate</div>
                <div className="text-xs font-semibold text-white max-w-[110px] truncate leading-tight">
                  {activeProfileName}
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {skills.length} skills
              </span>
              <FaChevronDown className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>

            {/* Switcher Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel bg-[#0d1527]/95 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Test Profile
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Test how compatibility scores change dynamically across roles.
                  </p>
                </div>

                <div className="py-1.5 space-y-1">
                  {demoProfiles.length > 0 ? (
                    demoProfiles.map((p) => {
                      const isCurrent = activeProfileName === p.username || activeProfileName === p.title;
                      return (
                        <button
                          key={p._id}
                          onClick={() => {
                            switchDemoProfile(p);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-indigo-600/30 text-white border border-indigo-500/40"
                              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-semibold text-slate-200 truncate">
                              {p.title || p.username}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {p.skills?.map((s) => s.name).slice(0, 3).join(", ")}...
                            </div>
                          </div>
                          {isCurrent && <FaCheck className="text-cyan-400 text-xs shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      No demo profiles loaded.
                    </div>
                  )}
                </div>

                <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center px-1">
                  <RouterLink
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1 py-1"
                  >
                    <span>Custom Skill Editor →</span>
                  </RouterLink>
                </div>
              </div>
            )}
          </div>

          {/* User Auth status button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
              title="Logout"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <RouterLink
              to="/auth"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30"
            >
              <FaSignInAlt />
              <span>Login</span>
            </RouterLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
