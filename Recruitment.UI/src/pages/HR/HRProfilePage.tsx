import { useParams } from "react-router-dom";
import { Avatar, Button, Card, Col, Divider, Empty, Row, Skeleton, Space, Spin, Tag, Typography } from "antd";
import {
    BuildOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    GithubOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserDeleteOutlined
} from "@ant-design/icons";
import useProfile from "../../hooks/useProfile";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const PRIMARY_COLOR = '#00B14F';

const HRProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const userId = Number(id);
    const { profile, loading, error, followLoading, followHR, unfollowHR } = useProfile(userId);

    // Format lương
    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return 'Thương lượng';
        const fmt = (val: number) => (val / 1000000).toFixed(0) + ' triệu';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Tới ${fmt(max!)}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <Skeleton active avatar paragraph={{ rows: 4 }} />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Empty
                    description={
                        <span className="text-gray-500">
                            {error || 'Không tìm thấy thông tin nhà tuyển dụng'}
                        </span>
                    }
                />
            </div>
        );
    }

    const avatarUrl = profile.avatarUrl
        ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `https://localhost:7016${profile.avatarUrl}`)
        : undefined;

    const coverUrl = profile.coverImageUrl
        ? (profile.coverImageUrl.startsWith('http') ? profile.coverImageUrl : `https://localhost:7016${profile.coverImageUrl}`)
        : 'https://via.placeholder.com/1200x300?text=Cover+Image';

    const companyLogoUrl = profile.company?.logoUrl
        ? (profile.company.logoUrl.startsWith('http') ? profile.company.logoUrl : `https://localhost:7016${profile.company.logoUrl}`)
        : undefined;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image Section */}
            <div
                className="relative h-64 md:h-80 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundColor: PRIMARY_COLOR
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10 pb-12">
                {/* Profile Header Card */}
                <Card className="shadow-xl rounded-2xl border-0 mb-6" styles={{ body: { padding: 0 } }}>
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <Avatar
                                    size={120}
                                    src={avatarUrl}
                                    className="border-4 border-white shadow-lg"
                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                >
                                    {profile.fullName?.charAt(0)?.toUpperCase()}
                                </Avatar>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <Title level={2} className="!m-0 !mb-1">
                                            {profile.fullName}
                                        </Title>
                                        {profile.professionalTitle && (
                                            <Text className="text-lg text-gray-600 block mb-2">
                                                {profile.professionalTitle}
                                            </Text>
                                        )}
                                        <Space wrap size={[8, 8]}>
                                            {profile.roleName && (
                                                <Tag color={PRIMARY_COLOR} className="!m-0">
                                                    <CheckCircleOutlined className="mr-1" />
                                                    {profile.roleName}
                                                </Tag>
                                            )}
                                            {profile.company && (
                                                <Tag color="blue" className="!m-0">
                                                    <BuildOutlined className="mr-1" />
                                                    {profile.company.companyName}
                                                </Tag>
                                            )}
                                            <Tag color="default" className="!m-0">
                                                <TeamOutlined className="mr-1" />
                                                {profile.followerCount} người theo dõi
                                            </Tag>
                                        </Space>
                                    </div>

                                    {/* Follow Button */}
                                    <div>
                                        <Button
                                            type={profile.isFollowing ? "default" : "primary"}
                                            size="large"
                                            icon={profile.isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                                            loading={followLoading}
                                            onClick={profile.isFollowing ? unfollowHR : followHR}
                                            className={`!h-12 !px-6 !rounded-lg !font-medium shadow-lg transition-all ${profile.isFollowing
                                                    ? '!border-gray-300 hover:!border-red-400 hover:!text-red-500'
                                                    : '!bg-[#00B14F] hover:!bg-[#00a347] !border-0'
                                                }`}
                                        >
                                            {profile.isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Bio */}
                                {profile.bio && (
                                    <Paragraph className="!mt-4 !mb-0 text-gray-600 text-base">
                                        {profile.bio}
                                    </Paragraph>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <Row gutter={24}>
                    {/* Left Column - Contact & Company Info */}
                    <Col xs={24} lg={8}>
                        {/* Contact Information */}
                        <Card
                            title={
                                <span className="text-lg font-semibold">
                                    📞 Thông tin liên hệ
                                </span>
                            }
                            className="shadow-lg rounded-xl border-0 mb-6"
                        >
                            <Space direction="vertical" size={16} className="w-full">
                                <div className="flex items-center gap-3">
                                    <MailOutlined className="text-xl text-gray-400" />
                                    <div>
                                        <Text type="secondary" className="text-sm block">Email</Text>
                                        <Text>{profile.email}</Text>
                                    </div>
                                </div>

                                {profile.phoneNumber && (
                                    <div className="flex items-center gap-3">
                                        <PhoneOutlined className="text-xl text-gray-400" />
                                        <div>
                                            <Text type="secondary" className="text-sm block">Điện thoại</Text>
                                            <Text>{profile.phoneNumber}</Text>
                                        </div>
                                    </div>
                                )}

                                {profile.address && (
                                    <div className="flex items-center gap-3">
                                        <EnvironmentOutlined className="text-xl text-gray-400" />
                                        <div>
                                            <Text type="secondary" className="text-sm block">Địa chỉ</Text>
                                            <Text>{profile.address}</Text>
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(profile.websiteUrl || profile.linkedInUrl || profile.gitHubUrl) && (
                                    <>
                                        <Divider className="!my-2" />
                                        <Space size={16}>
                                            {profile.websiteUrl && (
                                                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button
                                                        type="text"
                                                        icon={<GlobalOutlined />}
                                                        className="!text-gray-500 hover:!text-[#00B14F]"
                                                    />
                                                </a>
                                            )}
                                            {profile.linkedInUrl && (
                                                <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button
                                                        type="text"
                                                        icon={<LinkedinOutlined />}
                                                        className="!text-gray-500 hover:!text-[#0077B5]"
                                                    />
                                                </a>
                                            )}
                                            {profile.gitHubUrl && (
                                                <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button
                                                        type="text"
                                                        icon={<GithubOutlined />}
                                                        className="!text-gray-500 hover:!text-[#333]"
                                                    />
                                                </a>
                                            )}
                                        </Space>
                                    </>
                                )}
                            </Space>
                        </Card>

                        {/* Company Information */}
                        {profile.company && (
                            <Card
                                title={
                                    <span className="text-lg font-semibold">
                                        🏢 Công ty
                                    </span>
                                }
                                className="shadow-lg rounded-xl border-0 mb-6"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    {companyLogoUrl ? (
                                        <img
                                            src={companyLogoUrl}
                                            alt={profile.company.companyName}
                                            className="w-16 h-16 rounded-lg object-contain border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <BuildOutlined className="text-2xl text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <Title level={5} className="!m-0 !mb-1">
                                            {profile.company.companyName}
                                        </Title>
                                        {profile.company.size && (
                                            <Tag color="blue">
                                                <TeamOutlined className="mr-1" />
                                                {profile.company.size} nhân viên
                                            </Tag>
                                        )}
                                    </div>
                                </div>

                                {profile.company.description && (
                                    <Paragraph className="text-gray-600 !mb-4">
                                        {profile.company.description}
                                    </Paragraph>
                                )}

                                <Space direction="vertical" size={8} className="w-full">
                                    {profile.company.address && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <EnvironmentOutlined />
                                            <Text>{profile.company.address}</Text>
                                        </div>
                                    )}
                                    {profile.company.websiteLink && (
                                        <div className="flex items-center gap-2">
                                            <GlobalOutlined className="text-gray-400" />
                                            <a
                                                href={profile.company.websiteLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#00B14F] hover:underline"
                                            >
                                                {profile.company.websiteLink}
                                            </a>
                                        </div>
                                    )}
                                </Space>
                            </Card>
                        )}
                    </Col>

                    {/* Right Column - Posted Jobs */}
                    <Col xs={24} lg={16}>
                        <Card
                            title={
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">
                                        💼 Việc làm đang tuyển
                                    </span>
                                    {profile.postedJobs && profile.postedJobs.length > 0 && (
                                        <Tag color={PRIMARY_COLOR} className="!m-0">
                                            {profile.postedJobs.length} tin
                                        </Tag>
                                    )}
                                </div>
                            }
                            className="shadow-lg rounded-xl border-0"
                        >
                            {!profile.postedJobs || profile.postedJobs.length === 0 ? (
                                <Empty
                                    description="Chưa có việc làm nào đang tuyển"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            ) : (
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.postedJobs.map((job) => (
                                        <Link to={`/job/${job.id}`} key={job.id}>
                                            <Card
                                                className="hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-[#00B14F]"
                                                styles={{ body: { padding: 16 } }}
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <Title level={5} className="!m-0 !mb-2">
                                                            {job.title}
                                                        </Title>
                                                        <Space wrap size={[8, 8]}>
                                                            <Tag
                                                                style={{
                                                                    background: '#e8f5e9',
                                                                    color: PRIMARY_COLOR,
                                                                    border: 'none',
                                                                    borderRadius: 4
                                                                }}
                                                            >
                                                                <DollarOutlined className="mr-1" />
                                                                {formatSalary(job.salaryMin, job.salaryMax)}
                                                            </Tag>
                                                            <Tag
                                                                style={{
                                                                    background: '#f5f5f5',
                                                                    color: '#666',
                                                                    border: 'none',
                                                                    borderRadius: 4
                                                                }}
                                                            >
                                                                <EnvironmentOutlined className="mr-1" />
                                                                {job.locationName}
                                                            </Tag>
                                                        </Space>
                                                    </div>
                                                    <div className="text-right">
                                                        <Text type="secondary" className="text-sm">
                                                            <CalendarOutlined className="mr-1" />
                                                            Còn {dayjs(job.deadline).diff(dayjs(), 'day')} ngày
                                                        </Text>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    ))}
                                </Space>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HRProfilePage;
