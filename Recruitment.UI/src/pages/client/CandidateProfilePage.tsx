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
    Tabs,
    Tag,
    Typography,
    Upload,
} from "antd";
import {
    CameraOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
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
    BookOutlined,
    TrophyOutlined,
    IdcardOutlined,
} from "@ant-design/icons";
import useMyProfile from "../../hooks/useMyProfile";
import { UpdateProfileRequest } from "../../types/profile";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const PRIMARY_COLOR = "#00B14F";

const CandidateProfilePage = () => {
    const { profile, loading, updating, updateProfile } = useMyProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    
    // File states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile]   = useState<File | null>(null);
    const [cvFile, setCvFile]         = useState<File | null>(null);
    
    // Preview states
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview]   = useState<string | null>(null);

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
            {/* ── Hero Banner ─────────────────────────────────────────────────── */}
            <div className="relative">
                <div
                    className="h-32 sm:h-56 md:h-72 lg:h-80 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${coverUrl})`,
                        backgroundColor: PRIMARY_COLOR,
                    }}
                >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,177,79,0.15) 0%, rgba(0,0,0,0.4) 100%)' }}></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Row gutter={[24, 24]}>
                    
                    {/* ==================== LEFT SIDEBAR ==================== */}
                    <Col xs={24} lg={8} xl={7}>
                        {/* Profile Card */}
                        <Card
                            className="shadow-xl rounded-2xl md:rounded-3xl border-0 overflow-hidden relative z-10 w-full"
                            style={{ marginTop: 'calc(-4rem - 2vw)' }} /* responsive negative margin */
                            styles={{ body: { padding: 0 } }}
                        >
                            {/* Avatar & Name Section */}
                            <div className="flex flex-col items-center pt-6 sm:pt-8 pb-5 sm:pb-6 px-4 sm:px-6"
                                 style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
                                <div className="relative mb-3 sm:mb-4">
                                    <Avatar
                                        size={{ xs: 90, sm: 100, md: 110, lg: 120 }}
                                        src={avatarUrl}
                                        className="border-4 border-white shadow-lg"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        {profile.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute bottom-1 sm:-bottom-1 right-1 sm:-right-1 w-5 h-5 sm:w-7 sm:h-7 bg-green-500 rounded-full border-2 sm:border-3 border-white shadow-md flex items-center justify-center">
                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <Title level={4} className="!m-0 !mb-1 text-center text-lg sm:text-xl">
                                    {profile.fullName}
                                </Title>
                                {profile.professionalTitle && (
                                    <Text className="text-gray-500 text-xs sm:text-sm text-center block mb-2 sm:mb-3 font-medium">
                                        {profile.professionalTitle}
                                    </Text>
                                )}
                                <Space wrap size={[6, 8]} className="justify-center mb-3 sm:mb-4">
                                    {profile.roleName && (
                                        <Tag color={PRIMARY_COLOR} className="!m-0 !px-2.5 sm:!px-3 !py-0.5 text-[10px] sm:text-xs font-semibold">
                                            <CheckCircleOutlined className="mr-1" />
                                            {profile.roleName}
                                        </Tag>
                                    )}
                                    <Tag color="default" className="!m-0 !px-2.5 sm:!px-3 !py-0.5 text-[10px] sm:text-xs font-medium bg-gray-100">
                                        <TeamOutlined className="mr-1" />
                                        {profile.followerCount} theo dõi
                                    </Tag>
                                </Space>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleOpenEdit}
                                    block
                                    size="large"
                                    className="!rounded-xl !font-semibold !bg-[#00B14F] hover:!bg-[#00a347] !border-0 h-10 sm:h-12 shadow-md text-sm"
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </div>

                            <Divider className="!my-0" />

                            {/* Contact Details */}
                            <div className="px-4 py-4 sm:px-6 sm:py-5">
                                <Text className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3 sm:mb-4">
                                    Thông tin liên hệ
                                </Text>
                                <Space direction="vertical" size={14} className="w-full">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <MailOutlined className="text-[#00B14F] text-sm sm:text-base" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Text type="secondary" className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide block">Email</Text>
                                            <Text className="text-xs sm:text-sm font-medium truncate block">{profile.email}</Text>
                                        </div>
                                    </div>
                                    {profile.phoneNumber && (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <PhoneOutlined className="text-blue-500 text-sm sm:text-base" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Text type="secondary" className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide block">Điện thoại</Text>
                                                <Text className="text-xs sm:text-sm font-medium">{profile.phoneNumber}</Text>
                                            </div>
                                        </div>
                                    )}
                                    {profile.address && (
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <EnvironmentOutlined className="text-orange-500 text-sm sm:text-base" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Text type="secondary" className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide block">Địa chỉ</Text>
                                                <Text className="text-xs sm:text-sm font-medium line-clamp-2">{profile.address}</Text>
                                            </div>
                                        </div>
                                    )}
                                </Space>
                            </div>

                            {/* Social Links */}
                            {(profile.websiteUrl || profile.linkedInUrl || profile.gitHubUrl) && (
                                <>
                                    <Divider className="!my-0" />
                                    <div className="px-4 py-4 sm:px-6 sm:py-5">
                                        <Text className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3 sm:mb-4">
                                            Liên kết
                                        </Text>
                                        <div className="flex gap-3 justify-center flex-wrap">
                                            {profile.websiteUrl && (
                                                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <GlobalOutlined className="text-base sm:text-lg text-[#00B14F]" />
                                                    </div>
                                                </a>
                                            )}
                                            {profile.linkedInUrl && (
                                                <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <LinkedinOutlined className="text-base sm:text-lg text-[#0077B5]" />
                                                    </div>
                                                </a>
                                            )}
                                            {profile.gitHubUrl && (
                                                <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <GithubOutlined className="text-base sm:text-lg text-gray-800" />
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>

                        {/* CV Card */}
                        <Card
                            className="shadow-md hover:shadow-lg rounded-2xl border-0 mt-4 sm:mt-6 transition-all duration-300"
                            styles={{ body: { padding: '16px sm:20px' } }}
                        >
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <FileTextOutlined className="text-[#00B14F] text-lg sm:text-xl" />
                                <Text className="text-sm sm:text-base font-bold text-gray-900">CV của tôi</Text>
                            </div>
                            {profile.defaultCvUrl ? (
                                <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center shadow-sm border border-green-100 flex-shrink-0">
                                            <FileTextOutlined className="text-xl sm:text-2xl text-[#00B14F]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Text strong className="block text-xs sm:text-sm mb-0.5">CV mặc định</Text>
                                            <Text type="secondary" className="text-[11px] sm:text-xs block line-clamp-1" title={profile.defaultCvUrl}>
                                                {profile.defaultCvUrl.split('/').pop() || 'Đã tải lên'}
                                            </Text>
                                        </div>
                                    </div>
                                    <a
                                        href={profile.defaultCvUrl.startsWith('http') ? profile.defaultCvUrl : `https://localhost:7016${profile.defaultCvUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-block"
                                    >
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            block
                                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg text-xs sm:text-sm font-semibold h-9 sm:h-10"
                                        >
                                            Xem CV
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-5 sm:py-6 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <FileTextOutlined className="text-3xl sm:text-4xl text-gray-300 mb-2" />
                                    <Text type="secondary" className="block text-xs sm:text-sm font-medium">Chưa có CV</Text>
                                    <Text type="secondary" className="block text-[10px] sm:text-xs mt-1">
                                        Nhấn "Chỉnh sửa hồ sơ" để tải lên
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* ==================== RIGHT MAIN CONTENT ==================== */}
                    <Col xs={24} lg={16} xl={17}>
                        <div className="flex flex-col gap-4 sm:gap-6 lg:mt-[calc(-4rem-2vw)]">
                            
                            {/* Bio Section */}
                            <Card
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 overflow-hidden relative z-10 transition-all duration-300"
                                styles={{ body: { padding: '20px 24px' } }}
                            >
                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                                        <IdcardOutlined className="text-base sm:text-lg text-[#00B14F]" />
                                    </div>
                                    <Title level={4} className="!m-0 text-base sm:text-lg lg:text-xl !font-bold text-gray-900">
                                        Giới thiệu
                                    </Title>
                                </div>
                                {profile.bio ? (
                                    <Paragraph className="!mb-0 text-gray-600 text-[13px] sm:text-[15px] leading-relaxed sm:leading-7">
                                        {profile.bio}
                                    </Paragraph>
                                ) : (
                                    <div className="text-center py-6 sm:py-8">
                                        <Text type="secondary" className="text-xs sm:text-sm">
                                            Chưa có giới thiệu. Nhấn "Chỉnh sửa hồ sơ" để thêm.
                                        </Text>
                                    </div>
                                )}
                            </Card>

                            {/* Tabs: Education & Experience */}
                            <Card
                                className="shadow-md hover:shadow-lg rounded-2xl border-0 overflow-hidden transition-all duration-300"
                                styles={{ body: { padding: '10px 16px 20px', '@media (min-width: 640px)': { padding: '12px 24px 24px' } } as any }}
                            >
                                <Tabs
                                    defaultActiveKey="education"
                                    size="small"
                                    className="profile-tabs sm:!text-base"
                                    items={[
                                        {
                                            key: 'education',
                                            label: (
                                                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm lg:text-base px-2 py-1 sm:p-2">
                                                    <BookOutlined />
                                                    Học vấn
                                                    {profile.educations && profile.educations.length > 0 && (
                                                        <Tag color={PRIMARY_COLOR} className="!m-0 !ml-1 !px-1.5 sm:!px-2 !py-0 text-[10px] sm:text-xs font-bold">
                                                            {profile.educations.length}
                                                        </Tag>
                                                    )}
                                                </span>
                                            ),
                                            children: (
                                                <div className="mt-2 sm:mt-4">
                                                    {profile.educations && profile.educations.length > 0 ? (
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {profile.educations.map((edu, index) => (
                                                                <div key={edu.id} className="relative pl-6 sm:pl-8 pb-4">
                                                                    {/* Timeline dot & line */}
                                                                    <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#00B14F] border-[3px] sm:border-4 border-green-100 z-10"></div>
                                                                    {index < (profile.educations?.length ?? 0) - 1 && (
                                                                        <div className="absolute left-[5px] sm:left-[7px] top-4 sm:top-5 w-[2px] h-full bg-green-100"></div>
                                                                    )}
                                                                    <div className="bg-gradient-to-r from-green-50 to-transparent p-3 sm:p-4 lg:p-5 rounded-xl hover:from-green-100 transition-all duration-200">
                                                                        <Title level={5} className="!m-0 !mb-0.5 sm:!mb-1 text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">
                                                                            {edu.schoolName}
                                                                        </Title>
                                                                        <Text className="text-gray-600 block font-medium text-xs sm:text-sm mb-2">
                                                                            {edu.major}
                                                                        </Text>
                                                                        <Tag color="green" className="!px-2 sm:!px-3 !py-0.5 text-[10px] sm:text-xs font-semibold !m-0">
                                                                            {edu.startDate} — {edu.endDate || "Hiện tại"}
                                                                        </Tag>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 sm:py-12">
                                                            <BookOutlined className="text-4xl sm:text-5xl text-gray-200 mb-2 sm:mb-3" />
                                                            <Text type="secondary" className="block text-sm sm:text-base">Chưa có thông tin học vấn</Text>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        },
                                        {
                                            key: 'experience',
                                            label: (
                                                <span className="flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm lg:text-base px-2 py-1 sm:p-2">
                                                    <TrophyOutlined />
                                                    Kinh nghiệm
                                                    {profile.experiences && profile.experiences.length > 0 && (
                                                        <Tag color="blue" className="!m-0 !ml-1 !px-1.5 sm:!px-2 !py-0 text-[10px] sm:text-xs font-bold">
                                                            {profile.experiences.length}
                                                        </Tag>
                                                    )}
                                                </span>
                                            ),
                                            children: (
                                                <div className="mt-2 sm:mt-4">
                                                    {profile.experiences && profile.experiences.length > 0 ? (
                                                        <div className="space-y-4 sm:space-y-6">
                                                            {profile.experiences.map((exp, index) => (
                                                                <div key={exp.id} className="relative pl-6 sm:pl-8 pb-4">
                                                                    {/* Timeline dot & line */}
                                                                    <div className="absolute left-0 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 border-[3px] sm:border-4 border-blue-100 z-10"></div>
                                                                    {index < (profile.experiences?.length ?? 0) - 1 && (
                                                                        <div className="absolute left-[5px] sm:left-[7px] top-4 sm:top-5 w-[2px] h-full bg-blue-100"></div>
                                                                    )}
                                                                    <div className="bg-gradient-to-r from-blue-50 to-transparent p-3 sm:p-4 lg:p-5 rounded-xl hover:from-blue-100 transition-all duration-200">
                                                                        <Title level={5} className="!m-0 !mb-0.5 sm:!mb-1 text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">
                                                                            {exp.position}
                                                                        </Title>
                                                                        <Text className="text-gray-600 block font-semibold text-xs sm:text-sm mb-2">
                                                                            {exp.company}
                                                                        </Text>
                                                                        <Tag color="blue" className="!px-2 sm:!px-3 !py-0.5 text-[10px] sm:text-xs font-semibold mb-2 !m-0">
                                                                            {exp.startDate} — {exp.endDate || "Hiện tại"}
                                                                        </Tag>
                                                                        {exp.description && (
                                                                            <Paragraph className="!mt-2 !mb-0 text-gray-500 text-[11px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                                                                                {exp.description}
                                                                            </Paragraph>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-8 sm:py-12">
                                                            <TrophyOutlined className="text-4xl sm:text-5xl text-gray-200 mb-2 sm:mb-3" />
                                                            <Text type="secondary" className="block text-sm sm:text-base">Chưa có kinh nghiệm làm việc</Text>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            </Card>
                        </div>
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
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4 sm:mt-6"
                >
                    {/* Avatar & Cover Upload */}
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200">
                        {/* Avatar Upload */}
                        <div className="md:col-span-1 text-center">
                            <Text type="secondary" className="block mb-3 sm:mb-4 font-semibold text-[10px] sm:text-xs uppercase tracking-wide">
                                Ảnh đại diện
                            </Text>
                            <input
                                type="file"
                                id="avatar-upload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setAvatarFile(file);
                                        setAvatarPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <label htmlFor="avatar-upload" className="cursor-pointer inline-block">
                                <div className="relative group">
                                    <Avatar
                                        size={{ xs: 90, sm: 100, md: 120 }}
                                        src={avatarPreview || buildImageUrl(profile?.avatarUrl)}
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                        className="shadow-lg border-[3px] sm:border-4 border-white"
                                    >
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
                                type="file"
                                id="cover-upload-candidate"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setCoverFile(file);
                                        setCoverPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />
                            <label htmlFor="cover-upload-candidate" className="cursor-pointer block">
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
                            <span>👤</span>
                            <span>Thông tin cơ bản</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Họ và tên</span>}
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                    className="mb-3 sm:mb-6"
                                >
                                    <Input placeholder="Nhập họ và tên" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item 
                                    label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Số điện thoại</span>} 
                                    name="phoneNumber" 
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^(0[0-9]{9,10})$/, message: 'Số điện thoại không hợp lệ' }]}
                                    className="mb-3 sm:mb-6"
                                >
                                    <Input placeholder="VD: 0912345678" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item 
                            label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Chức danh / Nghề nghiệp</span>} 
                            name="professionalTitle" 
                            rules={[{ required: true, message: 'Vui lòng nhập chức danh / nghề nghiệp' }]}
                            className="mb-3 sm:mb-6"
                        >
                            <Input placeholder="VD: Senior Software Engineer" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Giới thiệu bản thân</span>} name="bio" className="mb-3 sm:mb-6">
                            <TextArea
                                rows={4}
                                placeholder="Viết một vài dòng giới thiệu về bản thân..."
                                className="!rounded-lg text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2"
                            />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Địa chỉ</span>} name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]} className="mb-0 sm:mb-6">
                            <Input placeholder="VD: Hà Nội, Việt Nam" className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2" />
                        </Form.Item>
                    </div>

                    <Divider className="!my-6 sm:!my-8" />

                    <div className="mb-6 sm:mb-8">
                        <Title level={5} className="!text-base sm:!text-lg !font-bold !mb-4 sm:!mb-6 !text-gray-900 flex items-center gap-2">
                            <span>🔗</span>
                            <span>Liên kết xã hội</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Website</span>} name="websiteUrl" className="mb-3 sm:mb-6">
                                    <Input
                                        prefix={<GlobalOutlined className="text-[#00B14F] mr-1" />}
                                        placeholder="https://..."
                                        className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">LinkedIn</span>} name="linkedInUrl" className="mb-3 sm:mb-6">
                                    <Input
                                        prefix={<LinkedinOutlined className="text-[#0077B5] mr-1" />}
                                        placeholder="https://linkedin.com/..."
                                        className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">GitHub</span>} name="gitHubUrl" className="mb-0 sm:mb-6">
                                    <Input
                                        prefix={<GithubOutlined className="text-gray-800 mr-1" />}
                                        placeholder="https://github.com/..."
                                        className="!rounded-lg text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* CV Upload */}
                    <Divider className="!my-6 sm:!my-8" />
                    <Title level={5} className="!text-base sm:!text-lg !font-bold !mb-4 sm:!mb-6 !text-gray-900 flex items-center gap-2">
                        <span>📄</span>
                        <span>CV của bạn</span>
                    </Title>
                    <Form.Item label={<span className="font-semibold text-gray-700 text-xs sm:text-sm">Tải lên CV mới</span>} className="mb-0">
                        <Upload
                            beforeUpload={(file) => {
                                setCvFile(file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".pdf,.doc,.docx"
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

                    <Divider className="!border-dashed !my-6 sm:!my-8" />
                    
                    <div className="flex justify-end gap-3 sm:gap-4 mt-2">
                        <Button
                            onClick={() => setIsEditModalOpen(false)}
                            className="!rounded-lg !font-semibold text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={updating}
                            icon={<SaveOutlined />}
                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg !font-semibold text-xs sm:text-sm h-9 sm:h-10 px-5 sm:px-8"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CandidateProfilePage;
