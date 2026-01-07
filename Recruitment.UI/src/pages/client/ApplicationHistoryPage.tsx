import { Button, Card, Empty, Spin, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationResponseHistory } from "../../types/application";
import ApplicationService from "../../services/applicationService";
import { EyeOutlined, FileTextOutlined } from "@ant-design/icons"
import dayjs from "dayjs";

const { Title } = Typography;
const ApplicationHistoryPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<ApplicationResponseHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await ApplicationService.getMyApplicationHistory();
                // API might return data directly or nested in .data
                const data = response.data || response || [];
                setApplications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching application history:', error);
                setApplications([]);  // Set empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Status color mapping
    const getStatusTag = (status: string) => {
        const map: Record<string, { color: string; text: string }> = {
            Pending: { color: 'processing', text: 'Đang chờ' },
            Reviewed: { color: 'warning', text: 'Đã xem' },
            Accepted: { color: 'success', text: 'Được nhận' },
            Rejected: { color: 'error', text: 'Từ chối' },
        };
        return map[status] || { color: 'default', text: status };
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            render: (_: any, __: ApplicationResponseHistory, index: number) => index + 1,
        },
        {
            title: 'Vị trí ứng tuyển',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text: string, record: ApplicationResponseHistory) => (
                <a onClick={() => navigate(`/job/${record.jobId}`)}>{text}</a>
            ),
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const { color, text } = getStatusTag(status);
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_: any, record: ApplicationResponseHistory) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/job/${record.jobId}`)}
                >
                    Xem job
                </Button>
            ),
        },
    ];
    return (
        <>
            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
                <Title level={2} style={{ marginBottom: 24 }}>
                    <FileTextOutlined style={{ marginRight: 12 }} />
                    Lịch sử ứng tuyển
                </Title>
                <Card style={{ borderRadius: 12 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 48 }}>
                            <Spin size="large" />
                        </div>
                    ) : applications.length === 0 ? (
                        <Empty
                            description="Bạn chưa ứng tuyển vị trí nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            <Button type="primary" onClick={() => navigate('/jobs')}>
                                Tìm việc ngay
                            </Button>
                        </Empty>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={applications}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    )}
                </Card>
            </div>
        </>
    )
}

export default ApplicationHistoryPage