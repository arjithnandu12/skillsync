import axios from 'axios';
import Cookies from 'js-cookie';

// Use configurable API URL or production Render backend URL, with local dev proxy fallback
const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://skillsync-backend-0lfd.onrender.com/api'
    : '/api');

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/user/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await apiClient.post('/user/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get('/user/current');
    return res.data;
  },
  getDemoProfiles: async () => {
    const res = await apiClient.get('/user/demo-profiles');
    return res.data;
  },
};

export const profileApi = {
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/user/profile', profileData);
    return res.data;
  },
  updateSkills: async (skills) => {
    const res = await apiClient.put('/user/skills', { skills });
    return res.data;
  },
  addSkill: async (skill) => {
    const res = await apiClient.post('/user/skills', skill);
    return res.data;
  },
  removeSkill: async (skillName) => {
    const res = await apiClient.delete(`/user/skills/${encodeURIComponent(skillName)}`);
    return res.data;
  },
  getPopularSkills: async () => {
    const res = await apiClient.get('/user/popular-skills');
    return res.data;
  },
};

export const jobsApi = {
  getJobs: async (params = {}) => {
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  },
  getJobById: async (id) => {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  },
  checkCompatibility: async (jobId, skills) => {
    const res = await apiClient.post(`/jobs/${jobId}/compatibility`, { skills });
    return res.data;
  },
  batchCompatibility: async (skills) => {
    const res = await apiClient.post('/jobs/compatibility/batch', { skills });
    return res.data;
  },
  getAllSkills: async () => {
    const res = await apiClient.get('/jobs/skills/all');
    return res.data;
  },
  createJob: async (jobData) => {
    const res = await apiClient.post('/jobs', jobData);
    return res.data;
  },
  updateJob: async (id, jobData) => {
    const res = await apiClient.put(`/jobs/${id}`, jobData);
    return res.data;
  },
  deleteJob: async (id) => {
    const res = await apiClient.delete(`/jobs/${id}`);
    return res.data;
  },
};

export default apiClient;
