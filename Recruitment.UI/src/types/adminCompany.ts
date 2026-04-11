// Types cho Admin Company Management
export interface AdminCompany {
    id: number;
    companyName: string;
    logoUrl: string | null;
    websiteLink: string | null;
    address: string | null;
    size: number;
    totalJobs: number;
}
