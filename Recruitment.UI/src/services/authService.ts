// src/services/authService.ts
import { AuthResponse, RegisterPayload, RefreshTokenRequest } from '../types/auth';
import axiosClient from './axiosClient';

export const authService = {
    login: (data: { email: string; password: string }) => {
        return axiosClient.post<AuthResponse>('/Auth/login', data);
    },

    register: (data: RegisterPayload) => {
        return axiosClient.post('Auth/register', data);
    },

    refreshToken: (data: RefreshTokenRequest) => {
        return axiosClient.post<AuthResponse>('/Auth/refresh-token', data);
    },

    logout: (data: RefreshTokenRequest) => {
        return axiosClient.post('/Auth/logout', data);
    },
};