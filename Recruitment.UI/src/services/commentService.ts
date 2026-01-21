import { CommentCreateRequest, CommentResponse } from "../types/comment";
import axiosClient from "./axiosClient";

const commentService = {
    getJobComment: (jobId: number): Promise<CommentResponse[]> => {
        return axiosClient.get(`/Comment/job/${jobId}`).then(res => res.data)
    },

    postComment: (jobId: number, request: CommentCreateRequest) => {
        return axiosClient.post(`/Comment/job/${jobId}`, request);
    },
}

export default commentService