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
        <>
            <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                {/* Hero Search Section */}
                <div className="relative bg-gradient-to-br from-[#00B14F] via-[#00a347] to-[#008f3d] px-4 py-12 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-4">
                            <Title level={1} className="!text-white !mb-2 !text-3xl md:!text-4xl !font-bold">
                                Tìm việc làm nhanh 24h
                            </Title>
                            <div className="flex items-center justify-center gap-2 text-white/90">
                                <Text className="text-white/90 text-base">
                                    Tiếp cận
                                </Text>
                                <span className="bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-white font-bold text-base">
                                    {jobs.length}+
                                </span>
                                <Text className="text-white/90 text-base">
                                    tin tuyển dụng mỗi ngày
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content - Split Layout */}
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowMobileFilter(!showMobileFilter)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            <FilterOutlined />
                            {showMobileFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* ====== LEFT: Filter Sidebar ====== */}
                        <div className={`lg:w-[300px] xl:w-[320px] flex-shrink-0 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-gray-100 p-5 sticky top-4">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                                    <SearchOutlined className="text-[#00B14F] text-lg" />
                                    <h3 className="text-base font-semibold text-gray-800 m-0">Bộ lọc tìm kiếm</h3>
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                                <div>
                                    <Title level={3} className="!m-0 !mb-1">
                                        <span className="text-[#00B14F]">Việc làm</span>{" "}
                                        <span className="text-gray-800">tốt nhất</span>
                                    </Title>
                                    <Text type="secondary">
                                        Cơ hội nghề nghiệp đang chờ đón bạn
                                    </Text>
                                </div>
                                <div className="bg-[#00B14F]/10 px-4 py-2 rounded-lg border border-[#00B14F]/20">
                                    <Text className="text-gray-600 text-sm">
                                        Tìm thấy{" "}
                                        <strong className="text-[#00B14F] text-lg">{jobs.length}</strong>{" "}
                                        việc làm
                                    </Text>
                                </div>
                            </div>

                            {/* Job List */}
                            {isLoading ? (
                                <div className="text-center py-24">
                                    <Spin size="large" />
                                    <div className="mt-6 text-gray-500 text-lg">Đang tải việc làm...</div>
                                </div>
                            ) : jobs.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                                    <Empty
                                        description={
                                            <span className="text-gray-500 text-lg">
                                                Không tìm thấy việc làm phù hợp với tiêu chí của bạn
                                            </span>
                                        }
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        className="my-8"
                                    />
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="mt-4 !bg-[#00B14F] hover:!bg-[#00a347] border-0 !h-11 !px-6 !rounded-lg !text-sm !font-medium shadow-md"
                                        onClick={handleReset}
                                    >
                                        Xem tất cả việc làm
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Vertical Job List */}
                                    <div className="flex flex-col gap-4">
                                        {paginatedJobs.map((job) => (
                                            <JobCard job={job} key={job.id} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="text-center mt-8">
                                        <div className="inline-block bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={jobs.length}
                                                onChange={handlePageChange}
                                                showSizeChanger={false}
                                                showTotal={(total, range) => (
                                                    <span className="text-gray-600 text-sm">
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

            </div>
        </>
    )
}

export default HomePage
