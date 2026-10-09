import { createContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { authApi, profileApi } from "../services/api";

const AuthContext = createContext();
export { AuthContext };

// Default initial guest skills so first-time visitors can immediately see compatibility in action!
const DEFAULT_GUEST_SKILLS = [
  { name: "React", proficiency: "Advanced", yearsOfExperience: 3, category: "Frontend" },
  { name: "TypeScript", proficiency: "Intermediate", yearsOfExperience: 2, category: "Frontend" },
  { name: "JavaScript", proficiency: "Expert", yearsOfExperience: 4, category: "Frontend" },
  { name: "Tailwind CSS", proficiency: "Advanced", yearsOfExperience: 2, category: "Frontend" },
  { name: "Node.js", proficiency: "Intermediate", yearsOfExperience: 2, category: "Backend" },
  { name: "Git", proficiency: "Advanced", yearsOfExperience: 3, category: "Tools & Methodologies" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState(DEFAULT_GUEST_SKILLS);
  const [profile, setProfile] = useState({
    title: "Frontend & Web Developer",
    bio: "Passionate engineer exploring role compatibility and expanding tech horizons.",
    experienceLevel: "Mid-Level",
    yearsOfExperience: 3,
    location: "Remote / Hybrid",
  });
  const [demoProfiles, setDemoProfiles] = useState([]);
  const [activeProfileName, setActiveProfileName] = useState("Demo Candidate");
  const [loading, setLoading] = useState(true);

  // Load demo profiles from MongoDB on start
  const fetchDemoProfiles = useCallback(async () => {
    try {
      const demos = await authApi.getDemoProfiles();
      setDemoProfiles(demos || []);
    } catch (err) {
      console.warn("Could not load demo profiles from API:", err);
    }
  }, []);

  // Fetch full user data from backend if authenticated
  const fetchCurrentUser = useCallback(async (token) => {
    try {
      const data = await authApi.getCurrentUser();
      setUser((prev) => ({ ...prev, ...data, token }));
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        setSkills(data.skills);
      }
      setProfile({
        title: data.title || "Software Developer",
        bio: data.bio || "",
        experienceLevel: data.experienceLevel || "Mid-Level",
        yearsOfExperience: data.yearsOfExperience || 2,
        location: data.location || "Remote",
      });
      setActiveProfileName(data.username || data.email);
    } catch (err) {
      console.warn("Error fetching current user:", err);
    }
  }, []);

  useEffect(() => {
    fetchDemoProfiles();

    const token = Cookies.get("accessToken") || localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ token, ...decoded.user });
        fetchCurrentUser(token);
      } catch (e) {
        console.error("Failed to decode token:", e);
        Cookies.remove("accessToken");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      // Check if local skills exist in storage
      const savedSkills = localStorage.getItem("skills_compat_guest_skills");
      if (savedSkills) {
        try {
          setSkills(JSON.parse(savedSkills));
        } catch {
          // ignore error
        }
      }
      const savedProfile = localStorage.getItem("skills_compat_guest_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile(parsed);
          setActiveProfileName(parsed.title || "Custom Profile");
        } catch {
          // ignore error
        }
      }
    }
    setLoading(false);
  }, [fetchCurrentUser, fetchDemoProfiles]);

  // Login handler
  const login = async (token, userData = null) => {
    Cookies.set("accessToken", token, { expires: 7, sameSite: "Lax" });
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser({ token, ...decoded.user, ...(userData || {}) });
      await fetchCurrentUser(token);
    } catch (e) {
      console.error("Failed to decode token during login:", e);
      setUser(null);
    }
  };

  // Logout handler
  const logout = () => {
    Cookies.remove("accessToken");
    localStorage.removeItem("token");
    setUser(null);
    setSkills(DEFAULT_GUEST_SKILLS);
    setActiveProfileName("Demo Candidate");
  };

  // Switch to one of the seeded MongoDB profiles for 1-click testing
  const switchDemoProfile = (demoUser) => {
    if (!demoUser) return;
    setSkills(demoUser.skills || []);
    setProfile({
      title: demoUser.title || "Engineer",
      bio: demoUser.bio || "",
      experienceLevel: demoUser.experienceLevel || "Mid-Level",
      yearsOfExperience: demoUser.yearsOfExperience || 3,
      location: demoUser.location || "Remote",
    });
    setActiveProfileName(demoUser.username || demoUser.title);
    localStorage.setItem("skills_compat_guest_skills", JSON.stringify(demoUser.skills || []));
    localStorage.setItem("skills_compat_guest_profile", JSON.stringify({
      title: demoUser.title,
      bio: demoUser.bio,
      experienceLevel: demoUser.experienceLevel,
      yearsOfExperience: demoUser.yearsOfExperience,
      location: demoUser.location,
    }));
  };

  // Add skill to current profile
  const addSkill = async (newSkill) => {
    const skillObj = {
      name: newSkill.name.trim(),
      proficiency: newSkill.proficiency || "Intermediate",
      yearsOfExperience: Number(newSkill.yearsOfExperience) || 1,
      category: newSkill.category || "Other",
    };

    // Prevent duplicate
    if (skills.some((s) => s.name.toLowerCase() === skillObj.name.toLowerCase())) {
      throw new Error(`Skill "${skillObj.name}" is already in your skills list.`);
    }

    const updated = [...skills, skillObj];
    setSkills(updated);

    if (user && user.token) {
      try {
        await profileApi.addSkill(skillObj);
      } catch (err) {
        console.error("Backend error saving skill:", err);
      }
    } else {
      localStorage.setItem("skills_compat_guest_skills", JSON.stringify(updated));
    }
    return updated;
  };

  // Remove skill
  const removeSkill = async (skillName) => {
    const updated = skills.filter(
      (s) => s.name.toLowerCase() !== skillName.toLowerCase() && s._id !== skillName
    );
    setSkills(updated);

    if (user && user.token) {
      try {
        await profileApi.removeSkill(skillName);
      } catch (err) {
        console.error("Backend error removing skill:", err);
      }
    } else {
      localStorage.setItem("skills_compat_guest_skills", JSON.stringify(updated));
    }
    return updated;
  };

  // Bulk update skills
  const updateSkillsList = async (newList) => {
    setSkills(newList);
    if (user && user.token) {
      try {
        await profileApi.updateSkills(newList);
      } catch (err) {
        console.error("Backend error updating skills:", err);
      }
    } else {
      localStorage.setItem("skills_compat_guest_skills", JSON.stringify(newList));
    }
  };

  // Update profile metadata
  const updateProfileData = async (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    if (data.title) setActiveProfileName(data.title);

    if (user && user.token) {
      try {
        await profileApi.updateProfile(data);
      } catch (err) {
        console.error("Backend error updating profile:", err);
      }
    } else {
      localStorage.setItem("skills_compat_guest_profile", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        skills,
        profile,
        demoProfiles,
        activeProfileName,
        loading,
        login,
        logout,
        addSkill,
        removeSkill,
        updateSkillsList,
        updateProfileData,
        switchDemoProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
