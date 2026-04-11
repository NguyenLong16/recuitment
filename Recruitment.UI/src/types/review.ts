export interface ReviewResponse {
    id: number;
    rating: number;
    comment?: string;
    createdDate: string;
    userName: string;
    userAvatar: string;
}

/** Wrapper object trả về từ GET /Review/job/{jobId} */
export interface JobReviewsResponse {
    averageRating: number;
    totalReviews: number;
    starCounts: Record<string, number>;
    reviews: ReviewResponse[];
}

export interface ReviewCreateRequest {
    rating: number;
    comment?: string;
}

/** Type dành cho Admin quản lý đánh giá */
export interface AdminReview {
    id: number;
    rating: number;
    comment: string;
    createdDate: string;
    reviewerName: string;
    jobTitle: string;
    companyName: string;
}