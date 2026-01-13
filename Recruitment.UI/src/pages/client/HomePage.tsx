import { useState } from "react"
import JobCard from "../../components/common/Clients/JobCard"
import { Button, Card, Col, Empty, Pagination, Row, Spin, Typography } from "antd"
import useJobMasterData from "../../hooks/useJobMasterData"
import { JobFilterForm } from "../../components/common/JobFilterForm"
import { useJobFilter } from "../../hooks/useJobFilter"

const { Title, Text } = Typography

// const PRIMARY_COLOR = "#00B14F"

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12
    const { categories, locations, skills } = useJobMasterData()
    const { jobs, isLoading, filters, updateFilters, resetFilters } = useJobFilter();

    const paginatedJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handleReset = () => {
        setCurrentPage(1)
        resetFilters()
    }

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Search Section */}
                <div className="bg-gradient-to-br from-[#00B14F] to-[#00a347] px-4 py-8 ">
                    <div className="max-w-4xl mx-auto">
                        <Title level={2} className="!text-white !text-center !mb-2">
                            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
                        </Title>
                        <Text className="text-white/90 text-center block mb-5">
                            Tiếp cận <strong className="text-white">{jobs.length}+</strong> tin tuyển dụng việc làm mỗi ngày
                        </Text>

                        {/* Search Box - reduced border radius and padding */}
                        <Card title="Tìm kiếm việc làm" style={{ marginBottom: 24 }}>
                            <JobFilterForm
                                filters={filters}
                                onFilterChange={updateFilters}
                                onReset={resetFilters}
                                locations={locations}
                                categories={categories}
                                skills={skills}
                            />
                        </Card>
                    </div>
                </div>
            </div>

            {/* Main Content - reduced padding */}
            <div className="max-w-7xl mx-auto pb-8">
                {/* Section Header - reduced margin */}
                <div className="flex justify-between items-center mb-4">
                    <Title level={3} className="!m-0">
                        <span className="text-[#00B14F]">Việc làm</span> tốt nhất
                    </Title>
                    <Text type="secondary">
                        Tìm thấy <strong className="text-[#00B14F]">{jobs.length}</strong> việc làm phù hợp
                    </Text>
                </div>

                {/* Job List */}
                {isLoading ? (
                    <div className="text-center py-16">
                        <Spin size="large" />
                        <div className="mt-4 text-gray-400">Đang tải việc làm...</div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <Empty description="Không tìm thấy việc làm phù hợp" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        <Button type="primary" className="mt-4 !bg-[#00B14F] border-[#00B14F]" onClick={handleReset}>
                            Xem tất cả việc làm
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Reduced gap between cards */}
                        <Row gutter={[12, 12]}>
                            {paginatedJobs.map((job) => (
                                <Col xs={24} md={12} lg={8} key={job.id}>
                                    <JobCard job={job} />
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination - reduced padding and border radius */}
                        <div className="text-center mt-6 p-4 bg-white rounded-lg">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={jobs.length}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                                showTotal={(total, range) => `${range[0]}-${range[1]} trong ${total} việc làm`}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default HomePage
