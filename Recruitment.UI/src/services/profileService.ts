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

        // Thông tin cơ bản
        if (data.fullName) formData.append('FullName', data.fullName);
        if (data.phoneNumber) formData.append('PhoneNumber', data.phoneNumber);

        // Thông tin bổ sung
        if (data.professionalTitle) formData.append('ProfessionalTitle', data.professionalTitle);
        if (data.bio) formData.append('Bio', data.bio);
        if (data.address) formData.append('Address', data.address);

        // Social links (có thể null để xóa)
        if (data.websiteUrl !== undefined) formData.append('WebsiteUrl', data.websiteUrl || '');
        if (data.linkedInUrl !== undefined) formData.append('LinkedInUrl', data.linkedInUrl || '');
        if (data.gitHubUrl !== undefined) formData.append('GitHubUrl', data.gitHubUrl || '');

        // Thêm files
        if (data.avatarFile) formData.append('AvatarFile', data.avatarFile);
        if (data.coverFile) formData.append('CoverFile', data.coverFile);
        if (data.cvFile) formData.append('CvFile', data.cvFile);

        // DEBUG: Log để kiểm tra dữ liệu gửi lên
        console.log('📤 Update Profile Request:');
        console.log('- Avatar:', data.avatarFile?.name || 'null');
        console.log('- Cover:', data.coverFile?.name || 'null');
        console.log('- CV:', data.cvFile?.name || 'null');

        // Log tất cả entries trong FormData
        for (const [key, value] of formData.entries()) {
            console.log(`  FormData[${key}]:`, value instanceof File ? `File(${value.name})` : value);
        }

        return axiosClient.put<UserProfileResponse>('/Profile/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    followHR: (employerId: number) => {
        return axiosClient.post(`/Profile/follow/${employerId}`)
    },

    unfollowHR: (employerId: number) => {
        return axiosClient.delete(`/Profile/unfollow/${employerId}`)
    }
}

export default ProfileService