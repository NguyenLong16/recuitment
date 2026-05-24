import { useEffect, useState } from 'react';
import { Button, Empty, Spin, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { JobResponse } from '../../types/job';
import savedJobService from '../../services/savedJobService';
import JobService from '../../services/jobService';
import JobCard from '../../components/common/Clients/JobCard';
import { Bookmark, Briefcase, Trash2 } from 'lucide-react';

interface SavedJobApiResponse {
    jobId: number;
    jobTitle: string;
    companyName: string;
    imageUrl?: string;
    savedDate: string;
}

const SavedJobsPage = () => {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState<JobResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedJobs = async () => {
        try {
            const response = await savedJobService.getSavedJobs();
            const data = response.data || [];
            const savedList: SavedJobApiResponse[] = Array.isArray(data) ? data : [];

            // Fetch full job details in parallel to get all fields for JobCard
            const details = await Promise.all(
                savedList.map(async (saved) => {
                    try {
                        const res = await JobService.getPublicJobDetail(saved.jobId);
                        return { ...res.data, isSaved: true } as JobResponse;
                    } catch {
                        return null;
                    }
                })
            );
            setSavedJobs(details.filter((j): j is JobResponse => j !== null));
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            setSavedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const handleUnsave = async (jobId: number) => {
        try {
            await savedJobService.toggleSavedJob(jobId);
            setSavedJobs(prev => prev.filter(j => j.id !== jobId));
            message.success('Đã bỏ lưu việc làm');
        } catch {
            message.error('Có lỗi xảy ra');
        }
    };

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl
                                        bg-gradient-to-br from-emerald-500 to-teal-600
                                        flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bookmark size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 m-0 tracking-tight">
                                Việc làm đã lưu
                            </h1>
                            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 m-0 font-medium">
                                {loading ? 'Đang tải...' : `${savedJobs.length} việc làm đã lưu`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Content ──────────────────────────────────────────────── */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 font-medium">Đang tải danh sách việc làm đã lưu...</p>
                    </div>
                ) : savedJobs.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 sm:py-24 px-4 text-center">
                        <Empty
                            description={
                                <span className="text-slate-400 text-[15px] font-medium">
                                    Bạn chưa lưu việc làm nào
                                </span>
                            }
                            image={
                                <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                                    <Briefcase size={40} className="text-emerald-300" />
                                </div>
                            }
                        >
                            <Button
                                type="primary"
                                onClick={() => navigate('/')}
                                size="large"
                                className="!rounded-xl !mt-2 !font-semibold !px-8"
                                style={{
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                                }}
                            >
                                Tìm việc ngay
                            </Button>
                        </Empty>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {savedJobs.map((job) => (
                            <div key={job.id} className="relative group">
                                <JobCard job={{ ...job, isSaved: true }} />
                                {/* Unsave overlay button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleUnsave(job.id); }}
                                    className="absolute top-3 right-3 z-20
                                               opacity-0 group-hover:opacity-100
                                               bg-red-50 hover:bg-red-100
                                               text-red-500 hover:text-red-600
                                               p-1.5 rounded-lg transition-all duration-200
                                               shadow-sm border border-red-100"
                                    title="Bỏ lưu"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobsPage;
