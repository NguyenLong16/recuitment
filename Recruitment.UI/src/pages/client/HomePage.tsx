import { useEffect, useRef, useState } from "react"
import JobCard from "../../components/common/Clients/JobCard"
import { Button, Empty, Pagination, Spin, Typography } from "antd"
import useJobMasterData from "../../hooks/useJobMasterData"
import { JobFilterForm } from "../../components/common/JobFilterForm"
import { useJobFilter } from "../../hooks/useJobFilter"
import { SearchOutlined, FilterOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { useAppSelector } from "../../hooks/hook"
import { Role } from "../../types/auth"
import { JobSuggestionResponse } from "../../types/profile"
import UserSkillService from "../../services/userSkillService"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const { Title, Text } = Typography

const PLACEHOLDER = "https://via.placeholder.com/56x56?text=Logo"
const PRIMARY_COLOR = "#00B14F"

const HomePage = () => {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const { categories, locations, skills } = useJobMasterData()
    const { jobs, isLoading, filters, updateFilters, resetFilters } = useJobFilter();
    const [showMobileFilter, setShowMobileFilter] = useState(false)
    const jobListRef = useRef<HTMLDivElement>(null)
    const { user } = useAppSelector((state) => state.auth)
    const isCandidate = user?.role === Role.Candidate

    // Job suggestions for Candidate
    const [suggestions, setSuggestions] = useState<JobSuggestionResponse[]>([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)

    useEffect(() => {
        if (!isCandidate) return
        setLoadingSuggestions(true)
        UserSkillService.getJobSuggestions()
            .then(res => setSuggestions(res.data))
            .catch(() => setSuggestions([]))
            .finally(() => setLoadingSuggestions(false))
    }, [isCandidate])

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return "Thương lượng"
        const fmt = (v: number) => (v / 1_000_000).toFixed(0) + " tr"
        if (min && max) return `${fmt(min)} - ${fmt(max)}`
        if (min) return `Từ ${fmt(min)}`
        return `Tới ${fmt(max!)}`
    }

    const buildLogoUrl = (url?: string) => {
        if (!url) return PLACEHOLDER
        return url.startsWith("http") ? url : `https://localhost:7016${url}`
    }

    const paginatedJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        jobListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const handleReset = () => {
        setCurrentPage(1)
        resetFilters()
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
            {/* ── Hero Search Section ─────────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-[#00B14F] via-[#00a347] to-[#008f3d] px-4 py-8 sm:py-12 md:py-16 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white/5 rounded-full -mr-32 -mt-32 sm:-mr-40 sm:-mt-40 md:-mr-48 md:-mt-48"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-white/5 rounded-full -ml-24 -mb-24 sm:-ml-32 sm:-mb-32 md:-ml-40 md:-mb-40"></div>

                <div className="max-w-7xl mx-auto relative z-10 px-2 sm:px-4 lg:px-8">
                    <div className="text-center mb-2 sm:mb-4">
                        <Title level={1} className="!text-white !mb-2 sm:!mb-3 !text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl !font-bold tracking-tight">
                            Tìm việc làm nhanh 24h
                        </Title>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-white/90 px-4">
                            <Text className="text-white/90 text-sm sm:text-base">
                                Tiếp cận
                            </Text>
                            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-white font-bold text-sm sm:text-base shadow-sm">
                                {jobs.length}+
                            </span>
                            <Text className="text-white/90 text-sm sm:text-base">
                                tin tuyển dụng mỗi ngày
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Job Suggestions for Candidates ─────────────────────────── */}
            {isCandidate && (loadingSuggestions || suggestions.length > 0) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 sm:p-6">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4 sm:mb-5">
                            <ThunderboltOutlined className="text-yellow-400 text-xl sm:text-2xl" />
                            <Title level={4} className="!m-0 !text-base sm:!text-lg font-bold text-gray-900">
                                Công việc gợi ý cho bạn
                            </Title>
                            {suggestions.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                                    {suggestions.length} việc làm
                                </span>
                            )}
                        </div>

                        {loadingSuggestions ? (
                            <div className="flex gap-4 overflow-hidden">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex-shrink-0 w-72 h-28 bg-gray-100 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {suggestions.map(job => {
                                    const left = dayjs(job.deadline).diff(dayjs(), "day")
                                    return (
                                        <div
                                            key={job.id}
                                            onClick={() => navigate(`/job/${job.id}`)}
                                            className="group flex-shrink-0 w-72 sm:w-80 flex gap-3 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-100 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all duration-200"
                                        >
                                            <img
                                                src={buildLogoUrl(job.companyLogoUrl)}
                                                alt={job.companyName}
                                                className="w-12 h-12 rounded-lg object-contain border border-gray-100 bg-white p-1 flex-shrink-0"
                                                onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#00B14F] truncate transition-colors leading-snug">
                                                    {job.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{job.companyName}</p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                                                        {formatSalary(job.salaryMin, job.salaryMax)}
                                                    </span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${left < 3 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                                                        {left < 0 ? "Hết hạn" : `Còn ${left} ngày`}
                                                    </span>
                                                </div>
                                                {job.matchedSkills.length > 0 && (
                                                    <p className="text-[11px] text-emerald-600 mt-1.5 truncate font-medium">
                                                        ✓ {job.matchedSkills.slice(0, 3).join(", ")}
                                                        {job.matchedSkills.length > 3 && ` +${job.matchedSkills.length - 3}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Main Content - Split Layout ─────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4 sm:mb-6">
                    <button
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl shadow-sm border font-medium transition-all duration-200
                            ${showMobileFilter
                                ? 'bg-green-50 border-green-200 text-[#00B14F]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <FilterOutlined />
                        {showMobileFilter ? 'Ẩn bộ lọc tìm kiếm' : 'Hiển thị bộ lọc tìm kiếm'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

                    {/* ====== LEFT: Filter Sidebar ====== */}
                    <div className={`lg:w-[300px] xl:w-[320px] flex-shrink-0 transition-all duration-300 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-4 sm:p-5 lg:sticky lg:top-[88px] z-10 transition-all">
                            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                <SearchOutlined className="text-[#00B14F] text-lg" />
                                <h3 className="text-base font-bold text-gray-800 m-0">Bộ lọc tìm kiếm</h3>
                            </div>
                            <JobFilterForm
                                filters={filters}
                                onFilterChange={updateFilters}
                                onReset={resetFilters}
                                locations={locations}
                                categories={categories}
                                skills={skills}
                                layout="vertical"
                            />
                        </div>
                    </div>

                    {/* ====== RIGHT: Job Listings ====== */}
                    <div className="flex-1 min-w-0" ref={jobListRef}>

                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 sm:mb-6 gap-3 sm:gap-4">
                            <div>
                                <Title level={3} className="!m-0 !mb-1 !text-[1.1rem] sm:!text-xl md:!text-2xl font-bold">
                                    <span className="text-[#00B14F]">Việc làm</span>{" "}
                                    <span className="text-gray-800">tốt nhất</span>
                                </Title>
                                <Text type="secondary" className="text-xs sm:text-sm">
                                    Cơ hội nghề nghiệp đang chờ đón bạn
                                </Text>
                            </div>
                            <div className="bg-[#00B14F]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-[#00B14F]/20 flex-shrink-0">
                                <Text className="text-gray-600 text-xs sm:text-sm">
                                    Tìm thấy{" "}
                                    <strong className="text-[#00B14F] text-sm sm:text-base lg:text-lg">{jobs.length}</strong>{" "}
                                    việc làm
                                </Text>
                            </div>
                        </div>

                        {/* Job List */}
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <Spin size="large" />
                                <div className="mt-4 sm:mt-6 text-gray-500 text-sm sm:text-base font-medium">Đang tải danh sách việc làm...</div>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
                                <Empty
                                    description={
                                        <span className="text-gray-500 text-sm sm:text-base font-medium block mt-4">
                                            Không tìm thấy việc làm phù hợp với tiêu chí của bạn
                                        </span>
                                    }
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    className="my-4 sm:my-8"
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    className="mt-2 sm:mt-4 !bg-[#00B14F] hover:!bg-[#00a347] border-0 h-10 sm:h-11 px-5 sm:px-6 !rounded-lg text-xs sm:text-sm !font-semibold shadow-md"
                                    onClick={handleReset}
                                >
                                    Xem tất cả việc làm
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Vertical Job List */}
                                <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                                    {paginatedJobs.map((job) => (
                                        <JobCard job={job} key={job.id} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center mt-6 sm:mt-8 md:mt-10 mb-6">
                                    <div className="bg-white py-2 px-3 sm:py-3 sm:px-5 rounded-xl shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={jobs.length}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                            size="small"
                                            className="sm:hidden"
                                            showTotal={(total, range) => (
                                                <span className="text-gray-600 text-[11px] font-medium hidden xs:inline-block">
                                                    {range[0]}-{range[1]} / <strong className="text-[#00B14F]">{total}</strong>
                                                </span>
                                            )}
                                        />
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={jobs.length}
                                            onChange={handlePageChange}
                                            showSizeChanger={false}
                                            className="hidden sm:block"
                                            showTotal={(total, range) => (
                                                <span className="text-gray-600 text-sm font-medium mr-4">
                                                    {range[0]}-{range[1]} trong <strong className="text-[#00B14F]">{total}</strong> việc làm
                                                </span>
                                            )}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom CSS for Pagination active state to match theme */}
            <style>{`
                .ant-pagination-item-active {
                    background-color: #00B14F !important;
                    border-color: #00B14F !important;
                }
                .ant-pagination-item-active a {
                    color: white !important;
                }
                .ant-pagination-item:hover:not(.ant-pagination-item-active) {
                    border-color: #00B14F !important;
                }
                .ant-pagination-item:hover:not(.ant-pagination-item-active) a {
                    color: #00B14F !important;
                }
            `}</style>
        </div>
    )
}

export default HomePage
