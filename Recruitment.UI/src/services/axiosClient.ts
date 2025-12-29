// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7016/api', // Địa chỉ Backend của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động gắn Token vào mỗi request nếu có
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: Xử lý response trả về
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Bạn có thể xử lý lỗi chung tại đây (ví dụ: 401 -> logout)
        return Promise.reject(error);
    }
);

export default axiosClient;