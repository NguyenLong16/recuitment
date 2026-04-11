// Types cho Location
export interface Location {
    id: number;
    name: string;
}

// Request types
export interface CreateLocationRequest {
    name: string;
}

export interface UpdateLocationRequest {
    name: string;
}