import { Card, Space, Tag, Typography } from "antd";
import { JobCardProps } from "../../../types/application";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, FireOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// TopCV-style colors
const PRIMARY_COLOR = '#00B14F';

const JobCard = ({ job }: JobCardProps) => {
    const navigate = useNavigate();
    const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=Logo';

    // Format lương
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

    // Check if job is new (within 3 days)
    const isNew = dayjs().diff(dayjs(job.createdDate), 'day') <= 3;
    // Check if job is hot (example: high salary)
    const isHot = (job.salaryMin && job.salaryMin >= 20000000) || (job.salaryMax && job.salaryMax >= 30000000);

    return (
        <Card
            hoverable
            className="job-card"
            onClick={() => navigate(`/job/${job.id}`)}
            style={{
                borderRadius: 12,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
            }}
            styles={{
                body: { padding: 16 }
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,177,79,0.15)';
                e.currentTarget.style.borderColor = PRIMARY_COLOR;
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Hot/New badge */}
            {(isHot || isNew) && (
                <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1
                }}>
                    {isHot && (
                        <Tag color="#ff4d4f" style={{ margin: 0, borderRadius: 4 }}>
                            <FireOutlined /> HOT
                        </Tag>
                    )}
                    {isNew && !isHot && (
                        <Tag color={PRIMARY_COLOR} style={{ margin: 0, borderRadius: 4 }}>
                            Mới
                        </Tag>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
                {/* Logo công ty */}
                <div style={{ flexShrink: 0 }}>
                    <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: 8,
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #eee',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={imgSrc}
                            alt={job.companyName}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: 6
                            }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = PLACEHOLDER;
                            }}
                        />
                    </div>
                </div>

                {/* Thông tin job */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Tiêu đề */}
                    <Title
                        level={5}
                        style={{
                            margin: 0,
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#333'
                        }}
                        title={job.title}
                    >
                        {job.title}
                    </Title>

                    {/* Tên công ty */}
                    <Text
                        type="secondary"
                        style={{
                            display: 'block',
                            marginBottom: 10,
                            fontSize: 13,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {job.companyName || 'Công ty chưa cập nhật'}
                    </Text>

                    {/* Tags: Lương + Địa điểm */}
                    <Space size={6} wrap>
                        <Tag
                            style={{
                                background: '#e8f5e9',
                                color: PRIMARY_COLOR,
                                border: 'none',
                                borderRadius: 4,
                                fontWeight: 500,
                                fontSize: 12
                            }}
                        >
                            <DollarOutlined /> {formatSalary(job.salaryMin, job.salaryMax)}
                        </Tag>
                        <Tag
                            style={{
                                background: '#f5f5f5',
                                color: '#666',
                                border: 'none',
                                borderRadius: 4,
                                fontSize: 12
                            }}
                        >
                            <EnvironmentOutlined /> {job.locationName}
                        </Tag>
                        {job.categoryName && (
                            <Tag
                                style={{
                                    background: '#fff7e6',
                                    color: '#fa8c16',
                                    border: 'none',
                                    borderRadius: 4,
                                    fontSize: 12
                                }}
                            >
                                {job.categoryName}
                            </Tag>
                        )}
                    </Space>
                </div>
            </div>

            {/* Footer: HR name, Deadline & Save button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
                paddingTop: 12,
                borderTop: '1px solid #f0f0f0'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {job.employerName && (
                        <Link
                            to={`/profile/${job.employerId}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ display: 'block' }}
                        >
                            <Text type="secondary" style={{ fontSize: 12, cursor: 'pointer' }} className="hover:text-[#00B14F]">
                                <UserOutlined style={{ marginRight: 4 }} />
                                {job.employerName}
                            </Text>
                        </Link>
                    )}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        Còn {dayjs(job.deadline).diff(dayjs(), 'day')} ngày
                    </Text>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Save job functionality
                    }}
                    style={{
                        cursor: 'pointer',
                        color: '#999',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4d4f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                >
                    <HeartOutlined style={{ fontSize: 18 }} />
                </div>
            </div>
        </Card>
    )
}

export default JobCard