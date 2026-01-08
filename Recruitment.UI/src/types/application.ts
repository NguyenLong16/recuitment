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

export enum ApplicationStatus {
    Submitted = 0,  // Đã nộp
    Viewed = 1,     // Đã xem
    Interview = 2,  // Phỏng vấn
    Rejected = 3,   // Từ chối
    Accepted = 4    // Trúng tuyển
}

export interface ApplicationForHR {
    id: number;
    candidateName: string;
    candidateEmail: string;
    appliedDate: string;
    status: ApplicationStatus;
    resumeUrl: string;
    coverLetter?: string;
}