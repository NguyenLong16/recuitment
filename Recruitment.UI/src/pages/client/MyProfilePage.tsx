import { useState } from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Skeleton,
    Space,
    Tag,
    Typography,
    Upload,
} from "antd";
import {
    BuildOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    EditOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    GithubOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    SaveOutlined,
    TeamOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import useMyProfile from "../../hooks/useMyProfile";

import { Role } from "../../types/auth";
import { useAppSelector } from "../../hooks/hook";
import { UpdateProfileRequest } from "../../types/profile";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const PRIMARY_COLOR = "#00B14F";

const MyProfilePage = () => {
    const { profile, loading, updating, updateProfile } = useMyProfile();
    const { user } = useAppSelector((state) => state.auth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    
    // File states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    
    // Preview states
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const isCandidate = user?.role === Role.Candidate;

    // Helper function to build image URL
    const buildImageUrl = (url?: string) => {
        if (!url) return undefined;
        return url.startsWith("http") ? url : `https://localhost:7016${url}`;
    };
    
    const avatarUrl = avatarPreview || buildImageUrl(profile?.avatarUrl);
    const coverUrl =
        coverPreview ||
        buildImageUrl(profile?.coverImageUrl) ||
        "https://via.placeholder.com/1200x300?text=Cover+Image";
    const companyLogoUrl = buildImageUrl(profile?.company?.logoUrl);
    
    // Open edit modal
    const handleOpenEdit = () => {
        form.setFieldsValue({
            fullName:          profile?.fullName || "",
            phoneNumber:       profile?.phoneNumber || "",
            professionalTitle: profile?.professionalTitle || "",
            bio:               profile?.bio || "",
            address:           profile?.address || "",
            websiteUrl:        profile?.websiteUrl || "",
            linkedInUrl:       profile?.linkedInUrl || "",
            gitHubUrl:         profile?.gitHubUrl || "",
        });
        setAvatarFile(null);
        setCoverFile(null);
        setCvFile(null);
        setAvatarPreview(null);
        setCoverPreview(null);
        setIsEditModalOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (values: any) => {
        const payload: UpdateProfileRequest = {
            fullName:          values.fullName,
            phoneNumber:       values.phoneNumber || '',
            professionalTitle: values.professionalTitle || '',
            bio:               values.bio || '',
            address:           values.address || '',
            websiteUrl:        values.websiteUrl || '',
            linkedInUrl:       values.linkedInUrl || '',
            gitHubUrl:         values.gitHubUrl || '',
            avatarFile:        avatarFile ?? undefined,
            coverFile:         coverFile ?? undefined,
            cvFile:            cvFile ?? undefined,
        };

        const success = await updateProfile(payload);
        if (success) {
            setIsEditModalOpen(false);
            setAvatarFile(null);
            setCoverFile(null);
            setCvFile(null);
            setAvatarPreview(null);
            setCoverPreview(null);
        }
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
    
    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Text type="secondary">Không thể tải thông tin cá nhân</Text>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-10" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 70%, #f8fafc 100%)' }}>
            {/* ── Cover Image Section ────────────────────────────────────────── */}
            <div
                className="relative h-40 sm:h-56 md:h-72 lg:h-80 bg-cover bg-center overflow-hidden"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundColor: PRIMARY_COLOR,
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
                                                <Tag
                                                    color={PRIMARY_COLOR}
                                                    className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium"
                                                >
                                                    <CheckCircleOutlined className="mr-1.5" />
                                                    {profile.roleName}
                                                </Tag>
                                            )}
                                            {profile.company && (
                                                <Tag
                                                    color="blue"
                                                    className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium"
                                                >
                                                    <BuildOutlined className="mr-1.5" />
                                                    {profile.company.companyName}
                                                </Tag>
                                            )}
                                            <Tag
                                                color="default"
                                                className="!m-0 !px-2.5 sm:!px-3 !py-0.5 sm:!py-1 text-xs sm:text-sm font-medium bg-gray-100"
                                            >
                                                <TeamOutlined className="mr-1.5" />
                                                {profile.followerCount} người theo dõi
                                            </Tag>
                                        </div>
                                    </div>
                                    {/* Edit Button */}
                                    <div className="flex justify-center lg:justify-end shrink-0 w-full lg:w-auto">
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<EditOutlined />}
                                            onClick={handleOpenEdit}
                                            className="w-full sm:w-auto !h-11 sm:!h-12 lg:!h-14 !px-6 lg:!px-8 !rounded-xl !font-semibold shadow-md !bg-[#00B14F] hover:!bg-[#00a347] !border-0 transition-all duration-300"
                                        >
                                            Chỉnh sửa hồ sơ
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
                    {/* ==================== LEFT COLUMN - Contact Info ==================== */}
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
                                        <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">
                                            Email
                                        </Text>
                                        <Text className="text-[13px] sm:text-sm font-medium truncate block">{profile.email}</Text>
                                    </div>
                                </div>
                                {profile.phoneNumber && (
                                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 text-xl sm:text-2xl text-[#00B14F]">
                                            <PhoneOutlined />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">
                                                Điện thoại
                                            </Text>
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
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mb-0.5 sm:mb-1">
                                                Địa chỉ
                                            </Text>
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

                        {/* CV Section - Only for Candidate */}
                        {isCandidate && (
                            <Card
                                title={
                                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">📄</span>
                                        <span>CV của tôi</span>
                                    </span>
                                }
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '16px sm:24px' } as any }}
                            >
                                {profile.defaultCvUrl ? (
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 text-3xl sm:text-4xl text-[#00B14F]">
                                                <FileTextOutlined />
                                            </div>
                                            <div className="min-w-0">
                                                <Text strong className="block text-xs sm:text-sm font-semibold mb-0.5">CV mặc định</Text>
                                                <Text type="secondary" className="text-[11px] sm:text-xs block line-clamp-1 max-w-[150px]" title={profile.defaultCvUrl}>
                                                    {profile.defaultCvUrl.split('/').pop() || 'Đã tải lên'}
                                                </Text>
                                            </div>
                                        </div>
                                        <a
                                            href={profile.defaultCvUrl.startsWith('http') ? profile.defaultCvUrl : `https://localhost:7016${profile.defaultCvUrl}`}
                                            target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto mt-2 sm:mt-0"
                                        >
                                            <Button type="primary" block className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 font-semibold text-xs sm:text-sm h-8 sm:h-10">
                                                Xem CV
                                            </Button>
                                        </a>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <div className="text-4xl sm:text-5xl text-gray-300 mb-2 sm:mb-3 flex justify-center">
                                            <FileTextOutlined />
                                        </div>
                                        <Text type="secondary" className="block text-[13px] sm:text-base font-medium">
                                            Chưa có CV
                                        </Text>
                                        <Text type="secondary" className="block text-[11px] sm:text-sm mt-1">
                                            Nhấn "Chỉnh sửa hồ sơ" để tải lên
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Company Info - Only for HR */}
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
                    
                    {/* ==================== RIGHT MAIN CONTENT ==================== */}
                    <Col xs={24} lg={16} xl={17}>
                        {/* Education - Only for Candidate */}
                        {isCandidate && profile.educations && profile.educations.length > 0 && (
                            <Card
                                title={
                                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">🎓</span>
                                        <span>Học vấn</span>
                                    </span>
                                }
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '16px sm:24px' } as any }}
                            >
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.educations.map((edu) => (
                                        <div key={edu.id} className="border-l-[3px] sm:border-l-4 border-[#00B14F] pl-4 sm:pl-6 py-3 sm:py-4 hover:bg-green-50 rounded-r-xl transition-colors duration-200">
                                            <Title level={5} className="!m-0 !mb-0.5 sm:!mb-1 text-sm sm:text-base font-bold text-gray-900">
                                                {edu.schoolName}
                                            </Title>
                                            <Text className="text-gray-600 block font-medium text-[13px] sm:text-sm">
                                                {edu.major}
                                            </Text>
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide mt-1.5 sm:mt-2 block">
                                                {edu.startDate} - {edu.endDate || "Hiện tại"}
                                            </Text>
                                        </div>
                                    ))}
                                </Space>
                            </Card>
                        )}

                        {/* Experience - Only for Candidate */}
                        {isCandidate && profile.experiences && profile.experiences.length > 0 && (
                            <Card
                                title={
                                    <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl sm:text-2xl">💼</span>
                                        <span>Kinh nghiệm làm việc</span>
                                    </span>
                                }
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '16px sm:24px' } as any }}
                            >
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.experiences.map((exp) => (
                                        <div key={exp.id} className="border-l-[3px] sm:border-l-4 border-blue-500 pl-4 sm:pl-6 py-3 sm:py-4 hover:bg-blue-50 rounded-r-xl transition-colors duration-200">
                                            <Title level={5} className="!m-0 !mb-0.5 sm:!mb-1 text-sm sm:text-base font-bold text-gray-900">
                                                {exp.position}
                                            </Title>
                                            <Text className="text-gray-600 block font-semibold text-[13px] sm:text-sm">
                                                {exp.company}
                                            </Text>
                                            <Text type="secondary" className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide block mt-1.5 sm:mt-2 mb-2 sm:mb-3">
                                                {exp.startDate} - {exp.endDate || "Hiện tại"}
                                            </Text>
                                            {exp.description && (
                                                <Paragraph className="!mt-1sm:!mt-2 !mb-0 text-gray-600 text-[11px] sm:text-sm leading-relaxed whitespace-pre-wrap">
                                                    {exp.description}
                                                </Paragraph>
                                            )}
                                        </div>
                                    ))}
                                </Space>
                            </Card>
                        )}

                        {/* Posted Jobs - Only for HR */}
                        {!isCandidate && profile.postedJobs && profile.postedJobs.length > 0 && (
                            <Card
                                title={
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="text-xl sm:text-2xl">💼</span>
                                            <span>Việc làm đã đăng</span>
                                        </span>
                                        <Tag color={PRIMARY_COLOR} className="!m-0 !px-2 sm:!px-3 !py-0.5 sm:!py-1 text-[11px] sm:text-[13px] font-semibold">
                                            {profile.postedJobs.length} tin
                                        </Tag>
                                    </div>
                                }
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '16px sm:24px' } as any }}
                            >
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.postedJobs.map((job) => (
                                        <div key={job.id} className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 hover:border-[#00B14F] transition-all duration-200 cursor-pointer group">
                                            <div className="flex-1 min-w-0 w-full">
                                                <Text strong className="text-[15px] sm:text-base block mb-1 group-hover:text-[#00B14F] transition-colors leading-snug">
                                                    {job.title}
                                                </Text>
                                                <div className="flex items-center gap-1.5 text-gray-500">
                                                    <EnvironmentOutlined className="text-xs sm:text-sm" />
                                                    <Text type="secondary" className="text-xs sm:text-sm line-clamp-1">
                                                        {job.locationName}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Tag color={PRIMARY_COLOR} className="!m-0 !px-3 !py-1 sm:!px-4 sm:!py-1.5 font-semibold text-xs sm:text-sm flex-shrink-0 rounded-lg">
                                                {job.salaryMin && job.salaryMax
                                                    ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax / 1000000).toFixed(0)} triệu`
                                                    : "Thương lượng"}
                                            </Tag>
                                        </div>
                                    ))}
                                </Space>
                            </Card>
                        )}
                    </Col>
                </Row>
            </div>

            {/* ==================== EDIT MODAL ==================== */}
            <Modal
                title={
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                        <span className="text-2xl sm:text-3xl">✏️</span>
                        <span>Chỉnh sửa hồ sơ</span>
                    </span>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={750}
                centered
                className="responsive-modal !rounded-2xl"
                styles={{ body: { padding: '16px' } }}
            >
                <style>{`
                    .responsive-modal .ant-modal-body {
                        padding: 16px !important;
                    }
                    @media (min-width: 640px) {
                        .responsive-modal .ant-modal-body {
                            padding: 24px 32px 32px !important;
                        }
                    }
                `}</style>
                <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4 sm:mt-6">
                    {/* Avatar & Cover Upload */}
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200">
                        {/* Avatar Upload */}
                        <div className="md:col-span-1 text-center">
                            <Text type="secondary" className="block mb-3 sm:mb-4 font-semibold text-[10px] sm:text-xs uppercase tracking-wide">
                                Ảnh đại diện
                            </Text>
                            <input
                                type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
                                }}
                            />
                            <label htmlFor="avatar-upload" className="cursor-pointer inline-block">
                                <div className="relative group">
                                    <Avatar size={{ xs: 90, sm: 100, md: 120 }} src={avatarPreview || buildImageUrl(profile?.avatarUrl)} style={{ backgroundColor: PRIMARY_COLOR }} className="shadow-lg border-[3px] sm:border-4 border-white">
                                        {profile?.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                        <CameraOutlined className="text-white text-xl sm:text-2xl" />
                                    </div>
                                </div>
                            </label>
                            {avatarFile && (
                                <Text type="success" className="mt-2 sm:mt-3 block text-[10px] sm:text-xs font-semibold truncate max-w-[120px] mx-auto">
                                    ✓ {avatarFile.name}
                                </Text>
                            )}
                        </div>

                        {/* Cover Upload */}
                        <div className="md:col-span-2">
                            <Text type="secondary" className="block mb-3 sm:mb-4 font-semibold text-[10px] sm:text-xs uppercase tracking-wide text-center md:text-left">
                                Ảnh bìa (Tối ưu: 1200x300 px)
                            </Text>
                            <input
                                type="file" id="cover-upload" accept="image/*" style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) { setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); }
                                }}
                            />
                            <label htmlFor="cover-upload" className="cursor-pointer block">
                                <div
                                    className="h-28 sm:h-32 md:h-40 rounded-lg sm:rounded-xl bg-cover bg-center relative group overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#00B14F] transition-colors duration-200"
                                    style={{
                                        backgroundImage: `url(${coverPreview || buildImageUrl(profile?.coverImageUrl) || 'https://via.placeholder.com/1200x300?text=Cover+Image'})`,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center">
                                        <CameraOutlined className="text-white text-2xl sm:text-3xl mb-1 sm:mb-2" />
                                        <Text className="text-white text-xs sm:text-sm font-semibold">Nhấp để thay đổi</Text>
                                    </div>
                                </div>
                            </label>
                            {coverFile && (
                                <Text type="success" className="mt-2 sm:mt-3 block text-[10px] sm:text-xs font-semibold text-center md:text-left">
                                    ✓ Đã chọn: {coverFile.name}
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="mb-6 sm:mb-8">
                        <Title level={5} className="!text-base sm:!text-lg !font-bold !mb-4 sm:!mb-6 !text-gray-900 flex items-center gap-2">
                            <span>👤</span><span>Thông tin cơ bản</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Họ và tên</span>} name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]} className="mb-3 sm:mb-6">
                                    <Input placeholder="Nhập họ và tên" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Số điện thoại</span>} name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^(0[0-9]{9,10})$/, message: 'Số điện thoại không hợp lệ' }]} className="mb-3 sm:mb-6">
                                    <Input placeholder="VD: 0912345678" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Chức danh / Nghề nghiệp</span>} name="professionalTitle" rules={[{ required: true, message: 'Vui lòng nhập chức danh / nghề nghiệp' }]} className="mb-3 sm:mb-6">
                            <Input placeholder="VD: Senior Software Engineer" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Giới thiệu bản thân</span>} name="bio" className="mb-3 sm:mb-6">
                            <TextArea rows={4} placeholder="Viết một vài dòng giới thiệu về bản thân..." className="!rounded-lg text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2" />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Địa chỉ</span>} name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]} className="mb-0 sm:mb-6">
                            <Input placeholder="VD: Hà Nội, Việt Nam" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                        </Form.Item>
                    </div>

                    <Divider className="!my-6 sm:!my-8" />

                    <div className="mb-6 sm:mb-8">
                        <Title level={5} className="!text-base sm:!text-lg !font-bold !mb-4 sm:!mb-6 !text-gray-900 flex items-center gap-2">
                            <span>🔗</span><span>Liên kết xã hội</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Website</span>} name="websiteUrl" className="mb-3 sm:mb-6">
                                    <Input prefix={<GlobalOutlined className="text-[#00B14F] mr-1" />} placeholder="https://..." className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">LinkedIn</span>} name="linkedInUrl" className="mb-3 sm:mb-6">
                                    <Input prefix={<LinkedinOutlined className="text-[#0077B5] mr-1" />} placeholder="https://linkedin.com/..." className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">GitHub</span>} name="gitHubUrl" className="mb-0 sm:mb-6">
                                    <Input prefix={<GithubOutlined className="text-gray-800 mr-1" />} placeholder="https://github.com/..." className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* CV Upload - Only for Candidate */}
                    {isCandidate && (
                        <>
                            <Divider className="!my-6 sm:!my-8" />
                            <Title level={5} className="!text-base sm:!text-lg !font-bold !mb-4 sm:!mb-6 !text-gray-900 flex items-center gap-2">
                                <span>📄</span><span>CV của bạn</span>
                            </Title>
                            <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Tải lên CV mới</span>} className="mb-0">
                                <Upload
                                    beforeUpload={(file) => { setCvFile(file); return false; }}
                                    maxCount={1} accept=".pdf,.doc,.docx"
                                    fileList={cvFile ? [{ uid: '-1', name: cvFile.name, status: 'done' as const }] : []}
                                    onRemove={() => setCvFile(null)}
                                    className="w-full sm:w-auto"
                                >
                                    <Button icon={<UploadOutlined />} className="!rounded-lg !font-medium text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto px-4">
                                        Chọn file CV (PDF, DOC)
                                    </Button>
                                </Upload>
                                {cvFile && (
                                    <Text type="success" className="mt-2 sm:mt-3 block text-[10px] sm:text-xs font-semibold truncate max-w-full">
                                        ✓ Đã chọn: {cvFile.name}
                                    </Text>
                                )}
                            </Form.Item>
                        </>
                    )}

                    <Divider className="!border-dashed !my-6 sm:!my-8" />
                    
                    <div className="flex justify-end gap-3 sm:gap-4 mt-2">
                        <Button onClick={() => setIsEditModalOpen(false)} className="!rounded-lg !font-semibold text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-8">
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={updating} icon={<SaveOutlined />} className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg !font-semibold text-xs sm:text-sm h-9 sm:h-10 px-5 sm:px-8">
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default MyProfilePage;