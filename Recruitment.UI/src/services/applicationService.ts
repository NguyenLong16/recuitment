import { ApplicationStatus, ApplyJobRequest } from "../types/application"
import axiosClient from "./axiosClient";

const ApplicationService = {
    applyJob: async (data: ApplyJobRequest) => {
        const formData = new FormData();
        formData.append('jobId', data.jobId);
        formData.append('cvFile', data.resumeFile);  // Backend expects 'cvFile'
        if (data.coverLetter) {
            formData.append('coverLetter', data.coverLetter);
        }

        const response = await axiosClient.post('/Application/apply', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    getMyApplicationHistory: async () => {
        const response = await axiosClient.get('Application/my-history')
        return response.data;
    },

    getPublicJobs: async (params?: { categoryId?: number; locationId?: number; keyword?: string }) => {
        const response = await axiosClient.get('/Job', { params });
        return response.data;
    },

    getApplicationsByJob: async (jobId: number) => {
        const response = await axiosClient.get(`/Application/job/${jobId}`);
        return response.data;
    },

    updateApplicationStatus: async (id: number, status: ApplicationStatus) => {
        const response = await axiosClient.patch(`/Application/${id}/status`, status);
        return response.data;
    },

    // Lấy tất cả ứng viên đã ứng tuyển tất cả job của HR
    getAllApplicationsForHR: async () => {
        const response = await axiosClient.get('/Application/all-my-applications');
        return response.data;
    }
}

export default ApplicationService