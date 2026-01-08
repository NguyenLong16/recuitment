import { useEffect, useState } from "react"
import JobCard from "../../components/common/Clients/JobCard"
import type { JobResponse } from "../../types/job"
import JobService from "../../services/jobService"
import { Button, Col, Empty, Input, Pagination, Row, Select, Spin, Tag, Typography } from "antd"
import useJobMasterData from "../../hooks/useJobMasterData"
import type { Category } from "../../types/category"
import { EnvironmentOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons"
import type { Location } from "../../types/Location"

const { Title, Text } = Typography

// const PRIMARY_COLOR = "#00B14F"

const HomePage = () => {
    const [jobs, setJobs] = useState<JobResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
    const [selectedLocation, setSelectedLocation] = useState<number | undefined>()
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12
    const { categories, locations } = useJobMasterData()

    const quickLocations = locations.slice(0, 6)

    const fetchJobs = async (params?: { title?: string; categoryId?: number; locationId?: number }) => {
        setLoading(true)
        try {
            const response = await JobService.getPublicJobs({
                categoryId: params?.categoryId,
                locationId: params?.locationId,
                title: params?.title?.trim() || undefined,
            })
            setJobs(response.data)
        } catch (error) {
            console.error("Error fetching jobs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleSearch = () => {
        setCurrentPage(1)
        fetchJobs({
            title: keyword,
            categoryId: selectedCategory,
            locationId: selectedLocation,
        })
    }

    const handleReset = () => {
        setKeyword("")
        setSelectedCategory(undefined)
        setSelectedLocation(undefined)
        setCurrentPage(1)
        fetchJobs()
    }

    const handleQuickLocation = (locationId: number) => {
        setSelectedLocation(locationId)
        setCurrentPage(1)
        fetchJobs({
            title: keyword,
            categoryId: selectedCategory,
            locationId: locationId,
        })
    }

    const paginatedJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    return (
        <>
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Search Section */}
                <div className="bg-gradient-to-br from-[#00B14F] to-[#00a347] px-4 py-8 mb-4">
                    <div className="max-w-4xl mx-auto">
                        <Title level={2} className="!text-white !text-center !mb-2">
                            Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
                        </Title>
                        <Text className="text-white/90 text-center block mb-5">
                            Tiếp cận <strong className="text-white">{jobs.length}+</strong> tin tuyển dụng việc làm mỗi ngày
                        </Text>

                        {/* Search Box - reduced border radius and padding */}
                        <div className="bg-white rounded-lg p-2 px-4 flex items-center gap-2 shadow-lg flex-wrap">
                            {/* Category Select */}
                            <Select
                                placeholder="Ngành nghề"
                                size="large"
                                bordered={false}
                                className="min-w-[150px] flex-1"
                                allowClear
                                suffixIcon={<UnorderedListOutlined />}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                options={categories.map((c: Category) => ({ value: c.id, label: c.name }))}
                            />
                            <div className="w-px h-8 bg-gray-200" />

                            {/* Keyword Input */}
                            <Input
                                placeholder="Vị trí tuyển dụng..."
                                size="large"
                                bordered={false}
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="flex-[2] min-w-[200px]"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onPressEnter={handleSearch}
                            />
                            <div className="w-px h-8 bg-gray-200" />

                            {/* Location Select */}
                            <Select
                                placeholder="Địa điểm"
                                size="large"
                                bordered={false}
                                className="min-w-[140px] flex-1"
                                allowClear
                                suffixIcon={<EnvironmentOutlined />}
                                value={selectedLocation}
                                onChange={setSelectedLocation}
                                options={locations.map((l: Location) => ({ value: l.id, label: l.name }))}
                            />

                            {/* Search Button - reduced border radius */}
                            <Button
                                type="primary"
                                size="large"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                className="!bg-[#00B14F] border-[#00B14F] !rounded-lg h-12 px-6 font-semibold"
                            >
                                Tìm kiếm
                            </Button>
                        </div>

                        {/* Quick Location Filters - reduced spacing and border radius */}
                        <div className="flex justify-center gap-2 mt-3 flex-wrap">
                            {quickLocations.map((loc: Location) => (
                                <Tag
                                    key={loc.id}
                                    onClick={() => handleQuickLocation(loc.id)}
                                    className={`cursor-pointer border-none rounded-md px-3 py-1 text-sm transition-all ${selectedLocation === loc.id ? "!bg-white !text-[#00B14F] font-semibold" : "!bg-white/20 !text-white"
                                        }`}
                                >
                                    {loc.name}
                                </Tag>
                            ))}
                            {(selectedCategory || selectedLocation || keyword) && (
                                <Tag
                                    onClick={handleReset}
                                    className="cursor-pointer !bg-white/20 !text-white !border-dashed !border-white/50 rounded-md px-3 py-1 text-sm"
                                >
                                    <ReloadOutlined /> Xóa lọc
                                </Tag>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - reduced padding */}
                <div className="max-w-7xl mx-auto px-4 pb-8">
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
                    {loading ? (
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
            </div>
        </>
    )
}

export default HomePage
