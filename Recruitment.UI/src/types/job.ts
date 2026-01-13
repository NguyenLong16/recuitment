// src/types/job.ts

export enum JobType {
    FullTime = 1,
    PartTime = 2,
    Internship = 3,
    Contract = 4,
    Remote = 5
}

export enum JobStatus {
    Draft = 0,    // Ẩn (chưa đăng)
    Active = 1,   // Hiện (hiển thị)
    Closed = 2,   // Ẩn (đóng thủ công)
    Expired = 3   // Tự động ẩn khi hết hạn
}

export interface JobResponse {
    id: number;
    title: string;
    companyName?: string;
    employerName?: string; // Tên HR đăng bài
    imageUrl?: string;
    description: string;
    requirement: string;
    benefit: string;
    salaryMin?: number;
    salaryMax?: number;
    locationName: string;
    categoryName: string;
    jobType: string; // Server trả về string tên enum
    status: string;  // Server trả về string tên enum
    deadline: string;
    createdDate: string;
    skillNames: string[];
    // Các field dùng cho form edit (nếu cần map lại)
    locationId?: number;
    categoryId?: number;
    skillIds?: number[];
}

// Dùng cho Form tạo/sửa
export interface JobRequest {
    id?: number;
    title: string;
    companyName: string;
    imageUrl?: string;
    description: string;
    requirement: string;
    benefit: string;
    salaryMin?: number;
    salaryMax?: number;
    locationId: number;
    categoryId: number;
    jobType: number; // Gửi lên số (Enum value)
    deadline: string;
    skillIds: number[];
}

export interface OptionType {
    value: number;
    label: string;
}

export interface JobState {
    jobs: JobResponse[];
    loading: boolean;
    error: string | null;
}

// Form values type (dùng cho Ant Design Form)
export interface JobFormValues {
    title: string;
    companyName?: string;
    imageUrl?: string;
    description: string;
    requirement: string;
    benefit: string;
    salaryMin?: number;
    salaryMax?: number;
    locationId: number;
    categoryId: number;
    jobType: number[];
    deadline: any; // dayjs object
    skillIds: number[];
}

export interface JobFilterRequest {
    searchTerm?: string;
    companyName?: string;
    employerName?: string;
    minSalary?: number;
    maxSalary?: number;
    locationId?: number;
    categoryId?: number;
    skillId?: number[];
}