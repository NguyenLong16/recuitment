export interface EducationDto {
    id: number;
    schoolName: string;
    major: string;
    startDate: string;
    endDate?: string;
}

export interface ExperienceDto {
    id: number;
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate?: string;
}

export interface CompanyResponse {
    id: number;
    companyName: string;
    logoUrl?: string;
    description?: string;
    websiteLink?: string;
    address?: string;
    size: number;
}

export interface JobResponseForProfile {
    id: number;
    title: string;
    companyName: string;
    locationName: string;
    salaryMin?: number;
    salaryMax?: number;
    deadline: string;
}

export interface UserProfileResponse {
    id: number;
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    professionalTitle?: string;
    bio?: string;
    address?: string;
    roleName?: string;
    // Social Links
    websiteUrl?: string;
    linkedInUrl?: string;
    gitHubUrl?: string;
    // Arrays
    educations?: EducationDto[];
    experiences?: ExperienceDto[];
    defaultCvUrl?: string;
    // HR specific
    company?: CompanyResponse;
    postedJobs?: JobResponseForProfile[];
    followerCount: number;
    isFollowing: boolean; // Trạng thái người xem có đang follow người này không
}

export interface UpdateProfileRequest {
    fullName?: string;
    phoneNumber?: string;
    professionalTitle?: string;
    bio?: string;
    address?: string;
    websiteUrl?: string;
    linkedInUrl?: string;
    gitHubUrl?: string;
    avatarFile?: File;
    coverFile?: File;
    cvFile?: File;
}