import { JobRequest } from "../types/job"
import axiosClient from "./axiosClient"

const JobService = {
    getMyJobs: () => {
        return axiosClient.get('/Job/my-jobs')
    },

    getJobById: (id: number) => {
        return axiosClient.get(`/Job/${id}`)
    },

    createJob: (data: JobRequest) => {
        return axiosClient.post('/Job', data)
    },

    updateJob: (id: number, data: JobRequest) => {
        return axiosClient.put(`/Job/${id}`, data)
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

    uploadJobImage: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return axiosClient.post('/Job/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

export default JobService