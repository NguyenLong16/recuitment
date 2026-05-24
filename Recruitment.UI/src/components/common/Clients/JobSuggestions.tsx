import { useEffect, useState, useCallback } from "react";
import {
    Button,
    Card,
    Empty,
    Progress,
    Skeleton,
    Tag,
    Typography,
} from "antd";
import { CalendarOutlined, DollarOutlined, EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { JobSuggestionResponse } from "../../../types/profile";
import UserSkillService from "../../../services/userSkillService";

const { Text } = Typography;
const PRIMARY_COLOR = "#00B14F";

const PLACEHOLDER = "https://via.placeholder.com/56x56?text=Logo";

interface JobSuggestionsProps {
    hasSkills: boolean;
}

const JobSuggestions = ({ hasSkills }: JobSuggestionsProps) => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState<JobSuggestionResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await UserSkillService.getJobSuggestions();
            setSuggestions(res.data);
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasSkills) {
            fetchSuggestions();
        }
    }, [hasSkills, fetchSuggestions]);

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return "Thương lượng";
        const fmt = (v: number) => (v / 1_000_000).toFixed(0) + " tr";
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Tới ${fmt(max!)}`;
    };

    const buildLogoUrl = (url?: string) => {
        if (!url) return PLACEHOLDER;
        return url.startsWith("http") ? url : `https://localhost:7016${url}`;
    };

    const daysLeft = (deadline: string) => {
        if (!deadline || !dayjs(deadline).isValid()) return null;
        return dayjs(deadline).diff(dayjs(), "day");
    };

    const jobTypeLabel = (type: string) => {
        const map: Record<string, { label: string; color: string }> = {
            FullTime: { label: "Toàn thời gian", color: "blue" },
            PartTime: { label: "Bán thời gian", color: "purple" },
            Remote: { label: "Remote", color: "geekblue" },
            Internship: { label: "Thực tập", color: "pink" },
            Contract: { label: "Hợp đồng", color: "cyan" },
        };
        return map[type] ?? { label: type, color: "default" };
    };

    if (!hasSkills) {
        return (
            <Card
                title={
                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ThunderboltOutlined className="text-yellow-400 text-xl" />
                        <span>Công việc gợi ý cho bạn</span>
                    </span>
                }
                className="shadow-md rounded-2xl border-0 mb-6"
            >
                <Empty
                    description={
                        <Text type="secondary" className="text-sm">
                            Thêm kỹ năng vào hồ sơ để nhận gợi ý công việc phù hợp
                        </Text>
                    }
                />
            </Card>
        );
    }

    return (
        <Card
            title={
                <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ThunderboltOutlined className="text-yellow-400 text-xl" />
                    <span>Công việc gợi ý cho bạn</span>
                    {suggestions.length > 0 && (
                        <Tag color={PRIMARY_COLOR} className="!ml-1 !text-xs !font-medium">
                            {suggestions.length} việc làm
                        </Tag>
                    )}
                </span>
            }
            className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300"
        >
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} active avatar paragraph={{ rows: 2 }} />
                    ))}
                </div>
            ) : suggestions.length === 0 ? (
                <Empty
                    description={
                        <Text type="secondary" className="text-sm">
                            Chưa có công việc nào phù hợp với kỹ năng hiện tại
                        </Text>
                    }
                />
            ) : (
                <div className="space-y-3">
                    {suggestions.map((job) => {
                        const left = daysLeft(job.deadline);
                        const expired = left !== null && left < 0;
                        const logoSrc = buildLogoUrl(job.imageUrl || job.companyLogoUrl);
                        const jt = jobTypeLabel(job.jobType);
                        return (
                            <div
                                key={job.id}
                                onClick={() => navigate(`/job/${job.id}`)}
                                className="group flex gap-3 p-3 sm:p-4 bg-white rounded-xl
                                           border border-gray-100
                                           hover:border-emerald-300 hover:shadow-md
                                           cursor-pointer transition-all duration-200"
                            >
                                {/* Logo */}
                                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg
                                                border border-gray-200 bg-gray-50
                                                flex items-center justify-center overflow-hidden">
                                    <img
                                        src={logoSrc}
                                        alt={job.companyName}
                                        className="w-full h-full object-contain p-1.5"
                                        onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                    />
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0">
                                    {/* Title + match score */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h3 className="m-0 mb-0.5 text-[13px] sm:text-sm md:text-[15px]
                                                            font-semibold text-gray-800 truncate
                                                            group-hover:text-[#00B14F] transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="m-0 mb-1.5 text-[11px] sm:text-xs text-gray-500 truncate">
                                                {job.companyName}
                                            </p>
                                        </div>
                                        {/* Match circle */}
                                        <div className="flex-shrink-0 flex flex-col items-center">
                                            <div className="text-[9px] text-gray-400 mb-0.5 leading-none">Phù hợp</div>
                                            <Progress
                                                type="circle"
                                                percent={job.matchScore}
                                                size={38}
                                                strokeColor={
                                                    job.matchScore >= 70 ? PRIMARY_COLOR
                                                        : job.matchScore >= 40 ? "#faad14"
                                                            : "#ff4d4f"
                                                }
                                                format={(p) => (
                                                    <span className="text-[9px] font-bold leading-none">{p}%</span>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Tags row: salary + location + jobType */}
                                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-1.5">
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                                          bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium">
                                            <DollarOutlined className="text-[10px]" />
                                            {formatSalary(job.salaryMin, job.salaryMax)}
                                        </span>
                                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                                          bg-gray-100 text-gray-600 text-[10px] sm:text-xs">
                                            <EnvironmentOutlined className="text-[10px]" />
                                            <span className="max-w-[80px] sm:max-w-none truncate">{job.locationName}</span>
                                        </span>
                                        {job.jobType && (
                                            <Tag
                                                color={jt.color}
                                                className="!m-0 !px-1.5 !py-0.5 !text-[10px] sm:!text-xs !leading-none
                                                           inline-flex items-center gap-0.5"
                                            >
                                                <Briefcase className="w-2.5 h-2.5 inline-block mr-0.5" />
                                                {jt.label}
                                            </Tag>
                                        )}
                                        {left !== null && (
                                            <span className={`inline-flex items-center gap-0.5 text-[10px] sm:text-xs
                                                              ${expired ? "text-red-500" : left <= 3 ? "text-orange-500" : "text-gray-500"}`}>
                                                <CalendarOutlined className="text-[10px]" />
                                                {expired ? "Đã hết hạn" : left === 0 ? "Hết hạn hôm nay" : `Còn ${left} ngày`}
                                            </span>
                                        )}
                                    </div>

                                    {/* Matched skills */}
                                    {job.matchedSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {job.matchedSkills.slice(0, 4).map((skill) => (
                                                <Tag
                                                    key={skill}
                                                    color="green"
                                                    className="!m-0 !text-[10px] sm:!text-xs !px-1.5 !py-0 !leading-5 !rounded-full"
                                                >
                                                    {skill}
                                                </Tag>
                                            ))}
                                            {job.matchedSkills.length > 4 && (
                                                <Tag className="!m-0 !text-[10px] sm:!text-xs !px-1.5 !py-0 !leading-5 !rounded-full !bg-gray-100 !text-gray-500">
                                                    +{job.matchedSkills.length - 4}
                                                </Tag>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {suggestions.length >= 20 && (
                        <div className="text-center pt-2">
                            <Button
                                type="link"
                                onClick={() => navigate("/jobs")}
                                className="!text-[#00B14F] font-medium"
                            >
                                Xem thêm công việc →
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};

export default JobSuggestions;
