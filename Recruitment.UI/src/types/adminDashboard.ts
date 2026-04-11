export interface DashboardStats {
    userStats: {
        totalUsers: number;
        totalCandidates: number;
        totalEmployers: number;
    };
    totalCompanies: number;
    jobStats: {
        totalJobs: number;
        activeJobs: number;
        expiredJobs: number;
        closedJobs: number;
        draftJobs: number;
    };
    totalApplications: number;
}

export interface UserTrend {
  year: number;
  month: number;
  label: string;
  candidateCount: number;
  hrCount: number;
  totalCount: number;
}

export interface MetricTrend {
  year: number;
  month: number;
  label: string;
  count: number;
}

export interface DashboardTrends {
  userGrowthTrend: UserTrend[];
  jobPostingTrend: MetricTrend[];
  applicationTrend: MetricTrend[];
}

export interface DistributionData {
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardDistributions {
  applicationStatusDistribution: DistributionData[];
  jobTypeDistribution: DistributionData[];
}

export interface RankingMetric {
  rank: number;
  id: number;
  name: string;
  jobCount: number;
}

export interface CompanyRanking {
  rank: number;
  id: number;
  companyName: string;
  logoUrl: string | null;
  jobCount: number;
  applicationCount: number;
}

export interface DashboardRankings {
  topCategories: RankingMetric[];
  topSkills: RankingMetric[];
  topCompanies: CompanyRanking[];
  topLocations: RankingMetric[];
}