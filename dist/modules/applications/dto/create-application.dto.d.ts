export declare enum AppStatus {
    APPLIED = "APPLIED",
    HR = "HR",
    INTERVIEW = "INTERVIEW",
    TECH = "TECH",
    OFFER = "OFFER",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN",
    HIRED = "HIRED"
}
export declare class CreateApplicationDto {
    title: string;
    company: string;
    location?: string;
    source?: string;
    status?: AppStatus;
    salaryMin?: number;
    salaryMax?: number;
    jobPostingUrl?: string;
    description?: string;
}
