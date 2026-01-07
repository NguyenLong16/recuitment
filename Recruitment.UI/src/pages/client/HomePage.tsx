import { useEffect, useState } from "react";
import JobCard from "../../components/common/Clients/JobCard"
import { JobResponse } from "../../types/job";
import JobService from "../../services/jobService";
import { Button, Col, Empty, Input, Pagination, Row, Select, Spin, Tag, Typography } from "antd";
import useJobMasterData from "../../hooks/useJobMasterData";
import { Category } from "../../types/category";
import { EnvironmentOutlined, ReloadOutlined, SearchOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Location } from "../../types/Location";

const { Title, Text } = Typography;

// TopCV-style colors
const PRIMARY_COLOR = '#00B14F';
const BG_COLOR = '#f4f5f7';

const HomePage = () => {
    const [jobs, setJobs] = useState<JobResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedLocation, setSelectedLocation] = useState<number | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;
    const { categories, locations } = useJobMasterData();

    // Quick filter locations (top cities)
    const quickLocations = locations.slice(0, 6);

    // Fetch jobs
    const fetchJobs = async (params?: { title?: string; categoryId?: number; locationId?: number }) => {
        setLoading(true);
        try {
            const response = await JobService.getPublicJobs({
                categoryId: params?.categoryId,
                locationId: params?.locationId,
                title: params?.title?.trim() || undefined
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Handle search button click
    const handleSearch = () => {
        setCurrentPage(1);
        fetchJobs({
            title: keyword,
            categoryId: selectedCategory,
            locationId: selectedLocation
        });
    };

    // Handle reset all filters
    const handleReset = () => {
        setKeyword('');
        setSelectedCategory(undefined);
        setSelectedLocation(undefined);
        setCurrentPage(1);
        fetchJobs();
    };

    // Handle quick location filter
    const handleQuickLocation = (locationId: number) => {
        setSelectedLocation(locationId);
        setCurrentPage(1);
        fetchJobs({
            title: keyword,
            categoryId: selectedCategory,
            locationId: locationId
        });
    };

    // Paginated jobs
    const paginatedJobs = jobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ backgroundColor: BG_COLOR, minHeight: '100vh' }}>
            {/* Hero Search Section */}
            <div style={{
                background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #00a347 100%)`,
                padding: '48px 16px',
                marginBottom: 24
            }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <Title level={2} style={{ color: '#fff', textAlign: 'center', marginBottom: 8 }}>
                        Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', display: 'block', marginBottom: 24 }}>
                        Tiếp cận <strong style={{ color: '#fff' }}>{jobs.length}+</strong> tin tuyển dụng việc làm mỗi ngày
                    </Text>

                    {/* Search Box */}
                    <div style={{
                        background: '#fff',
                        borderRadius: 50,
                        padding: '8px 8px 8px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        flexWrap: 'wrap'
                    }}>
                        {/* Category Select */}
                        <Select
                            placeholder="Ngành nghề"
                            size="large"
                            bordered={false}
                            style={{ minWidth: 150, flex: 1 }}
                            allowClear
                            suffixIcon={<UnorderedListOutlined />}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={categories.map((c: Category) => ({ value: c.id, label: c.name }))}
                        />
                        <div style={{ width: 1, height: 30, background: '#e8e8e8' }} />

                        {/* Keyword Input */}
                        <Input
                            placeholder="Vị trí tuyển dụng..."
                            size="large"
                            bordered={false}
                            prefix={<SearchOutlined style={{ color: '#999' }} />}
                            style={{ flex: 2, minWidth: 200 }}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onPressEnter={handleSearch}
                        />
                        <div style={{ width: 1, height: 30, background: '#e8e8e8' }} />

                        {/* Location Select */}
                        <Select
                            placeholder="Địa điểm"
                            size="large"
                            bordered={false}
                            style={{ minWidth: 140, flex: 1 }}
                            allowClear
                            suffixIcon={<EnvironmentOutlined />}
                            value={selectedLocation}
                            onChange={setSelectedLocation}
                            options={locations.map((l: Location) => ({ value: l.id, label: l.name }))}
                        />

                        {/* Search Button */}
                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            onClick={handleSearch}
                            style={{
                                background: PRIMARY_COLOR,
                                borderColor: PRIMARY_COLOR,
                                borderRadius: 50,
                                height: 48,
                                paddingInline: 32,
                                fontWeight: 600
                            }}
                        >
                            Tìm kiếm
                        </Button>
                    </div>

                    {/* Quick Location Filters */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 16,
                        flexWrap: 'wrap'
                    }}>
                        {quickLocations.map((loc: Location) => (
                            <Tag
                                key={loc.id}
                                onClick={() => handleQuickLocation(loc.id)}
                                style={{
                                    cursor: 'pointer',
                                    background: selectedLocation === loc.id ? '#fff' : 'rgba(255,255,255,0.2)',
                                    color: selectedLocation === loc.id ? PRIMARY_COLOR : '#fff',
                                    border: 'none',
                                    borderRadius: 20,
                                    padding: '6px 16px',
                                    fontSize: 14,
                                    fontWeight: selectedLocation === loc.id ? 600 : 400,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loc.name}
                            </Tag>
                        ))}
                        {(selectedCategory || selectedLocation || keyword) && (
                            <Tag
                                onClick={handleReset}
                                style={{
                                    cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    border: '1px dashed rgba(255,255,255,0.5)',
                                    borderRadius: 20,
                                    padding: '6px 16px',
                                    fontSize: 14
                                }}
                            >
                                <ReloadOutlined /> Xóa lọc
                            </Tag>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 48px' }}>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}>
                    <Title level={3} style={{ margin: 0 }}>
                        <span style={{ color: PRIMARY_COLOR }}>Việc làm</span> tốt nhất
                    </Title>
                    <Text type="secondary">
                        Tìm thấy <strong style={{ color: PRIMARY_COLOR }}>{jobs.length}</strong> việc làm phù hợp
                    </Text>
                </div>

                {/* Job List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 80 }}>
                        <Spin size="large" />
                        <div style={{ marginTop: 16, color: '#999' }}>Đang tải việc làm...</div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        padding: 48,
                        textAlign: 'center'
                    }}>
                        <Empty
                            description="Không tìm thấy việc làm phù hợp"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                        <Button
                            type="primary"
                            style={{ marginTop: 16, background: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                            onClick={handleReset}
                        >
                            Xem tất cả việc làm
                        </Button>
                    </div>
                ) : (
                    <>
                        <Row gutter={[16, 16]}>
                            {paginatedJobs.map((job) => (
                                <Col xs={24} md={12} lg={8} key={job.id}>
                                    <JobCard job={job} />
                                </Col>
                            ))}
                        </Row>

                        {/* Pagination */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: 32,
                            padding: '24px',
                            background: '#fff',
                            borderRadius: 12
                        }}>
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
    );
}

export default HomePage