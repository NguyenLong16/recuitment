import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Space, Spin, Tag, Typography, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { JobResponse } from "../../types/job";
import { useEffect, useState } from "react";
import JobService from "../../services/jobService";
import ApplicationService from "../../services/applicationService";
import dayjs from "dayjs";
import { ArrowLeftOutlined, ClockCircleOutlined, DollarOutlined, EnvironmentOutlined, UploadOutlined } from "@ant-design/icons"

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
            console.log('Token:', localStorage.getItem('token'));

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
                            <Title level={3} style={{ margin: 0 }}>{job.title}</Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>
                                {job.companyName || 'Công ty chưa cập nhật'}
                            </Text>
                            <Space size={16} style={{ marginTop: 16 }} wrap>
                                <Tag icon={<DollarOutlined />} color="green" style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                </Tag>
                                <Tag icon={<EnvironmentOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                                    {job.locationName}
                                </Tag>
                                <Tag icon={<ClockCircleOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                                    Hạn: {dayjs(job.deadline).format('DD/MM/YYYY')}
                                </Tag>
                            </Space>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                style={{ height: 48, paddingInline: 32, borderRadius: 8 }}
                                onClick={() => setApplyModalVisible(true)}
                            >
                                Ứng tuyển ngay
                            </Button>
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
                    </Col>
                    <Col xs={24} md={8}>
                        <Card title="Thông tin chung" style={{ borderRadius: 12 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={12}>
                                <div>
                                    <Text type="secondary">Ngành nghề:</Text>
                                    <br />
                                    <Text strong>{job.categoryName}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary">Hình thức:</Text>
                                    <br />
                                    <Text strong>{job.jobType}</Text>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary">Kỹ năng yêu cầu:</Text>
                                    <br />
                                    <Space wrap style={{ marginTop: 4 }}>
                                        {job.skillNames?.map((skill, idx) => (
                                            <Tag key={idx} color="blue">{skill}</Tag>
                                        ))}
                                    </Space>
                                </div>
                                <Divider style={{ margin: '8px 0' }} />
                                <div>
                                    <Text type="secondary">Ngày đăng:</Text>
                                    <br />
                                    <Text strong>{dayjs(job.createdDate).format('DD/MM/YYYY')}</Text>
                                </div>
                            </Space>
                        </Card>
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