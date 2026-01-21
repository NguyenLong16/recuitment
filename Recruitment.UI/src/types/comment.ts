export interface CommentResponse {
    id: number;
    content: string;
    createdDate: string;
    userName: string;
    userAvatar: string;
    userId: number;
}

export interface CommentCreateRequest {
    content: string;
}