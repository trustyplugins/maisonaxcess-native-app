// api.js
import { API_BASE_URL } from '@env';
import axios from 'axios';

const api = axios.create({
    baseURL: `${API_BASE_URL}`,
    timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
    config => {
        if (config.headers.Authorization) {
            return config;
        }
        // Optionally, you can add some default logic here if needed
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error, e.g., redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
