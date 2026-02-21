import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    // Fallback to current hostname for mobile/other device access
    const { hostname } = window.location;
    return `http://${hostname}:5000/api`;
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration (401)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            console.error('Frontend API Error: 401 Unauthorized at', originalRequest.url);

            if (!originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    try {
                        // Attempting token refresh
                        const { data } = await axios.post(`${getBaseURL()}/auth/refresh`, {
                            refreshToken,
                        });

                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        console.error('Frontend: Refresh failed', refreshError);
                    }
                } else {
                    console.warn('Frontend: No refresh token available for 401 retry');
                }
            }

            // If we get here, refresh either didn't happen or failed
            console.warn('Frontend: Redirecting to login due to persistent 401');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
