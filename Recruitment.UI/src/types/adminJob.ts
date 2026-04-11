// Types cho Admin Job Management
export enum JobStatus {
    Draft = 0,
    Active = 1,
    Closed = 2,
    Expired = 3
}

export interface AdminJob {
    id: number;
    title: string;
    companyName: string;
    employerName: string;
    categoryName: string;
    locationName: string;
    status: JobStatus;
    createdDate: string;
    deadline: string;
    totalApplications: number;
}
