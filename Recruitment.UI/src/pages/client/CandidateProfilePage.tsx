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
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);
    // Preview states
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
            fullName: profile?.fullName || "",
            phoneNumber: profile?.phoneNumber || "",
            professionalTitle: profile?.professionalTitle || "",
            bio: profile?.bio || "",
            address: profile?.address || "",
            websiteUrl: profile?.websiteUrl || "",
            linkedInUrl: profile?.linkedInUrl || "",
            gitHubUrl: profile?.gitHubUrl || "",
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
            fullName: values.fullName,
            phoneNumber: values.phoneNumber || '',
            professionalTitle: values.professionalTitle || '',
            bio: values.bio || '',
            address: values.address || '',
            websiteUrl: values.websiteUrl || '',
            linkedInUrl: values.linkedInUrl || '',
            gitHubUrl: values.gitHubUrl || '',
            avatarFile: avatarFile ?? undefined,
            coverFile: coverFile ?? undefined,
            cvFile: cvFile ?? undefined,
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
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 30%, #f0f9ff 70%, #f8fafc 100%)' }}>
            {/* Hero Banner */}
            <div className="relative">
                <div
                    className="h-56 md:h-72 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${coverUrl})`,
                        backgroundColor: PRIMARY_COLOR,
                    }}
                >
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,177,79,0.15) 0%, rgba(0,0,0,0.4) 100%)' }}></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <Row gutter={[28, 28]}>
                    {/* ==================== LEFT SIDEBAR ==================== */}
                    <Col xs={24} lg={7}>
                        {/* Profile Card - overlaps the banner */}
                        <Card
                            className="shadow-2xl rounded-3xl border-0 overflow-hidden -mt-28 relative z-10"
                            styles={{ body: { padding: 0 } }}
                        >
                            {/* Avatar & Name Section */}
                            <div className="flex flex-col items-center pt-8 pb-6 px-6" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }}>
                                <div className="relative mb-4">
                                    <Avatar
                                        size={120}
                                        src={avatarUrl}
                                        className="border-4 border-white shadow-xl"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        {profile.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white shadow-md flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                                <Title level={4} className="!m-0 !mb-1 text-center !text-xl">
                                    {profile.fullName}
                                </Title>
                                {profile.professionalTitle && (
                                    <Text className="text-gray-500 text-sm text-center block mb-3 font-medium">
                                        {profile.professionalTitle}
                                    </Text>
                                )}
                                <Space wrap size={[6, 8]} className="justify-center mb-4">
                                    {profile.roleName && (
                                        <Tag color={PRIMARY_COLOR} className="!m-0 !px-3 !py-0.5 text-xs font-semibold">
                                            <CheckCircleOutlined className="mr-1" />
                                            {profile.roleName}
                                        </Tag>
                                    )}
                                    <Tag color="default" className="!m-0 !px-3 !py-0.5 text-xs font-medium bg-gray-100">
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
                                    className="!rounded-xl !font-semibold !bg-[#00B14F] hover:!bg-[#00a347] !border-0 !h-12 shadow-md"
                                >
                                    Chỉnh sửa hồ sơ
                                </Button>
                            </div>

                            <Divider className="!my-0" />

                            {/* Contact Details */}
                            <div className="px-6 py-5">
                                <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-4">
                                    Thông tin liên hệ
                                </Text>
                                <Space direction="vertical" size={14} className="w-full">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <MailOutlined className="text-[#00B14F] text-base" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Text type="secondary" className="text-[10px] font-semibold uppercase tracking-wide block">Email</Text>
                                            <Text className="text-sm font-medium truncate block">{profile.email}</Text>
                                        </div>
                                    </div>
                                    {profile.phoneNumber && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <PhoneOutlined className="text-blue-500 text-base" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Text type="secondary" className="text-[10px] font-semibold uppercase tracking-wide block">Điện thoại</Text>
                                                <Text className="text-sm font-medium">{profile.phoneNumber}</Text>
                                            </div>
                                        </div>
                                    )}
                                    {profile.address && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                                                <EnvironmentOutlined className="text-orange-500 text-base" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Text type="secondary" className="text-[10px] font-semibold uppercase tracking-wide block">Địa chỉ</Text>
                                                <Text className="text-sm font-medium">{profile.address}</Text>
                                            </div>
                                        </div>
                                    )}
                                </Space>
                            </div>

                            {/* Social Links */}
                            {(profile.websiteUrl || profile.linkedInUrl || profile.gitHubUrl) && (
                                <>
                                    <Divider className="!my-0" />
                                    <div className="px-6 py-5">
                                        <Text className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-4">
                                            Liên kết
                                        </Text>
                                        <div className="flex gap-3 justify-center">
                                            {profile.websiteUrl && (
                                                <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <GlobalOutlined className="text-lg text-[#00B14F]" />
                                                    </div>
                                                </a>
                                            )}
                                            {profile.linkedInUrl && (
                                                <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <LinkedinOutlined className="text-lg text-[#0077B5]" />
                                                    </div>
                                                </a>
                                            )}
                                            {profile.gitHubUrl && (
                                                <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer">
                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-110">
                                                        <GithubOutlined className="text-lg text-gray-800" />
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
                            className="shadow-lg hover:shadow-xl rounded-2xl border-0 mt-6 transition-all duration-300 overflow-hidden"
                            styles={{ body: { padding: '20px' } }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <FileTextOutlined className="text-[#00B14F] text-xl" />
                                <Text className="text-base font-bold text-gray-900">CV của tôi</Text>
                            </div>
                            {profile.defaultCvUrl ? (
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-green-100">
                                            <FileTextOutlined className="text-2xl text-[#00B14F]" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Text strong className="block text-sm mb-0.5">CV mặc định</Text>
                                            <Text type="secondary" className="text-xs block truncate" title={profile.defaultCvUrl}>
                                                {profile.defaultCvUrl.split('/').pop() || 'Đã tải lên'}
                                            </Text>
                                        </div>
                                    </div>
                                    <a
                                        href={profile.defaultCvUrl.startsWith('http') ? profile.defaultCvUrl : `https://localhost:7016${profile.defaultCvUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            block
                                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg font-semibold"
                                        >
                                            Xem CV
                                        </Button>
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <FileTextOutlined className="text-4xl text-gray-300 mb-2" />
                                    <Text type="secondary" className="block text-sm font-medium">Chưa có CV</Text>
                                    <Text type="secondary" className="block text-xs mt-1">
                                        Nhấn "Chỉnh sửa hồ sơ" để tải lên
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* ==================== RIGHT MAIN CONTENT ==================== */}
                    <Col xs={24} lg={17}>
                        {/* Bio Section */}
                        <Card
                            className="shadow-lg hover:shadow-xl rounded-2xl border-0 mt-0 lg:-mt-28 relative z-10 overflow-hidden transition-all duration-300"
                            styles={{ body: { padding: '28px 32px' } }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                                    <IdcardOutlined className="text-lg text-[#00B14F]" />
                                </div>
                                <Title level={4} className="!m-0 !text-lg !font-bold text-gray-900">
                                    Giới thiệu
                                </Title>
                            </div>
                            {profile.bio ? (
                                <Paragraph className="!mb-0 text-gray-600 text-[15px] leading-7">
                                    {profile.bio}
                                </Paragraph>
                            ) : (
                                <div className="text-center py-8">
                                    <Text type="secondary" className="text-sm">
                                        Chưa có giới thiệu. Nhấn "Chỉnh sửa hồ sơ" để thêm.
                                    </Text>
                                </div>
                            )}
                        </Card>

                        {/* Tabs: Education & Experience */}
                        <Card
                            className="shadow-lg hover:shadow-xl rounded-2xl border-0 mt-6 overflow-hidden transition-all duration-300"
                            styles={{ body: { padding: '8px 24px 24px' } }}
                        >
                            <Tabs
                                defaultActiveKey="education"
                                size="large"
                                className="profile-tabs"
                                items={[
                                    {
                                        key: 'education',
                                        label: (
                                            <span className="flex items-center gap-2 font-semibold">
                                                <BookOutlined />
                                                Học vấn
                                                {profile.educations && profile.educations.length > 0 && (
                                                    <Tag color={PRIMARY_COLOR} className="!m-0 !ml-1 !px-2 !py-0 text-xs font-bold">
                                                        {profile.educations.length}
                                                    </Tag>
                                                )}
                                            </span>
                                        ),
                                        children: (
                                            <div>
                                                {profile.educations && profile.educations.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {profile.educations.map((edu, index) => (
                                                            <div
                                                                key={edu.id}
                                                                className="relative pl-8 pb-4"
                                                            >
                                                                {/* Timeline dot & line */}
                                                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[#00B14F] border-4 border-green-100 z-10"></div>
                                                                {index < (profile.educations?.length ?? 0) - 1 && (
                                                                    <div className="absolute left-[7px] top-5 w-0.5 h-full bg-green-100"></div>
                                                                )}
                                                                <div className="bg-gradient-to-r from-green-50 to-transparent p-5 rounded-xl hover:from-green-100 transition-all duration-200">
                                                                    <Title level={5} className="!m-0 !mb-1 !text-base font-bold text-gray-900">
                                                                        {edu.schoolName}
                                                                    </Title>
                                                                    <Text className="text-gray-600 block font-medium text-sm mb-2">
                                                                        {edu.major}
                                                                    </Text>
                                                                    <Tag color="green" className="!px-3 !py-0.5 text-xs font-semibold">
                                                                        {edu.startDate} — {edu.endDate || "Hiện tại"}
                                                                    </Tag>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <BookOutlined className="text-5xl text-gray-200 mb-3" />
                                                        <Text type="secondary" className="block text-base">Chưa có thông tin học vấn</Text>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: 'experience',
                                        label: (
                                            <span className="flex items-center gap-2 font-semibold">
                                                <TrophyOutlined />
                                                Kinh nghiệm
                                                {profile.experiences && profile.experiences.length > 0 && (
                                                    <Tag color="blue" className="!m-0 !ml-1 !px-2 !py-0 text-xs font-bold">
                                                        {profile.experiences.length}
                                                    </Tag>
                                                )}
                                            </span>
                                        ),
                                        children: (
                                            <div>
                                                {profile.experiences && profile.experiences.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {profile.experiences.map((exp, index) => (
                                                            <div
                                                                key={exp.id}
                                                                className="relative pl-8 pb-4"
                                                            >
                                                                {/* Timeline dot & line */}
                                                                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100 z-10"></div>
                                                                {index < (profile.experiences?.length ?? 0) - 1 && (
                                                                    <div className="absolute left-[7px] top-5 w-0.5 h-full bg-blue-100"></div>
                                                                )}
                                                                <div className="bg-gradient-to-r from-blue-50 to-transparent p-5 rounded-xl hover:from-blue-100 transition-all duration-200">
                                                                    <Title level={5} className="!m-0 !mb-1 !text-base font-bold text-gray-900">
                                                                        {exp.position}
                                                                    </Title>
                                                                    <Text className="text-gray-600 block font-semibold text-sm mb-1">
                                                                        {exp.company}
                                                                    </Text>
                                                                    <Tag color="blue" className="!px-3 !py-0.5 text-xs font-semibold mb-2">
                                                                        {exp.startDate} — {exp.endDate || "Hiện tại"}
                                                                    </Tag>
                                                                    {exp.description && (
                                                                        <Paragraph className="!mt-2 !mb-0 text-gray-500 text-sm leading-relaxed">
                                                                            {exp.description}
                                                                        </Paragraph>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <TrophyOutlined className="text-5xl text-gray-200 mb-3" />
                                                        <Text type="secondary" className="block text-base">Chưa có kinh nghiệm làm việc</Text>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* ==================== EDIT MODAL ==================== */}
            <Modal
                title={
                    <span className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-3xl">✏️</span>
                        <span>Chỉnh sửa hồ sơ</span>
                    </span>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={750}
                centered
                className="!rounded-2xl"
                styles={{ body: { padding: '32px' } }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-6"
                >
                    {/* Avatar & Cover Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                        {/* Avatar Upload */}
                        <div className="md:col-span-1 text-center">
                            <Text type="secondary" className="block mb-4 font-semibold text-xs uppercase tracking-wide">
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
                                        size={120}
                                        src={avatarPreview || buildImageUrl(profile?.avatarUrl)}
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                        className="shadow-lg border-4 border-white"
                                    >
                                        {profile?.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                        <CameraOutlined className="text-white text-2xl" />
                                    </div>
                                </div>
                            </label>
                            {avatarFile && (
                                <Text type="success" className="mt-3 block text-xs font-semibold">
                                    ✓ {avatarFile.name}
                                </Text>
                            )}
                        </div>

                        {/* Cover Upload */}
                        <div className="md:col-span-2">
                            <Text type="secondary" className="block mb-4 font-semibold text-xs uppercase tracking-wide">
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
                                    className="h-40 rounded-xl bg-cover bg-center relative group overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#00B14F] transition-colors duration-200"
                                    style={{
                                        backgroundImage: `url(${coverPreview || buildImageUrl(profile?.coverImageUrl) || 'https://via.placeholder.com/1200x300?text=Cover+Image'})`,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center">
                                        <CameraOutlined className="text-white text-3xl mb-2" />
                                        <Text className="text-white text-sm font-semibold">Nhấp để thay đổi</Text>
                                    </div>
                                </div>
                            </label>
                            {coverFile && (
                                <Text type="success" className="mt-3 block text-xs font-semibold">
                                    ✓ Đã chọn: {coverFile.name}
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="mb-8">
                        <Title level={5} className="!text-lg !font-bold !mb-6 !text-gray-900 flex items-center gap-2">
                            <span>👤</span>
                            <span>Thông tin cơ bản</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label={<span className="font-semibold text-gray-700">Họ và tên</span>}
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                                >
                                    <Input placeholder="Nhập họ và tên" size="large" className="!rounded-lg" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item label={<span className="font-semibold text-gray-700">Số điện thoại</span>} name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }, { pattern: /^(0[0-9]{9,10})$/, message: 'Số điện thoại không hợp lệ' }]}>
                                    <Input placeholder="VD: 0912345678" size="large" className="!rounded-lg" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label={<span className="font-semibold text-gray-700">Chức danh / Nghề nghiệp</span>} name="professionalTitle" rules={[{ required: true, message: 'Vui lòng nhập chức danh / nghề nghiệp' }]}>
                            <Input placeholder="VD: Senior Software Engineer" size="large" className="!rounded-lg" />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700">Giới thiệu bản thân</span>} name="bio">
                            <TextArea
                                rows={4}
                                placeholder="Viết một vài dòng giới thiệu về bản thân..."
                                className="!rounded-lg"
                            />
                        </Form.Item>
                        <Form.Item label={<span className="font-semibold text-gray-700">Địa chỉ</span>} name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                            <Input placeholder="VD: Hà Nội, Việt Nam" size="large" className="!rounded-lg" />
                        </Form.Item>
                    </div>

                    <Divider className="!my-8" />

                    <div className="mb-8">
                        <Title level={5} className="!text-lg !font-bold !mb-6 !text-gray-900 flex items-center gap-2">
                            <span>🔗</span>
                            <span>Liên kết xã hội</span>
                        </Title>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700">Website</span>} name="websiteUrl">
                                    <Input
                                        prefix={<GlobalOutlined className="text-[#00B14F]" />}
                                        placeholder="https://..."
                                        size="large"
                                        className="!rounded-lg"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700">LinkedIn</span>} name="linkedInUrl">
                                    <Input
                                        prefix={<LinkedinOutlined className="text-[#0077B5]" />}
                                        placeholder="https://linkedin.com/..."
                                        size="large"
                                        className="!rounded-lg"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Form.Item label={<span className="font-semibold text-gray-700">GitHub</span>} name="gitHubUrl">
                                    <Input
                                        prefix={<GithubOutlined className="text-gray-800" />}
                                        placeholder="https://github.com/..."
                                        size="large"
                                        className="!rounded-lg"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* CV Upload */}
                    <Divider className="!my-8" />
                    <Title level={5} className="!text-lg !font-bold !mb-6 !text-gray-900 flex items-center gap-2">
                        <span>📄</span>
                        <span>CV của bạn</span>
                    </Title>
                    <Form.Item label={<span className="font-semibold text-gray-700">Tải lên CV mới</span>}>
                        <Upload
                            beforeUpload={(file) => {
                                setCvFile(file);
                                return false;
                            }}
                            maxCount={1}
                            accept=".pdf,.doc,.docx"
                            fileList={cvFile ? [{ uid: '-1', name: cvFile.name, status: 'done' as const }] : []}
                            onRemove={() => setCvFile(null)}
                        >
                            <Button size="large" icon={<UploadOutlined />} className="!rounded-lg !font-semibold">
                                Chọn file CV (PDF, DOC)
                            </Button>
                        </Upload>
                        {cvFile && (
                            <Text type="success" className="mt-3 block text-sm font-semibold">
                                ✓ Đã chọn: {cvFile.name}
                            </Text>
                        )}
                    </Form.Item>

                    <Divider className="!my-8" />
                    <div className="flex justify-end gap-4">
                        <Button
                            size="large"
                            onClick={() => setIsEditModalOpen(false)}
                            className="!rounded-lg !font-semibold !px-8"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={updating}
                            icon={<SaveOutlined />}
                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0 !rounded-lg !font-semibold !px-8"
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
