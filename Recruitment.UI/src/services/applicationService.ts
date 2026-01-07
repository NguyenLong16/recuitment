import { ApplyJobRequest } from "../types/application"
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
    }
}

export default ApplicationService