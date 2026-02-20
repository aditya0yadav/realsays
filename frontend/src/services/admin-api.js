import axios from 'axios';

const adminApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add admin token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// API Methods
const getDashboardStats = async () => {
    const response = await adminApi.get('/admin/dashboard-stats');
    return response.data;
};

const getInitialData = async () => {
    const response = await adminApi.get('/survey/mappings/initial-data');
    return response.data;
};

const getProviderMappings = async (providerId) => {
    const response = await adminApi.get(`/survey/mappings/${providerId}`);
    return response.data;
};

const saveAttributeMapping = async (data) => {
    const response = await adminApi.post('/survey/mappings/attribute', data);
    return response.data;
};

const saveOptionMapping = async (data) => {
    const response = await adminApi.post('/survey/mappings/option', data);
    return response.data;
};

export const adminService = {
    getDashboardStats,
    getInitialData,
    // --- User Management ---
    getUsers: async (params = {}) => {
        const response = await adminApi.get('/admin/users', { params });
        return response.data;
    },

    getUserDetails: async (userId) => {
        const response = await adminApi.get(`/admin/users/${userId}`);
        return response.data;
    },

    getLeaderboard: async () => {
        const response = await adminApi.get('/admin/leaderboard');
        return response.data;
    },

    // --- Provider Mappings ---
    getProviderMappings, // Kept existing method
    saveAttributeMapping,
    saveOptionMapping
};

export default adminApi;
