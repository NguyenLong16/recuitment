import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Space, Spin, Tag, Typography, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { JobResponse } from "../../types/job";
import { useEffect, useState } from "react";
import JobService from "../../services/jobService";
import ApplicationService from "../../services/applicationService";
import savedJobService from "../../services/savedJobService";
import dayjs from "dayjs";
import { ArrowLeftOutlined, BookFilled, BookOutlined, CalendarOutlined, ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, LaptopOutlined, StarFilled, TagsOutlined, TeamOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons"
import CommentSection from "../../components/common/Clients/CommentSection";
import RatingSection from "../../components/common/Clients/RatingSection";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addSavedId, removeSavedId } from "../../redux/slices/savedJobSlice";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const JobDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobResponse | null>(null)
    const [loading, setLoading] = useState(true);
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [applying, setApplying] = useState(false);
    const [form] = Form.useForm();
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const savedIds = useSelector((state: RootState) => state.savedJobs.ids);
    const isSaved = job ? savedIds.includes(job.id) : false;

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await JobService.getPublicJobDetail(Number(id));
                setJob(response.data);
            } catch (error) {
                message.error('Không thể tải thông tin việc làm');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleToggleSave = async () => {
        if (!user) { message.warning('Vui lòng đăng nhập để lưu công việc'); return; }
        setSaving(true);
        try {
            const response = await savedJobService.toggleSavedJob(job!.id);
            if (isSaved) {
                dispatch(removeSavedId(job!.id));
            } else {
                dispatch(addSavedId(job!.id));
            }
            message.success(response.data.message);
        } catch {
            message.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const jobTypeLabel = (type: string) => {
        const map: Record<string, string> = {
            FullTime: 'Toàn thời gian',
            PartTime: 'Bán thời gian',
            Remote: 'Làm từ xa',
            Internship: 'Thực tập',
            Contract: 'Hợp đồng',
        };
        return map[type] ?? type;
    };

    const statusLabel = (status: string) => {
        const map: Record<string, { label: string; color: string }> = {
            Active: { label: 'Đang tuyển', color: 'success' },
            Closed: { label: 'Đã đóng', color: 'error' },
            Expired: { label: 'Hết hạn', color: 'default' },
            Draft: { label: 'Bản nháp', color: 'warning' },
        };
        return map[status] ?? { label: status, color: 'default' };
    };

    // Format lương
    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return 'Thương lượng';
        const fmt = (val: number) => val.toLocaleString('vi-VN') + ' VND';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`
        return `Tới ${fmt(max!)}`;
    }

    // Handle apply
    const handleApply = async () => {
        if (!cvFile) {
            message.warning('Vui lòng tải lên CV của bạn');
            return;
        }
        setApplying(true);
        try {
            const values = await form.validateFields();

            // Debug log
            console.log('=== Apply Job Debug ===');
            console.log('jobId:', id, 'type:', typeof id);
            console.log('cvFile:', cvFile);
            console.log('coverLetter:', values.coverLetter);
            console.log('Token:', localStorage.getItem('accessToken'));

            await ApplicationService.applyJob({
                jobId: id!,
                resumeFile: cvFile,
                coverLetter: values.coverLetter
            });
            message.success('Nộp đơn thành công!');
            setApplyModalVisible(false);
            form.resetFields();
            setCvFile(null);
        } catch (error: any) {
            console.error('Apply Error:', error?.response);
            message.error(error?.response?.data?.message || 'Nộp đơn thất bại');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!job) return null;
    const PLACEHOLDER = 'https://via.placeholder.com/120x120?text=Logo';
    const imgSrc = job.imageUrl
        ? (job.imageUrl.startsWith('http') ? job.imageUrl : `https://localhost:7016${job.imageUrl}`)
        : PLACEHOLDER;

    return (
        <>
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
                {/* Back button */}
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    style={{ marginBottom: 16 }}
                >
                    Quay lại danh sách
                </Button>
                {/* Job Header */}
                <Card style={{ marginBottom: 24, borderRadius: 12 }}>
                    <Row gutter={24} align="middle">
                        <Col flex="none">
                            <img
                                src={imgSrc}
                                alt={job.companyName}
                                style={{
                                    width: 120,
                                    height: 120,
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                    backgroundColor: '#f5f5f5',
                                    padding: 8
                                }}
                            />
                        </Col>
                        <Col flex="auto">
                            <Space align="center" style={{ marginBottom: 4 }}>
                                <Title level={3} style={{ margin: 0 }}>{job.title}</Title>
                                <Tag color={statusLabel(job.status).color} style={{ fontSize: 12, margin: 0 }}>
                                    {statusLabel(job.status).label}
                                </Tag>
                            </Space>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                {job.companyName || 'Công ty chưa cập nhật'}
                            </Text>
                            <Space size={8} style={{ marginTop: 12 }} wrap>
                                <Tag icon={<DollarOutlined />} color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                </Tag>
                                <Tag icon={<EnvironmentOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {job.locationName}
                                </Tag>
                                <Tag icon={<LaptopOutlined />} color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {jobTypeLabel(job.jobType)}
                                </Tag>
                                <Tag icon={<TagsOutlined />} color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {job.categoryName}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} color={dayjs(job.deadline).diff(dayjs(), 'day') <= 3 ? 'red' : 'default'} style={{ fontSize: 14, padding: '4px 12px' }}>
                                    Hạn: {dayjs(job.deadline).format('DD/MM/YYYY')}
                                </Tag>
                                <Tag icon={<CalendarOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                                    Đăng: {dayjs(job.createdDate).format('DD/MM/YYYY')}
                                </Tag>
                            </Space>
                            {job.skillNames && job.skillNames.length > 0 && (
                                <Space wrap style={{ marginTop: 8 }}>
                                    <Text type="secondary" style={{ fontSize: 13 }}>Kỹ năng:</Text>
                                    {job.skillNames.map((skill, idx) => (
                                        <Tag key={idx} color="cyan" style={{ fontSize: 13 }}>{skill}</Tag>
                                    ))}
                                </Space>
                            )}
                            {job.averageRating > 0 && (
                                <Space style={{ marginTop: 8 }}>
                                    <StarFilled style={{ color: '#faad14' }} />
                                    <Text strong>{job.averageRating.toFixed(1)}</Text>
                                    <Text type="secondary">({job.totalReviews} đánh giá)</Text>
                                    <Text type="secondary">·</Text>
                                    <Text type="secondary">{job.totalComments} bình luận</Text>
                                </Space>
                            )}
                        </Col>
                        <Col>
                            <Space direction="vertical" size={8}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ height: 48, paddingInline: 32, borderRadius: 8 }}
                                    onClick={() => setApplyModalVisible(true)}
                                >
                                    Ứng tuyển ngay
                                </Button>
                                <Button
                                    size="large"
                                    icon={isSaved ? <BookFilled style={{ color: '#00B14F' }} /> : <BookOutlined />}
                                    loading={saving}
                                    onClick={handleToggleSave}
                                    style={{ height: 48, borderRadius: 8, width: '100%' }}
                                >
                                    {isSaved ? 'Đã lưu' : 'Lưu tin'}
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>
                {/* Job Details */}
                <Row gutter={24}>
                    <Col xs={24} md={16}>
                        <Card title="Mô tả công việc" style={{ marginBottom: 16, borderRadius: 12 }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                {job.description}
                            </Paragraph>
                        </Card>
                        <Card title="Yêu cầu" style={{ marginBottom: 16, borderRadius: 12 }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                {job.requirement}
                            </Paragraph>
                        </Card>
                        <Card title="Quyền lợi" style={{ marginBottom: 16, borderRadius: 12 }}>
                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                {job.benefit}
                            </Paragraph>
                        </Card>
                        <CommentSection
                            jobId={Number(id)}
                            totalComments={job.totalComments || 0}
                        />
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Thông tin chung" style={{ borderRadius: 12 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                <div>
                                    <Text type="secondary"><TagsOutlined /> Ngành nghề:</Text>
                                    <br />
                                    <Text strong>{job.categoryName}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><LaptopOutlined /> Hình thức làm việc:</Text>
                                    <br />
                                    <Tag color="blue">{jobTypeLabel(job.jobType)}</Tag>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><EnvironmentOutlined /> Địa điểm:</Text>
                                    <br />
                                    <Text strong>{job.locationName}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><DollarOutlined /> Mức lương:</Text>
                                    <br />
                                    <Text strong style={{ color: '#00B14F' }}>{formatSalary(job.salaryMin, job.salaryMax)}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary">Kỹ năng yêu cầu:</Text>
                                    <br />
                                    <Space wrap style={{ marginTop: 4 }}>
                                        {job.skillNames?.length
                                            ? job.skillNames.map((skill, idx) => <Tag key={idx} color="cyan">{skill}</Tag>)
                                            : <Text type="secondary" style={{ fontSize: 12 }}>Không yêu cầu kỹ năng cụ thể</Text>
                                        }
                                    </Space>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><ClockCircleOutlined /> Hạn nộp hồ sơ:</Text>
                                    <br />
                                    <Text strong style={{ color: dayjs(job.deadline).diff(dayjs(), 'day') <= 3 ? '#ff4d4f' : undefined }}>
                                        {dayjs(job.deadline).format('DD/MM/YYYY')}
                                    </Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><CalendarOutlined /> Ngày đăng:</Text>
                                    <br />
                                    <Text strong>{dayjs(job.createdDate).format('DD/MM/YYYY')}</Text>
                                </div>
                                {job.employerName && (
                                    <>
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div>
                                            <Text type="secondary"><UserOutlined /> Người đăng:</Text>
                                            <br />
                                            <Text strong>{job.employerName}</Text>
                                        </div>
                                    </>
                                )}
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary"><TeamOutlined /> Đánh giá & Bình luận:</Text>
                                    <br />
                                    <Space>
                                        <StarFilled style={{ color: '#faad14' }} />
                                        <Text>{job.averageRating > 0 ? job.averageRating.toFixed(1) : 'Chưa có'}</Text>
                                        <Text type="secondary">({job.totalReviews} đánh giá · {job.totalComments} bình luận)</Text>
                                    </Space>
                                </div>
                            </Space>
                        </Card>
                        {/* Rating Section */}
                        <RatingSection
                            jobId={Number(id)}
                            averageRating={job.averageRating || 0}
                            totalReviews={job.totalReviews || 0}
                            onRatingSubmitted={() => {
                                // Reload job data to get updated rating
                                const fetchJob = async () => {
                                    const response = await JobService.getPublicJobDetail(Number(id));
                                    setJob(response.data);
                                };
                                fetchJob();
                            }}
                        />
                    </Col>
                </Row>
                {/* Apply Modal */}
                <Modal
                    title="Ứng tuyển vị trí này"
                    open={applyModalVisible}
                    onCancel={() => setApplyModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setApplyModalVisible(false)}>
                            Hủy
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={applying}
                            onClick={handleApply}
                        >
                            Nộp đơn
                        </Button>
                    ]}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Tải lên CV"
                            required
                            help="Định dạng: PDF, DOC, DOCX (Tối đa 5MB)"
                        >
                            <Upload
                                accept=".pdf,.doc,.docx"
                                maxCount={1}
                                beforeUpload={(file) => {
                                    if (file.size > 5 * 1024 * 1024) {
                                        message.error('File quá lớn! Tối đa 5MB');
                                        return Upload.LIST_IGNORE;
                                    }
                                    setCvFile(file);
                                    return false; // Prevent auto upload
                                }}
                                onRemove={() => setCvFile(null)}
                            >
                                <Button icon={<UploadOutlined />}>Chọn file CV</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="coverLetter"
                            label="Thư giới thiệu (không bắt buộc)"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Viết vài dòng giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default JobDetailPage