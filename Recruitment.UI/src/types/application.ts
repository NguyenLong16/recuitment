import { JobResponse } from "./job";

export interface ApplyJobRequest {
    jobId: string;
    resumeFile: File;
    coverLetter?: string;
}

export interface ApplicationResponseHistory {
    id: number;
    jobId: number;
    jobTitle: string;
    companyName: string;
    appliedDate: string;
    status: string;
    resumeUrl?: string;
}

export interface ApplicationState {
    applications: ApplicationResponseHistory[];
    loading: boolean;
    error: string | null;
}

export interface JobCardProps {
    job: JobResponse;
}