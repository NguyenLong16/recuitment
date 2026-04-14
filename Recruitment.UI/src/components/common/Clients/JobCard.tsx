import { message } from "antd";
import { JobCardProps } from "../../../types/application";
import dayjs from "dayjs";
import { Clock, DollarSign, MapPin, Flame, User, Bookmark } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import savedJobService from "../../../services/savedJobService";

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=Logo';

const JobCard = ({ job }: JobCardProps) => {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const [isSaved, setIsSaved] = useState(job.isSaved || false);
    const [saving, setSaving] = useState(false);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) { message.warning('Vui lòng đăng nhập để lưu công việc'); return; }
        setSaving(true);
        try {
            const response = await savedJobService.toggleSavedJob(job.id);
            setIsSaved(!isSaved);
            message.success(response.data.message);
        } catch {
            message.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return 'Thương lượng';
        const fmt = (v: number) => (v / 1_000_000).toFixed(0) + ' tr';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Tới ${fmt(max!)}`;
    };

    const imgSrc = job.imageUrl
        ? (job.imageUrl.startsWith('http') ? job.imageUrl : `https://localhost:7016${job.imageUrl}`)
        : PLACEHOLDER;

    const isNew = dayjs().diff(dayjs(job.createdDate), 'day') <= 3;
    const isHot = (job.salaryMin && job.salaryMin >= 20_000_000) ||
                  (job.salaryMax && job.salaryMax >= 30_000_000);

    const daysLeft = dayjs(job.deadline).diff(dayjs(), 'day');

    return (
        <div
            onClick={() => navigate(`/job/${job.id}`)}
            className="relative w-full bg-white rounded-xl cursor-pointer
                        border border-gray-100
                        shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                        hover:shadow-[0_6px_24px_rgba(0,177,79,0.15)]
                        hover:border-emerald-200
                        hover:-translate-y-0.5
                        transition-all duration-200 ease-in-out
                        overflow-hidden
                        /* ── Padding responsive ── */
                        p-3 sm:p-4"
        >
            {/* ── HOT / NEW badge ────────────────────────────────────────────── */}
            {(isHot || isNew) && (
                <div className="absolute top-2.5 right-2.5 z-10 flex gap-1">
                    {isHot && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                         bg-red-500 text-white text-[10px] sm:text-xs font-semibold">
                            <Flame className="w-2.5 h-2.5" /> HOT
                        </span>
                    )}
                    {isNew && !isHot && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded
                                         bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold">
                            Mới
                        </span>
                    )}
                </div>
            )}

            {/* ── TOP ROW: logo + info ────────────────────────────────────────── */}
            <div className="flex gap-2.5 sm:gap-3">

                {/* Logo
                    sm : 56×56
                    md : 64×64
                    lg : 72×72  */}
                <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]
                                    rounded-lg bg-gray-50 border border-gray-200
                                    flex items-center justify-center overflow-hidden">
                        <img
                            src={imgSrc}
                            alt={job.companyName}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                        />
                    </div>
                </div>

                {/* Text info */}
                <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                    {/* Job title */}
                    <h3
                        className="m-0 mb-0.5 truncate font-semibold text-gray-800
                                   text-[13px] sm:text-sm md:text-[15px]"
                        title={job.title}
                    >
                        {job.title}
                    </h3>

                    {/* Company */}
                    <p className="mb-2 truncate text-gray-500
                                  text-[11px] sm:text-xs md:text-[13px]">
                        {job.companyName || 'Công ty chưa cập nhật'}
                    </p>

                    {/* Tags: lương + địa điểm + ngành
                        sm : chỉ lương + địa điểm (ẩn ngành)
                        md : cả 3 tag */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {/* Lương */}
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                          bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-medium">
                            <DollarSign className="w-2.5 h-2.5 flex-shrink-0" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>

                        {/* Địa điểm */}
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded
                                          bg-gray-100 text-gray-600 text-[10px] sm:text-xs">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="max-w-[80px] sm:max-w-none truncate">{job.locationName}</span>
                        </span>

                        {/* Ngành — ẩn trên sm */}
                        {job.categoryName && (
                            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded
                                              bg-amber-50 text-amber-600 text-[10px] sm:text-xs">
                                {job.categoryName}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── BOTTOM ROW: meta + save ─────────────────────────────────────── */}
            <div className="flex justify-between items-center
                            mt-2.5 sm:mt-3 pt-2.5 sm:pt-3
                            border-t border-gray-100">

                {/* Left meta */}
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    {/* Employer — ẩn trên sm nếu không đủ chỗ */}
                    {job.employerName && (
                        <a
                            href={`/profile/${job.employerId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden sm:flex items-center gap-1
                                       text-[11px] sm:text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[160px]">{job.employerName}</span>
                        </a>
                    )}

                    {/* Deadline */}
                    <span className={`inline-flex items-center gap-1
                                      text-[10px] sm:text-xs font-medium
                                      ${daysLeft <= 3 ? 'text-red-500' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        {daysLeft > 0 ? `Còn ${daysLeft} ngày` : 'Đã hết hạn'}
                    </span>
                </div>

                {/* Bookmark button */}
                <button
                    onClick={handleToggleSave}
                    disabled={saving}
                    aria-label={isSaved ? 'Bỏ lưu' : 'Lưu việc làm'}
                    className={`p-1.5 rounded-lg transition-all
                                ${isSaved
                                    ? 'text-emerald-500 bg-emerald-50'
                                    : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50'}
                                ${saving ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <Bookmark
                        className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                        fill={isSaved ? '#00B14F' : 'none'}
                        strokeWidth={2}
                    />
                </button>
            </div>
        </div>
    );
};

export default JobCard;
