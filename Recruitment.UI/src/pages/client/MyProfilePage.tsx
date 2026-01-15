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
import type { UploadProps } from "antd";
import { Role } from "../../types/auth";
import { useAppSelector } from "../../hooks/hook";
import { UpdateProfileRequest } from "../../types/profile";
import ProfileService from "../../services/profileService";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const PRIMARY_COLOR = "#00B14F";
const MyProfilePage = () => {
    const { profile, loading, updating, updateProfile, refetch } = useMyProfile();
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

            // Files
            avatarFile: avatarFile ?? undefined,
            coverFile: coverFile ?? undefined,
            cvFile: cvFile ?? undefined,
        };

        try {
            const response = await ProfileService.updateProfile(payload);
            console.log('✅ Cập nhật thành công:', response.data);
            setIsEditModalOpen(false);
            refetch();
        } catch (error) {
            console.error('❌ Lỗi cập nhật:', error);
        }
    };


    // Handle CV upload
    const handleCvChange: UploadProps["onChange"] = ({ file }) => {
        const originFile = file.originFileObj as File;
        if (originFile) {
            setCvFile(originFile);
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
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image Section */}
            <div
                className="relative h-64 md:h-80 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${coverUrl})`,
                    backgroundColor: PRIMARY_COLOR,
                }}
            >
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10 pb-12">
                {/* Profile Header Card */}
                <Card
                    className="shadow-xl rounded-2xl border-0 mb-6"
                    styles={{ body: { padding: 0 } }}
                >
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
                                    {/* Edit Button */}
                                    <div>
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<EditOutlined />}
                                            onClick={handleOpenEdit}
                                            className="!h-12 !px-6 !rounded-lg !font-medium shadow-lg !bg-[#00B14F] hover:!bg-[#00a347] !border-0"
                                        >
                                            Chỉnh sửa hồ sơ
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
                    {/* Left Column - Contact Info */}
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
                                        <Text type="secondary" className="text-sm block">
                                            Email
                                        </Text>
                                        <Text>{profile.email}</Text>
                                    </div>
                                </div>
                                {profile.phoneNumber && (
                                    <div className="flex items-center gap-3">
                                        <PhoneOutlined className="text-xl text-gray-400" />
                                        <div>
                                            <Text type="secondary" className="text-sm block">
                                                Điện thoại
                                            </Text>
                                            <Text>{profile.phoneNumber}</Text>
                                        </div>
                                    </div>
                                )}
                                {profile.address && (
                                    <div className="flex items-center gap-3">
                                        <EnvironmentOutlined className="text-xl text-gray-400" />
                                        <div>
                                            <Text type="secondary" className="text-sm block">
                                                Địa chỉ
                                            </Text>
                                            <Text>{profile.address}</Text>
                                        </div>
                                    </div>
                                )}
                                {/* Social Links */}
                                {(profile.websiteUrl ||
                                    profile.linkedInUrl ||
                                    profile.gitHubUrl) && (
                                        <>
                                            <Divider className="!my-2" />
                                            <Space size={16}>
                                                {profile.websiteUrl && (
                                                    <a
                                                        href={profile.websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            type="text"
                                                            icon={<GlobalOutlined />}
                                                            className="!text-gray-500 hover:!text-[#00B14F]"
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
                                                            className="!text-gray-500 hover:!text-[#0077B5]"
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
                                                            className="!text-gray-500 hover:!text-[#333]"
                                                        />
                                                    </a>
                                                )}
                                            </Space>
                                        </>
                                    )}
                            </Space>
                        </Card>
                        {/* CV Section - Only for Candidate */}
                        {isCandidate && (
                            <Card
                                title={
                                    <span className="text-lg font-semibold">
                                        📄 CV của tôi
                                    </span>
                                }
                                className="shadow-lg rounded-xl border-0 mb-6"
                            >
                                {profile.defaultCvUrl ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <FileTextOutlined className="text-2xl text-[#00B14F]" />
                                            <div>
                                                <Text strong>CV mặc định</Text>
                                                <Text
                                                    type="secondary"
                                                    className="text-sm block truncate max-w-[200px]"
                                                    title={profile.defaultCvUrl}
                                                >
                                                    {profile.defaultCvUrl.split('/').pop() || 'Đã tải lên'}
                                                </Text>
                                            </div>
                                        </div>
                                        <Space>
                                            <a
                                                href={profile.defaultCvUrl.startsWith('http') ? profile.defaultCvUrl : `https://localhost:7016${profile.defaultCvUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button type="primary" className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0">
                                                    Xem CV
                                                </Button>
                                            </a>
                                        </Space>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <FileTextOutlined className="text-4xl text-gray-300 mb-2" />
                                        <Text type="secondary" className="block">
                                            Chưa có CV. Nhấn "Chỉnh sửa hồ sơ" để tải lên.
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        )}
                        {/* Company Info - Only for HR */}
                        {profile.company && (
                            <Card
                                title={
                                    <span className="text-lg font-semibold">🏢 Công ty</span>
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
                    {/* Right Column - Education & Experience (Candidate) or Posted Jobs (HR) */}
                    <Col xs={24} lg={16}>
                        {/* Education - Only for Candidate */}
                        {isCandidate && profile.educations && profile.educations.length > 0 && (
                            <Card
                                title={
                                    <span className="text-lg font-semibold">
                                        🎓 Học vấn
                                    </span>
                                }
                                className="shadow-lg rounded-xl border-0 mb-6"
                            >
                                <Space direction="vertical" size={16} className="w-full">
                                    {profile.educations.map((edu) => (
                                        <div
                                            key={edu.id}
                                            className="border-l-4 border-[#00B14F] pl-4"
                                        >
                                            <Title level={5} className="!m-0 !mb-1">
                                                {edu.schoolName}
                                            </Title>
                                            <Text className="text-gray-600 block">
                                                {edu.major}
                                            </Text>
                                            <Text type="secondary" className="text-sm">
                                                {edu.startDate} - {edu.endDate || "Hiện tại"}
                                            </Text>
                                        </div>
                                    ))}
                                </Space>
                            </Card>
                        )}
                        {/* Experience - Only for Candidate */}
                        {isCandidate &&
                            profile.experiences &&
                            profile.experiences.length > 0 && (
                                <Card
                                    title={
                                        <span className="text-lg font-semibold">
                                            💼 Kinh nghiệm làm việc
                                        </span>
                                    }
                                    className="shadow-lg rounded-xl border-0 mb-6"
                                >
                                    <Space direction="vertical" size={16} className="w-full">
                                        {profile.experiences.map((exp) => (
                                            <div
                                                key={exp.id}
                                                className="border-l-4 border-blue-500 pl-4"
                                            >
                                                <Title level={5} className="!m-0 !mb-1">
                                                    {exp.position}
                                                </Title>
                                                <Text className="text-gray-600 block">
                                                    {exp.company}
                                                </Text>
                                                <Text type="secondary" className="text-sm block">
                                                    {exp.startDate} - {exp.endDate || "Hiện tại"}
                                                </Text>
                                                {exp.description && (
                                                    <Paragraph className="!mt-2 !mb-0 text-gray-500">
                                                        {exp.description}
                                                    </Paragraph>
                                                )}
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            )}
                        {/* Posted Jobs - Only for HR */}
                        {!isCandidate &&
                            profile.postedJobs &&
                            profile.postedJobs.length > 0 && (
                                <Card
                                    title={
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-semibold">
                                                💼 Việc làm đã đăng
                                            </span>
                                            <Tag color={PRIMARY_COLOR} className="!m-0">
                                                {profile.postedJobs.length} tin
                                            </Tag>
                                        </div>
                                    }
                                    className="shadow-lg rounded-xl border-0"
                                >
                                    <Space direction="vertical" size={12} className="w-full">
                                        {profile.postedJobs.map((job) => (
                                            <Card
                                                key={job.id}
                                                size="small"
                                                className="hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <Text strong>{job.title}</Text>
                                                        <Text
                                                            type="secondary"
                                                            className="text-sm block"
                                                        >
                                                            {job.locationName}
                                                        </Text>
                                                    </div>
                                                    <Tag color={PRIMARY_COLOR}>
                                                        {job.salaryMin && job.salaryMax
                                                            ? `${(job.salaryMin / 1000000).toFixed(0)} - ${(job.salaryMax / 1000000).toFixed(0)} triệu`
                                                            : "Thương lượng"}
                                                    </Tag>
                                                </div>
                                            </Card>
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
                    <span className="text-xl font-semibold">
                        ✏️ Chỉnh sửa hồ sơ
                    </span>
                }
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
                width={700}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="mt-4"
                >
                    {/* Avatar & Cover Upload */}
                    <div className="flex gap-6 mb-6">
                        {/* Avatar Upload */}
                        <div className="text-center">
                            <Text type="secondary" className="block mb-2">
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
                            <label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="relative group">
                                    <Avatar
                                        size={100}
                                        src={avatarPreview || buildImageUrl(profile?.avatarUrl)}
                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                    >
                                        {profile?.fullName?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <CameraOutlined className="text-white text-xl" />
                                    </div>
                                </div>
                            </label>
                            {avatarFile && (
                                <Text type="success" className="mt-2 block text-xs">
                                    ✓ {avatarFile.name}
                                </Text>
                            )}
                        </div>

                        {/* Cover Upload */}
                        <div className="flex-1">
                            <Text type="secondary" className="block mb-2">
                                Ảnh bìa (1200x300 px)
                            </Text>
                            <input
                                type="file"
                                id="cover-upload"
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
                            <label htmlFor="cover-upload" className="cursor-pointer block">
                                <div
                                    className="h-32 rounded-lg bg-cover bg-center relative group overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#00B14F]"
                                    style={{
                                        backgroundImage: `url(${coverPreview || buildImageUrl(profile?.coverImageUrl) || 'https://via.placeholder.com/1200x300?text=Cover+Image'})`,
                                        backgroundColor: "#f5f5f5",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                        <CameraOutlined className="text-white text-2xl mb-1" />
                                        <Text className="text-white text-sm">Nhấp để thay đổi</Text>
                                    </div>
                                </div>
                            </label>
                            {coverFile && (
                                <Text type="success" className="mt-2 block text-sm">
                                    ✓ Đã chọn: {coverFile.name}
                                </Text>
                            )}
                        </div>
                    </div>

                    {/* Thông tin cơ bản */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input placeholder="Nhập họ và tên" size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số điện thoại" name="phoneNumber">
                                <Input placeholder="VD: 0912345678" size="large" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Chức danh / Nghề nghiệp" name="professionalTitle">
                        <Input placeholder="VD: Senior Software Engineer" size="large" />
                    </Form.Item>
                    <Form.Item label="Giới thiệu bản thân" name="bio">
                        <TextArea
                            rows={4}
                            placeholder="Viết một vài dòng giới thiệu về bản thân..."
                        />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                        <Input placeholder="VD: Hà Nội, Việt Nam" size="large" />
                    </Form.Item>
                    <Divider />
                    <Title level={5}>🔗 Liên kết xã hội</Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Website" name="websiteUrl">
                                <Input
                                    prefix={<GlobalOutlined className="text-gray-400" />}
                                    placeholder="https://..."
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="LinkedIn" name="linkedInUrl">
                                <Input
                                    prefix={<LinkedinOutlined className="text-gray-400" />}
                                    placeholder="https://linkedin.com/..."
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="GitHub" name="gitHubUrl">
                                <Input
                                    prefix={<GithubOutlined className="text-gray-400" />}
                                    placeholder="https://github.com/..."
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* CV Upload - Only for Candidate */}
                    {isCandidate && (
                        <>
                            <Divider />
                            <Title level={5}>📄 CV</Title>
                            <Form.Item label="Tải lên CV mới">
                                <Upload
                                    beforeUpload={() => false}
                                    onChange={handleCvChange}
                                    maxCount={1}
                                    accept=".pdf,.doc,.docx"
                                >
                                    <Button icon={<UploadOutlined />}>
                                        Chọn file CV (PDF, DOC)
                                    </Button>
                                </Upload>
                                {cvFile && (
                                    <Text type="success" className="mt-2 block">
                                        Đã chọn: {cvFile.name}
                                    </Text>
                                )}
                            </Form.Item>
                        </>
                    )}
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button size="large" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={updating}
                            icon={<SaveOutlined />}
                            className="!bg-[#00B14F] hover:!bg-[#00a347] !border-0"
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};
export default MyProfilePage;