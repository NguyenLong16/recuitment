import axiosClient from "./axiosClient";
import { ReviewCreateRequest } from "../types/review";
const ReviewService = {
    // Đăng review mới
    postReview: (jobId: number, request: ReviewCreateRequest) => {
        return axiosClient.post(`/Review/job/${jobId}`, request);
    },
};
export default ReviewService;