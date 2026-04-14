// Thông tin user lưu trong Redux state
export interface User {
    fullName: string;
    role: string;
}

export enum Role {
    Admin = 'Admin',
    Employer = 'Employer',
    Candidate = 'Candidate'
}

// Response trả về từ API login / refresh-token
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    fullName: string;
    role: string;
}

// Giữ alias LoginResponse để không phá vỡ import cũ
export type LoginResponse = AuthResponse;

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    roleId: number;
}