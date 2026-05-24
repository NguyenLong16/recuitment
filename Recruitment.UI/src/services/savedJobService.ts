import axiosClient from "./axiosClient"

const savedJobService = {
    toggleSavedJob: (jobId: number) => {
        return axiosClient.post(`SavedJob/${jobId}`)
    },
    getSavedJobs: () => {
        return axiosClient.get('SavedJob')
    }
}

export default savedJobService