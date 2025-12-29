// src/services/authService.ts
import { User } from '../types/auth';
import axiosClient from './axiosClient';

// Kiểu dữ liệu gửi lên (Payload)
export interface LoginPayload {
    email: string;
    passwordHash: string; // Lưu ý: Backend bạn đặt tên là passwordHash hay password? 
    // Thường API login nhận "password", backend mới hash. 
    // Ở đây tôi để "password" cho chuẩn REST API thường gặp.
}

// Kiểu dữ liệu nhận về (Response)
// Cần khớp với DTO LoginResponse từ Backend .NET của bạn
interface LoginResponse {
    token: string;
    user: User; // Object user chứa id, fullName, roleId...
}

export const authService = {
    login: (data: { email: string; password: string }) => {
        // Đường dẫn này sẽ nối vào baseURL -> https://localhost:7016/api/Auth/login
        return axiosClient.post<LoginResponse>('/Auth/login', data);
    },
};