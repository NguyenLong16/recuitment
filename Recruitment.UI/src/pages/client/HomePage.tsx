import { useState } from "react"
import JobCard from "../../components/common/Clients/JobCard"
import { Button, Card, Col, Empty, Pagination, Row, Spin, Typography } from "antd"
import useJobMasterData from "../../hooks/useJobMasterData"
import { JobFilterForm } from "../../components/common/JobFilterForm"
import { useJobFilter } from "../../hooks/useJobFilter"
import { SearchOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

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
            <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
                {/* Hero Search Section */}
                <div className="relative bg-gradient-to-br from-[#00B14F] via-[#00a347] to-[#008f3d] px-4 py-16 overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center mb-8">
                            <Title level={1} className="!text-white !mb-3 !text-4xl md:!text-5xl !font-bold">
                                Tìm việc làm nhanh 24h
                            </Title>
                            <Title level={3} className="!text-white/95 !font-normal !mb-4">
                                Việc làm mới nhất trên toàn quốc
                            </Title>
                            <div className="flex items-center justify-center gap-2 text-white/90">
                                <Text className="text-white/90 text-lg">
                                    Tiếp cận
                                </Text>
                                <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white font-bold text-lg">
                                    {jobs.length}+
                                </span>
                                <Text className="text-white/90 text-lg">
                                    tin tuyển dụng mỗi ngày
                                </Text>
                            </div>
                        </div>

                        {/* Search Box */}
                        <Card
                            title={
                                <span className="text-xl font-semibold text-gray-800">
                                    <SearchOutlined style={{ color: '#000000' }} /> Tìm kiếm việc làm
                                </span>
                            }
                            className="shadow-2xl rounded-2xl border-0"
                            styles={{
                                body: { padding: '24px' }
                            }}
                        >
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

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <Title level={2} className="!m-0 !mb-2">
                                <span className="text-[#00B14F]">Việc làm</span>{" "}
                                <span className="text-gray-800">tốt nhất</span>
                            </Title>
                            <Text type="secondary" className="text-base">
                                Cơ hội nghề nghiệp đang chờ đón bạn
                            </Text>
                        </div>
                        <div className="bg-[#00B14F]/10 px-6 py-3 rounded-xl border border-[#00B14F]/20">
                            <Text className="text-gray-600">
                                Tìm thấy{" "}
                                <strong className="text-[#00B14F] text-xl">{jobs.length}</strong>{" "}
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
                        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
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
                                className="mt-4 !bg-[#00B14F] hover:!bg-[#00a347] border-0 !h-12 !px-8 !rounded-lg !text-base !font-medium shadow-lg hover:shadow-xl transition-all"
                                onClick={handleReset}
                            >
                                Xem tất cả việc làm
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Job Grid */}
                            <Row gutter={[20, 20]}>
                                {paginatedJobs.map((job) => (
                                    <Col xs={24} sm={12} lg={8} key={job.id}>
                                        <JobCard job={job} />
                                    </Col>
                                ))}
                            </Row>

                            {/* Pagination */}
                            <div className="text-center mt-12">
                                <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                    <Pagination
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={jobs.length}
                                        onChange={setCurrentPage}
                                        showSizeChanger={false}
                                        showTotal={(total, range) => (
                                            <span className="text-gray-600 font-medium">
                                                {range[0]}-{range[1]} trong <strong className="text-[#00B14F]">{total}</strong> việc làm
                                            </span>
                                        )}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Call to Action Section */}
                {/* <div className="bg-gradient-to-r from-[#00B14F]/5 via-white to-[#00B14F]/5 py-16 mt-12">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <Title level={2} className="!mb-4">
                            Không tìm thấy công việc phù hợp?
                        </Title>
                        <Text className="text-gray-600 text-lg block mb-6">
                            Đăng ký nhận thông báo việc làm mới phù hợp với bạn
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            className="!bg-[#00B14F] hover:!bg-[#00a347] border-0 !h-12 !px-10 !rounded-lg !text-base !font-medium shadow-lg hover:shadow-xl transition-all"
                        >
                            Đăng ký ngay
                        </Button>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default HomePage
