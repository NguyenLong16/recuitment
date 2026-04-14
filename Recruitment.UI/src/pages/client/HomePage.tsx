import { useRef, useState } from "react"
import JobCard from "../../components/common/Clients/JobCard"
import { Button, Empty, Pagination, Spin, Typography } from "antd"
import useJobMasterData from "../../hooks/useJobMasterData"
import { JobFilterForm } from "../../components/common/JobFilterForm"
import { useJobFilter } from "../../hooks/useJobFilter"
import { SearchOutlined, FilterOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 10
    const { categories, locations, skills } = useJobMasterData()
    const { jobs, isLoading, filters, updateFilters, resetFilters } = useJobFilter();
    const [showMobileFilter, setShowMobileFilter] = useState(false)
    const jobListRef = useRef<HTMLDivElement>(null)

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
