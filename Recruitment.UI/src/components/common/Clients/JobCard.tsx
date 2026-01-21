import { message } from "antd";
import { JobCardProps } from "../../../types/application";
import dayjs from "dayjs";
import { Clock, DollarSign, MapPin, Flame, User, Bookmark } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import savedJobService from "../../../services/savedJobService";

const JobCard = ({ job }: JobCardProps) => {
    const navigate = useNavigate();
    // Lấy user từ Redux store
    const user = useSelector((state: RootState) => state.auth.user);

    const [isSaved, setIsSaved] = useState(job.isSaved || false)
    const [saving, setSaving] = useState(false)

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // Check login từ Redux
        if (!user) {
            message.warning('Vui lòng đăng nhập để lưu công việc')
            return
        }

        setSaving(true)
        try {
            const response = await savedJobService.toggleSavedJob(job.id)
            setIsSaved(!isSaved)
            message.success(response.data.message)
        } catch (error) {
            message.error('Có lỗi xảy ra');
        } finally {
            setSaving(false)
        }
    }

    const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=Logo';

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return 'Thương lượng';
        const fmt = (val: number) => (val / 1000000).toFixed(0) + ' triệu';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Tới ${fmt(max!)}`;
    };

    const imgSrc = job.imageUrl
        ? (job.imageUrl.startsWith('http') ? job.imageUrl : `https://localhost:7016${job.imageUrl}`)
        : PLACEHOLDER;

    const isNew = dayjs().diff(dayjs(job.createdDate), 'day') <= 3;
    const isHot = (job.salaryMin && job.salaryMin >= 20000000) || (job.salaryMax && job.salaryMax >= 30000000);

    return (
        <div
            onClick={() => handleNavigate(`/job/${job.id}`)}
            className="relative h-full rounded-xl border-none shadow-sm bg-white p-4 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-[#00B14F] hover:-translate-y-0.5 overflow-hidden"
        >
            {(isHot || isNew) && (
                <div className="absolute top-3 right-3 z-10">
                    {isHot && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ff4d4f] text-white text-xs font-medium">
                            <Flame className="w-3 h-3" /> HOT
                        </span>
                    )}
                    {isNew && !isHot && (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-[#00B14F] text-white text-xs font-medium">
                            Mới
                        </span>
                    )}
                </div>
            )}

            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <div className="w-[72px] h-[72px] rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={job.companyName}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = PLACEHOLDER;
                            }}
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3
                        className="m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold text-[#333]"
                        title={job.title}
                    >
                        {job.title}
                    </h3>

                    <p className="block mb-2.5 text-[13px] text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                        {job.companyName || 'Công ty chưa cập nhật'}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#e8f5e9] text-[#00B14F] border-none text-xs font-medium">
                            <DollarSign className="w-3 h-3" /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-600 border-none text-xs">
                            <MapPin className="w-3 h-3" /> {job.locationName}
                        </span>
                        {job.categoryName && (
                            <span className="inline-flex items-center px-2 py-1 rounded bg-[#fff7e6] text-[#fa8c16] border-none text-xs">
                                {job.categoryName}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                    {job.employerName && (
                        <a
                            href={`/profile/${job.employerId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block"
                        >
                            <span className="text-xs text-gray-500 cursor-pointer hover:text-[#00B14F] transition-colors">
                                <User className="w-3 h-3 inline mr-1" />
                                {job.employerName}
                            </span>
                        </a>
                    )}
                    <span className="text-xs text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Còn {dayjs(job.deadline).diff(dayjs(), 'day')} ngày
                    </span>
                </div>
                <div
                    onClick={handleToggleSave}
                    className={`cursor-pointer transition-colors 
                        ${isSaved ? 'text-[#00B14F]' : 'text-gray-400 hover:text-[#00B14F]'}
                        ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Bookmark
                        className="w-[18px] h-[18px]"
                        fill={isSaved ? '#00B14F' : 'none'}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobCard;
