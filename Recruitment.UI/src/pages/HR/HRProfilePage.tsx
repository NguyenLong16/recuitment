import { useParams } from "react-router-dom";
import { Avatar, Button, Card, Col, Divider, Empty, Row, Skeleton, Space, Tag, Typography } from "antd";
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
                <div className="max-w-7xl mx-auto px-4">
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
                        <span className="text-gray-500 font-medium">
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
        <div className="min-h-screen pb-10" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 70%, #f8fafc 100%)' }}>
            {/* ── Cover Image Section ────────────────────────────────────────── */}
            <div
                className="relative h-40 sm:h-56 md:h-72 lg:h-80 bg-cover bg-center overflow-hidden"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundColor: PRIMARY_COLOR
                }}
            >
                <div className="absolute inset-0 bg-black/25"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ marginTop: 'calc(-4rem - 3vw)' }}>
                {/* ── Profile Header Card ────────────────────────────────────── */}
                <Card 
                    className="shadow-xl rounded-2xl md:rounded-3xl border-0 mb-6 sm:mb-8 overflow-hidden" 
                    styles={{ body: { padding: 0 } }}
                >
                    <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                            
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <Avatar
                                        size={{ xs: 100, sm: 110, md: 120, lg: 130 }}
                                        src={avatarUrl}
                                        className="border-4 border-white shadow-lg"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        {profile.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute bottom-0 md:-bottom-1 right-1 md:-right-1 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full border-2 md:border-[3px] border-white shadow-md flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                                    <div>
                                        <Title level={2} className="!m-0 !mb-1 sm:!mb-2 !text-2xl sm:!text-3xl lg:!text-4xl text-gray-900 tracking-tight">
                                            {profile.fullName}
                                        </Title>
                                        {profile.professionalTitle && (
                                            <Text className="text-sm sm:text-base lg:text-lg text-gray-500 block mb-3 font-medium">
                                                {profile.professionalTitle}
                                            </Text>
                                        )}
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                            {profile.roleName && (
                                                <Tag color={PRIMARY_COLOR} className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium">
                                                    <CheckCircleOutlined className="mr-1.5" />
                                                    {profile.roleName}
                                                </Tag>
                                            )}
                                            {profile.company && (
                                                <Tag color="blue" className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium">
                                                    <BuildOutlined className="mr-1.5" />
                                                    {profile.company.companyName}
                                                </Tag>
                                            )}
                                            <Tag color="default" className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium bg-gray-100">
                                                <TeamOutlined className="mr-1.5" />
                                                {profile.followerCount} người theo dõi
                                            </Tag>
                                        </div>
                                    </div>

                                    {/* Follow Button */}
                                    <div className="flex justify-center lg:justify-end shrink-0 w-full lg:w-auto">
                                        <Button
                                            type={profile.isFollowing ? "default" : "primary"}
                                            size="large"
                                            icon={profile.isFollowing ? <UserDeleteOutlined /> : <UserAddOutlined />}
                                            loading={followLoading}
                                            onClick={profile.isFollowing ? unfollowHR : followHR}
                                            className={`w-full sm:w-auto !h-11 sm:!h-12 lg:!h-14 !px-6 lg:!px-8 !rounded-xl !font-semibold shadow-md transition-all ${
                                                profile.isFollowing
                                                    ? '!border-gray-300 hover:!border-red-400 hover:!text-red-500'
                                                    : '!bg-[#00B14F] hover:!bg-[#00a347] !border-0'
                                            }`}
                                        >
                                            {profile.isFollowing ? 'Đang theo dõi' : 'Theo dõi HR'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Bio */}
                                {profile.bio && (
                                    <Paragraph className="!mb-0 !mt-2 sm:!mt-4 lg:!mt-6 text-gray-600 text-[13px] sm:text-sm lg:text-[15px] leading-relaxed">
                                        {profile.bio}
                                    </Paragraph>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <Row gutter={[24, 24]}>
                    
                    {/* ==================== LEFT COLUMN ==================== */}
                    <Col xs={24} lg={8} xl={7}>
                        {/* Contact Information */}
                        <Card
                            title={
                                <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl">📞</span>
                                    <span>Thông tin liên hệ</span>
                                </span>
                            }
                            className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                            styles={{ body: { padding: '16px sm:24px' } as any }}
                        >
                            <Space direction="vertical" size={16} className="w-full">
                                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex-shrink-0 text-xl sm:text-2xl text-[#00B14F]">
                                        <MailOutlined />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">Email</Text>
                                        <Text className="text-[13px] sm:text-sm font-medium truncate block">{profile.email}</Text>
                                    </div>
                                </div>

                                {profile.phoneNumber && (
                                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 text-xl sm:text-2xl text-[#00B14F]">
                                            <PhoneOutlined />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">Điện thoại</Text>
                                            <Text className="text-[13px] sm:text-sm font-medium truncate block">{profile.phoneNumber}</Text>
                                        </div>
                                    </div>
                                )}

                                {profile.address && (
                                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 text-xl sm:text-2xl text-[#00B14F]">
                                            <EnvironmentOutlined />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">Địa chỉ</Text>
                                            <Text className="text-[13px] sm:text-sm font-medium block">{profile.address}</Text>
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(profile.websiteUrl || profile.linkedInUrl || profile.gitHubUrl) && (
                                    <>
                                        <Divider className="!my-1 sm:!my-2" />
                                        <div className="flex gap-3 sm:gap-4 justify-center">
                                            {profile.websiteUrl && (
                                                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button type="text" icon={<GlobalOutlined />} className="!text-lg sm:!text-xl !text-gray-500 hover:!text-[#00B14F] !w-10 !h-10 transition-colors" />
                                                </a>
                                            )}
                                            {profile.linkedInUrl && (
                                                <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button type="text" icon={<LinkedinOutlined />} className="!text-lg sm:!text-xl !text-gray-500 hover:!text-[#0077B5] !w-10 !h-10 transition-colors" />
                                                </a>
                                            )}
                                            {profile.gitHubUrl && (
                                                <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer">
                                                    <Button type="text" icon={<GithubOutlined />} className="!text-lg sm:!text-xl !text-gray-500 hover:!text-gray-900 !w-10 !h-10 transition-colors" />
                                                </a>
                                            )}
                                        </div>
                                    </>
                                )}
                            </Space>
                        </Card>

                        {/* Company Information */}
                        {profile.company && (
                            <Card
                                title={
                                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">🏢</span>
                                        <span>Công ty</span>
                                    </span>
                                }
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '16px sm:24px' } as any }}
                            >
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4 sm:mb-6 p-4 sm:p-5 bg-gray-50 rounded-xl text-center sm:text-left">
                                    {companyLogoUrl ? (
                                        <img
                                            src={companyLogoUrl}
                                            alt={profile.company.companyName}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-contain bg-white border border-gray-200 p-1.5 sm:p-2"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
                                            <BuildOutlined className="text-2xl sm:text-3xl text-blue-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Title level={5} className="!m-0 !mb-1 sm:!mb-2 text-base sm:text-lg font-bold">
                                            {profile.company.companyName}
                                        </Title>
                                        {profile.company.size && (
                                            <Tag color="blue" className="!px-2 sm:!px-3 !py-0.5 sm:!py-1 font-medium text-[11px] sm:text-[13px] !m-0">
                                                <TeamOutlined className="mr-1" />
                                                {profile.company.size} nhân viên
                                            </Tag>
                                        )}
                                    </div>
                                </div>

                                {profile.company.description && (
                                    <Paragraph className="text-gray-600 !mb-4 sm:!mb-6 text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap">
                                        {profile.company.description}
                                    </Paragraph>
                                )}

                                <Space direction="vertical" size={12} className="w-full">
                                    {profile.company.address && (
                                        <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                                            <EnvironmentOutlined className="text-[#00B14F] text-base sm:text-lg flex-shrink-0 sm:mt-0.5" />
                                            <Text className="text-[13px] sm:text-sm">{profile.company.address}</Text>
                                        </div>
                                    )}
                                    {profile.company.websiteLink && (
                                        <div className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg overflow-hidden">
                                            <GlobalOutlined className="text-[#00B14F] text-base sm:text-lg flex-shrink-0 sm:mt-0.5" />
                                            <a href={profile.company.websiteLink} target="_blank" rel="noopener noreferrer" className="text-[#00B14F] hover:underline text-[13px] sm:text-sm break-all">
                                                {profile.company.websiteLink}
                                            </a>
                                        </div>
                                    )}
                                </Space>
                            </Card>
                        )}
                    </Col>

                    {/* ==================== RIGHT COLUMN - Posted Jobs ==================== */}
                    <Col xs={24} lg={16} xl={17}>
                        <Card
                            title={
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">💼</span>
                                        <span>Việc làm đang tuyển</span>
                                    </span>
                                    {profile.postedJobs && profile.postedJobs.length > 0 && (
                                        <Tag color={PRIMARY_COLOR} className="!m-0 !px-2 sm:!px-3 !py-0.5 sm:!py-1 text-[11px] sm:text-[13px] font-semibold">
                                            {profile.postedJobs.length} tin
                                        </Tag>
                                    )}
                                </div>
                            }
                            className="shadow-md hover:shadow-lg rounded-2xl border-0 transition-all duration-300 overflow-hidden"
                            styles={{ body: { padding: '16px sm:24px' } as any }}
                        >
                            {!profile.postedJobs || profile.postedJobs.length === 0 ? (
                                <Empty
                                    description={<span className="text-gray-500 font-medium">Chưa có việc làm nào đang tuyển</span>}
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    className="py-12"
                                />
                            ) : (
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.postedJobs.map((job) => (
                                        <Link to={`/job/${job.id}`} key={job.id} className="block group">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-green-50 rounded-xl border border-gray-200 hover:border-[#00B14F] hover:shadow-md transition-all duration-300 cursor-pointer">
                                                <div className="flex-1 min-w-0 w-full">
                                                    <Title level={5} className="!m-0 !mb-2 text-[15px] sm:text-base group-hover:text-[#00B14F] transition-colors leading-snug truncate">
                                                        {job.title}
                                                    </Title>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Tag className="!m-0 !border-0 bg-green-50 text-[#00B14F] !rounded-md px-2 py-0.5 font-medium text-xs sm:text-sm">
                                                            <DollarOutlined className="mr-1" />
                                                            {formatSalary(job.salaryMin, job.salaryMax)}
                                                        </Tag>
                                                        <Tag className="!m-0 !border-0 bg-gray-200/60 text-gray-600 !rounded-md px-2 py-0.5 font-medium text-xs sm:text-sm">
                                                            <EnvironmentOutlined className="mr-1" />
                                                            {job.locationName}
                                                        </Tag>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center sm:justify-end text-xs sm:text-sm mt-1 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-200 sm:border-transparent shrink-0">
                                                    <Text type="secondary" className="flex items-center font-medium bg-white sm:bg-transparent px-3 py-1 sm:p-0 rounded-full sm:rounded-none shadow-sm sm:shadow-none border sm:border-0 border-gray-100 w-fit">
                                                        <CalendarOutlined className="mr-1.5 text-[#00B14F]" />
                                                        Còn {dayjs(job.deadline).diff(dayjs(), 'day')} ngày
                                                    </Text>
                                                </div>
                                            </div>
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
