import { UpdateProfileRequest, UserProfileResponse } from "../types/profile"
import axiosClient from "./axiosClient"

const ProfileService = {
    getProfile: (userId: number) => {
        return axiosClient.get<UserProfileResponse>(`/Profile/${userId}`)
    },

    getMyProfile: () => {
        return axiosClient.get<UserProfileResponse>(`/Profile/me`)
    },

    updateProfile: (data: UpdateProfileRequest) => {
        const formData = new FormData();

        // Luôn append text fields (kể cả chuỗi rỗng) để server nhận đủ
        formData.append('FullName', data.fullName ?? '');
        formData.append('PhoneNumber', data.phoneNumber ?? '');
        formData.append('ProfessionalTitle', data.professionalTitle ?? '');
        formData.append('Bio', data.bio ?? '');
        formData.append('Address', data.address ?? '');
        formData.append('WebsiteUrl', data.websiteUrl ?? '');
        formData.append('LinkedInUrl', data.linkedInUrl ?? '');
        formData.append('GitHubUrl', data.gitHubUrl ?? '');

        // Chỉ append file nếu có chọn
        if (data.avatarFile) formData.append('AvatarFile', data.avatarFile);
        if (data.coverFile) formData.append('CoverFile', data.coverFile);
        if (data.cvFile) formData.append('CvFile', data.cvFile);

        return axiosClient.put<UserProfileResponse>('/Profile/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    followHR: (employerId: number) => {
        return axiosClient.post(`/Profile/follow/${employerId}`)
    },

    unfollowHR: (employerId: number) => {
        return axiosClient.delete(`/Profile/unfollow/${employerId}`)
    },

    watchFollowerOfHR: (id: number) => {
        return axiosClient.get(`/Profile/${id}/followers`)
    }
}

export default ProfileService