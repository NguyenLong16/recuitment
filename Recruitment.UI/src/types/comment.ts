export interface CommentResponse {
    id: number;
    content: string;
    createdDate: string;
    userName: string;
    userAvatar: string;
    userId: number;
    parentId?: number | null;
    replies?: CommentResponse[];
}

export interface CommentCreateRequest {
    content: string;
    parentId?: number | null;
}