import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Backend hosted on port 3000
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

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Call refresh endpoint
                const { data } = await axios.post('http://localhost:3000/api/auth/refresh', {
                    refreshToken,
                });

                // Store new tokens
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed (expired or invalid), logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
