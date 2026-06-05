const API_BASE = window.API_BASE || "https://resume-analyzer-7y62.onrender.com/api";
// ===== GET TOKEN =====
const getToken = () => localStorage.getItem('token');

// ===== HEADERS =====
const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`
});

// ===== AUTH APIs =====
const API = {

    // Register user
    register: async (name, email, password) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    },

    // Login user
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    // Get user profile
    getProfile: async () => {
        const res = await fetch(`${API_BASE}/auth/profile`, {
            headers: getHeaders()
        });
        return res.json();
    },

    // Upload and analyze resume
    uploadResume: async (formData) => {
        const res = await fetch(`${API_BASE}/resume/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData
        });
        return res.json();
    },

    // Get all resumes
    getAllResumes: async () => {
        const res = await fetch(`${API_BASE}/resume/all`, {
            headers: getHeaders()
        });
        return res.json();
    },

    // Get single resume analysis
    getResumeAnalysis: async (id) => {
        const res = await fetch(`${API_BASE}/resume/${id}`, {
            headers: getHeaders()
        });
        return res.json();
    },

    // Delete resume
    deleteResume: async (id) => {
        const res = await fetch(`${API_BASE}/resume/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    },

    // Get history
    getHistory: async () => {
        const res = await fetch(`${API_BASE}/history`, {
            headers: getHeaders()
        });
        return res.json();
    },

    // Delete history item
    deleteHistory: async (id) => {
        const res = await fetch(`${API_BASE}/history/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    },

    // Clear all history
    clearHistory: async () => {
        const res = await fetch(`${API_BASE}/history`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return res.json();
    }
};