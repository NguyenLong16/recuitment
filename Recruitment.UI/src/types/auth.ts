export interface User {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    role: string;
    avatarUrl: string;
    token?: string;
}

export enum Role {
    Admin = 'Admin',
    Employer = 'Employer',
    Candidate = 'Candidate'
}

export interface LoginResponse {
    token: string;
    user: User; // <--- fullName và roleId nằm trong object con này
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}