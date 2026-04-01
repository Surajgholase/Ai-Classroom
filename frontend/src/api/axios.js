import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 if it's not the login request itself
        if (error.response && error.response.status === 401) {
            const isLoginRequest = error.config.url.includes('token/') && error.config.method === 'post';
            
            if (!isLoginRequest) {
                localStorage.removeItem('token');
                // Avoid infinite redirect loop
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
