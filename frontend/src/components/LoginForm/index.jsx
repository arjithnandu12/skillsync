import React, { useState, useContext } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { authApi } from "../../services/api.js";
import {
  FaBolt,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight,
  FaUserAstronaut,
} from "react-icons/fa";

const DEMO_LOGINS = [
  { label: "Alex (Fullstack Senior)", email: "alex@example.com", password: "Password123!" },
  { label: "Sarah (Frontend Specialist)", email: "sarah@example.com", password: "Password123!" },
  { label: "Marcus (Cloud DevOps)", email: "marcus@example.com", password: "Password123!" },
  { label: "Priya (Backend Systems)", email: "priya@example.com", password: "Password123!" },
];

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    title: "Software Developer",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        const response = await authApi.login(formData.email, formData.password);
        login(response.accessToken, response.user);
        navigate("/jobs");
      } else {
        const response = await authApi.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          title: formData.title,
        });
        login(response.accessToken, response);
        navigate("/profile");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(
        err.response?.data?.message || "Authentication failed. Please verify credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demo) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await authApi.login(demo.email, demo.password);
      login(response.accessToken, response.user);
      navigate("/jobs");
    } catch (err) {
      console.error("Demo login error:", err);
      setErrorMessage("Could not login with demo account. Ensure database is seeded.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <RouterLink to="/" className="inline-flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] glow-indigo">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <FaBolt className="text-cyan-400 text-lg" />
              </div>
            </div>
            <span className="text-2xl font-black text-white">SkillSync</span>
          </RouterLink>
          <h2 className="text-xl font-extrabold text-white">
            {isLogin ? "Sign In to Your Skills Account" : "Create Candidate Account"}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin
              ? "Access your stored technical skills, match ratings, and roadmaps"
              : "Register to save custom skills and track job compatibility in MongoDB"}
          </p>
        </div>

        {/* 1-Click Demo Logins Shelf */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <FaUserAstronaut className="text-cyan-400" />
            <span>1-Click Test Candidate Logins:</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_LOGINS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickDemoLogin(demo)}
                disabled={submitting}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-500/50 text-[11px] font-semibold text-slate-300 hover:text-white transition-all text-left cursor-pointer truncate"
              >
                ⚡ {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Box */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <FaExclamationCircle className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <FaCheckCircle className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g. dev_candidate"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                    Target Specialty / Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold uppercase tracking-wider text-[11px] mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              <span>{submitting ? "Processing..." : isLogin ? "Sign In" : "Register Account"}</span>
              <FaArrowRight className="text-[10px]" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs border-t border-slate-800 text-slate-400">
            {isLogin ? "Don't have an account yet? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
              }}
              className="font-bold text-cyan-400 hover:underline cursor-pointer"
            >
              {isLogin ? "Register here" : "Sign in here"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;