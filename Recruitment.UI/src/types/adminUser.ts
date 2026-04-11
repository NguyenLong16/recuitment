// Types cho Admin User Management
export interface AdminUser {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    avatarUrl: string | null;
    roleName: string;
    companyName: string | null;
    createdDate: string;
    isActive: boolean;
}

// Filter params cho API
export interface AdminUserFilter {
    keyword?: string;
    roleId?: number;
}
