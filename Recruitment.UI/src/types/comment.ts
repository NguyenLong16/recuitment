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

/** Type dành cho Admin quản lý bình luận */
export interface AdminComment {
    id: number;
    content: string;
    createdDate: string;
    isReply: boolean;
    commenterName: string;
    jobTitle: string;
    companyName: string;
}