import dayjs from "dayjs"
import axiosClient from "./axiosClient"

const JobService = {
    getPublicJobs: (params?: { categoryId?: number; locationId?: number; title?: string }) => {
        return axiosClient.get('/Job', { params })
    },

    getPublicJobDetail: (id: number) => {
        return axiosClient.get(`/Job/${id}`)
    },

    getMyJobs: () => {
        return axiosClient.get('/Job/my-jobs')
    },

    getJobById: (id: number) => {
        return axiosClient.get(`/Job/${id}`)
    },

    createJob: (data: any) => {  // data: { ...fields, ImageFile?: File }
        const formData = new FormData();

        // Append fields (trừ file)
        Object.keys(data).forEach(key => {
            if (key !== 'ImageFile' && data[key] !== undefined && data[key] !== null) {
                if (key === 'deadline') {
                    formData.append(key, dayjs(data[key]).toISOString());  // ISO cho backend
                } else if (Array.isArray(data[key])) {
                    data[key].forEach((item: any) => formData.append(key, item.toString()));  // Append multiple cho array
                } else {
                    formData.append(key, data[key].toString());
                }
            }
        });

        // Append file nếu có
        if (data.ImageFile instanceof File) {
            formData.append('ImageFile', data.ImageFile);
        }

        return axiosClient.post('/Job', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // SỬA: updateJob - Tương tự
    // Trong JobService.ts: updateJob/createJob
    updateJob: (id: number, data: any) => {
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key !== 'ImageFile') {
                const value = data[key];
                if (value !== undefined && value !== null) {  // Skip null/undefined
                    if (key === 'jobType') {
                        formData.append(key, value.toString());  // "5" → Backend bind enum
                    } else if (key === 'deadline') {
                        formData.append(key, dayjs(value).toISOString());
                    } else if (Array.isArray(value)) {
                        value.forEach((item: any) => formData.append(key, item.toString()));
                    } else {
                        formData.append(key, value.toString());
                    }
                }
            }
        });

        if (data.ImageFile instanceof File) {
            formData.append('ImageFile', data.ImageFile);
        }

        // THÊM: Log FormData keys (debug)
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        return axiosClient.put(`/Job/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    deleteJob: (id: number) => {
        return axiosClient.delete(`/Job/${id}`)
    },

    toggleStatus: (id: number) => {
        return axiosClient.patch(`/Job/${id}/toggle-status`)
    },

    getCategory: () => {
        return axiosClient.get('/Category')
    },

    getLocation: () => {
        return axiosClient.get('/Location')
    },

    getSkills: () => {
        return axiosClient.get('/Skill')
    },
}

export default JobService