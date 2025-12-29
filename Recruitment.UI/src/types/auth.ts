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

// Kiểu dữ liệu gửi lên (Payload)
export interface LoginPayload {
    email: string;
    passwordHash: string; // Lưu ý: Backend bạn đặt tên là passwordHash hay password? 
    // Thường API login nhận "password", backend mới hash. 
    // Ở đây tôi để "password" cho chuẩn REST API thường gặp.
}

// Kiểu dữ liệu nhận về (Response)
// Cần khớp với DTO LoginResponse từ Backend .NET của bạn
export interface LoginResponse {
    token: string;
    user: User; // Object user chứa id, fullName, roleId...
}

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    roleId: number;
}