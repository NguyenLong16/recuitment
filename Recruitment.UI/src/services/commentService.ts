import { AdminComment, CommentCreateRequest, CommentResponse } from "../types/comment";
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

    /** [Admin] Lấy tất cả bình luận, tìm kiếm theo keyword (tên người dùng hoặc nội dung) */
    getAdminComments: (keyword?: string): Promise<AdminComment[]> => {
        return axiosClient
            .get('/Comment/admin', { params: keyword ? { keyword } : undefined })
            .then(res => res.data);
    },

    /** [Admin] Xóa bình luận theo ID */
    deleteAdminComment: (id: number): Promise<void> => {
        return axiosClient.delete(`/Comment/admin/${id}`).then(res => res.data);
    },
};

export default commentService;