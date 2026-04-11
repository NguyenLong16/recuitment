import axiosClient from "./axiosClient";
import { AdminReview, JobReviewsResponse, ReviewCreateRequest } from "../types/review";
const ReviewService = {
    // Lấy danh sách review theo job
    getJobReviews: (jobId: number): Promise<JobReviewsResponse> => {
        return axiosClient.get<JobReviewsResponse>(`/Review/job/${jobId}`).then(res => res.data);
    },
    // Đăng review mới
    postReview: (jobId: number, request: ReviewCreateRequest) => {
        return axiosClient.post(`/Review/job/${jobId}`, request);
    },
    // [Admin] Lấy tất cả review, lọc theo keyword và/hoặc rating
    getAdminReviews: (keyword?: string, rating?: number): Promise<AdminReview[]> => {
        const params: Record<string, any> = {};
        if (keyword) params.keyword = keyword;
        if (rating !== undefined && rating !== null) params.rating = rating;
        return axiosClient.get('/Review/admin', { params }).then(res => res.data);
    },
    // [Admin] Xóa review theo ID
    deleteAdminReview: (id: number): Promise<void> => {
        return axiosClient.delete(`/Review/admin/${id}`).then(res => res.data);
    },
};
export default ReviewService;