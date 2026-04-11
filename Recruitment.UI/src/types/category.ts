// Types cho Category
export interface Category {
    id: number;
    name: string;
}

// Request types
export interface CreateCategoryRequest {
    name: string;
}

export interface UpdateCategoryRequest {
    name: string;
}