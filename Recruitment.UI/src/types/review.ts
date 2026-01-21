export interface ReviewResponse {
    id: number;
    rating: number;
    comment?: string;
    createdDate: string;
    userName: string;
    userAvatar: string;
}

export interface ReviewCreateRequest {
    rating: number;
    comment?: string;
}