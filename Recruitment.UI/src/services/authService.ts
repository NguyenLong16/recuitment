// src/services/authService.ts
import { LoginResponse, RegisterPayload } from '../types/auth';
import axiosClient from './axiosClient';

export const authService = {
    login: (data: { email: string; password: string }) => {
        // Đường dẫn này sẽ nối vào baseURL -> https://localhost:7016/api/Auth/login
        return axiosClient.post<LoginResponse>('/Auth/login', data);
    },

    register: (data: RegisterPayload) => {
        return axiosClient.post('Auth/register', data)
    }
};