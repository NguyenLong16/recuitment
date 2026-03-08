import { CommentCreateRequest, CommentResponse } from "../types/comment";
import axiosClient from "./axiosClient";

const commentService = {
    /** Lấy danh sách bình luận theo jobId (flat list, tree được build ở client) */
    getJobComment: (jobId: number): Promise<CommentResponse[]> => {
        return axiosClient.get(`/Comment/job/${jobId}`).then(res => res.data);
    },

    /** Đăng bình luận mới hoặc trả lời (có parentId) */
    postComment: (jobId: number, request: CommentCreateRequest): Promise<CommentResponse> => {
        return axiosClient.post(`/Comment/job/${jobId}`, request).then(res => res.data);
    },
};

export default commentService;