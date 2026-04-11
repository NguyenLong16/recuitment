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
} from "antd";
import {
    BuildOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    EditOutlined,
    EnvironmentOutlined,
    GithubOutlined,
    GlobalOutlined,
    LinkedinOutlined,
    MailOutlined,
    PhoneOutlined,
    SaveOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import useMyProfile from "../../hooks/useMyProfile";
import { UpdateProfileRequest } from "../../types/profile";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const PRIMARY_COLOR = "#00B14F";

const HRMyProfilePage = () => {
    const { profile, loading, updating, updateProfile } = useMyProfile();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [form] = Form.useForm();
    // File states
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
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
    const companyLogoUrl = buildImageUrl(profile?.company?.logoUrl);

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
        };

        const success = await updateProfile(payload);
        if (success) {
            setIsEditModalOpen(false);
            setAvatarFile(null);
            setCoverFile(null);
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
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
            {/* Cover Image Section */}
            <div
                className="relative h-72 md:h-96 bg-cover bg-center overflow-hidden"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundColor: PRIMARY_COLOR,
                }}
            >
                <div className="absolute inset-0 bg-black/25"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
                {/* Profile Header Card */}
                <Card
                    className="shadow-2xl rounded-3xl border-0 mb-8 overflow-hidden"
                    styles={{ body: { padding: 0 } }}
                >
                    <div className="bg-white p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <Avatar
                                        size={140}
                                        src={avatarUrl}
                                        className="border-4 border-white shadow-2xl"
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        {profile.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div>
                                        <Title level={2} className="!m-0 !mb-2 !text-3xl md:!text-4xl">
                                            {profile.fullName}
                                        </Title>
                                        {profile.professionalTitle && (
                                            <Text className="text-xl text-gray-600 block mb-3 font-medium">
                                                {profile.professionalTitle}
                                            </Text>
                                        )}
                                        <Space wrap size={[8, 12]} className="mb-4">
                                            {profile.roleName && (
                                                <Tag
                                                    color={PRIMARY_COLOR}
                                                    className="!m-0 !px-3 !py-1 text-sm font-medium"
                                                >
                                                    <CheckCircleOutlined className="mr-1.5" />
                                                    {profile.roleName}
                                                </Tag>
                                            )}
                                            {profile.company && (
                                                <Tag
                                                    color="blue"
                                                    className="!m-0 !px-3 !py-1 text-sm font-medium"
                                                >
                                                    <BuildOutlined className="mr-1.5" />
                                                    {profile.company.companyName}
                                                </Tag>
                                            )}
                                            <Tag
                                                color="default"
                                                className="!m-0 !px-3 !py-1 text-sm font-medium bg-gray-100"
                                            >
                                                <TeamOutlined className="mr-1.5" />
                                                {profile.followerCount} người theo dõi
                                            </Tag>
                                        </Space>
                                    </div>
                                    {/* Edit Button */}
                                    <div>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<EditOutlined />}
                                            onClick={handleOpenEdit}
                                            className="!h-14 !px-8 !rounded-xl !font-semibold shadow-lg !bg-[#00B14F] hover:!bg-[#00a347] !border-0 transition-all duration-300"
                                        >
                                            Chỉnh sửa hồ sơ
                                        </Button>
                                    </div>
                                </div>
                                {/* Bio */}
                                {profile.bio && (
                                    <Paragraph className="!mt-6 !mb-0 text-gray-700 text-base leading-relaxed">
                                        {profile.bio}
                                    </Paragraph>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <Row gutter={[24, 24]}>
                    {/* Left Column - Contact Info */}
                    <Col xs={24} lg={8}>
                        {/* Contact Information */}
                        <Card
                            title={
                                <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-2xl">📞</span>
                                    <span>Thông tin liên hệ</span>
                                </span>
                            }
                            className="shadow-lg hover:shadow-xl rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                            styles={{ body: { padding: '24px' } }}
                        >
                            <Space direction="vertical" size={20} className="w-full">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <div className="flex-shrink-0 text-2xl text-[#00B14F]">
                                        <MailOutlined />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Text type="secondary" className="text-xs font-semibold uppercase tracking-wide block mb-1">
                                            Email
                                        </Text>
                                        <Text className="text-sm font-medium truncate">{profile.email}</Text>
                                    </div>
                                </div>
                                {profile.phoneNumber && (
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 text-2xl text-[#00B14F]">
                                            <PhoneOutlined />
                                        </div>
                                        <div className="flex-1">
                                            <Text type="secondary" className="text-xs font-semibold uppercase tracking-wide block mb-1">
                                                Điện thoại
                                            </Text>
                                            <Text className="text-sm font-medium">{profile.phoneNumber}</Text>
                                        </div>
                                    </div>
                                )}
                                {profile.address && (
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="flex-shrink-0 text-2xl text-[#00B14F]">
                                            <EnvironmentOutlined />
                                        </div>
                                        <div className="flex-1">
                                            <Text type="secondary" className="text-xs font-semibold uppercase tracking-wide block mb-1">
                                                Địa chỉ
                                            </Text>
                                            <Text className="text-sm font-medium">{profile.address}</Text>
                                        </div>
                                    </div>
                                )}
                                {/* Social Links */}
                                {(profile.websiteUrl ||
                                    profile.linkedInUrl ||
                                    profile.gitHubUrl) && (
                                        <>
                                            <Divider className="!my-2" />
                                            <div className="flex gap-4 justify-center">
                                                {profile.websiteUrl && (
                                                    <a
                                                        href={profile.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<GlobalOutlined />}
                                                            className="!text-xl !text-gray-500 hover:!text-[#00B14F] transition-colors"
                                                        />
                                                    </a>
                                                )}
                                                {profile.linkedInUrl && (
                                                    <a
                                                        href={profile.linkedInUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<LinkedinOutlined />}
                                                            className="!text-xl !text-gray-500 hover:!text-[#0077B5] transition-colors"
                                                        />
                                                    </a>
                                                )}
                                                {profile.gitHubUrl && (
                                                    <a
                                                        href={profile.gitHubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<GithubOutlined />}
                                                            className="!text-xl !text-gray-500 hover:!text-gray-900 transition-colors"
                                                        />
                                                    </a>
                                                )}
                                            </div>
                                        </>
                                    )}
                            </Space>
                        </Card>

                        {/* Company Info */}
                        {profile.company && (
                            <Card
                                title={
                                    <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-2xl">🏢</span>
                                        <span>Công ty</span>
                                    </span>
                                }
                                className="shadow-lg hover:shadow-xl rounded-2xl border-0 mb-6 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '24px' } }}
                            >
                                <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                    {companyLogoUrl ? (
                                        <img
                                            src={companyLogoUrl}
                                            alt={profile.company.companyName}
                                            className="w-20 h-20 rounded-lg object-contain bg-white border border-gray-200 p-2"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
                                            <BuildOutlined className="text-3xl text-blue-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Title level={5} className="!m-0 !mb-2 text-lg font-bold">
                                            {profile.company.companyName}
                                        </Title>
                                        {profile.company.size && (
                                            <Tag color="blue" className="!px-3 !py-1 font-medium">
                                                <TeamOutlined className="mr-1" />
                                                {profile.company.size} nhân viên
                                            </Tag>
                                        )}
                                    </div>
                                </div>
                                {profile.company.description && (
                                    <Paragraph className="text-gray-700 !mb-6 text-sm leading-relaxed">
                                        {profile.company.description}
                                    </Paragraph>
                                )}
                                <Space direction="vertical" size={12} className="w-full">
                                    {profile.company.address && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <EnvironmentOutlined className="text-[#00B14F] text-lg flex-shrink-0 mt-0.5" />
                                            <Text className="text-sm">{profile.company.address}</Text>
                                        </div>
                                    )}
                                    {profile.company.websiteLink && (
                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <GlobalOutlined className="text-[#00B14F] text-lg flex-shrink-0 mt-0.5" />
                                            <a
                                                href={profile.company.websiteLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#00B14F] hover:underline text-sm break-all"
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
                        {profile.postedJobs && profile.postedJobs.length > 0 && (
                            <Card
                                title={
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <span className="text-2xl">💼</span>
                                            <span>Việc làm đã đăng</span>
                                        </span>
                                        <Tag color={PRIMARY_COLOR} className="!m-0 !px-3 !py-1 font-semibold">
                                            {profile.postedJobs.length} tin
                                        </Tag>
                                    </div>
                                }
                                className="shadow-lg hover:shadow-xl rounded-2xl border-0 transition-all duration-300 overflow-hidden"
                                styles={{ body: { padding: '24px' } }}
                            >
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.postedJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <Text strong className="text-base block mb-1 group-hover:text-[#00B14F] transition-colors">
                                                    {job.title}
                                                </Text>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <EnvironmentOutlined className="text-sm" />
                                                    <Text type="secondary" className="text-sm">
                                                        {job.locationName}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Tag
                                                color={PRIMARY_COLOR}
                                                className="!px-4 !py-1.5 font-semibold text-sm flex-shrink-0"
                                            >
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

            {/* Edit Profile Modal */}
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
                                id="avatar-upload-hr"
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
                            <label htmlFor="avatar-upload-hr" className="cursor-pointer inline-block">
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
                                id="cover-upload-hr"
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
                            <label htmlFor="cover-upload-hr" className="cursor-pointer block">
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
                            <Input placeholder="VD: HR Manager" size="large" className="!rounded-lg" />
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

export default HRMyProfilePage;
