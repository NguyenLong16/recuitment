import axiosClient from "./axiosClient"

const savedJobService = {
    toggleSavedJob: (jobId: number) => {
        return axiosClient.post(`SavedJob/${jobId}`)
    }
}

export default savedJobService