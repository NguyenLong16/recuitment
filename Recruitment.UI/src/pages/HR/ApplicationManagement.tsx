import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Select, Space, Table, Tag, Tooltip, Card, Empty } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ApplicationService from "../../services/applicationService";
import { ApplicationStatus } from "../../types/application";

// Interface cho dữ liệu ứng viên từ API (khớp với API response)
interface ApplicationForHRLocal {
    id: number;
    jobId: number;
    jobTitle: string;
    candidateName: string;
    candidateEmail?: string;
    appliedDate: string;
    status: string;  // API trả về string
    cvUrl: string;   // API trả về cvUrl
    coverLetter?: string;
}

// Map status string to Vietnamese labels
const statusLabels: Record<string, string> = {
    Submitted: "Đã nộp",
    Viewed: "Đã xem",
    Interview: "Phỏng vấn",
    Rejected: "Từ chối",
    Accepted: "Trúng tuyển",
};

// Map status to Tag colors
const statusColors: Record<string, string> = {
    Submitted: "blue",
    Viewed: "cyan",
    Interview: "orange",
    Rejected: "red",
    Accepted: "green",
};

// Status options for Select dropdown
const statusOptions = [
    { value: "Submitted", label: "Đã nộp" },
    { value: "Viewed", label: "Đã xem" },
    { value: "Interview", label: "Phỏng vấn" },
    { value: "Rejected", label: "Từ chối" },
    { value: "Accepted", label: "Trúng tuyển" },
];

const ApplicationManagement = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();

    const [applications, setApplications] = useState<ApplicationForHRLocal[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [jobTitle, setJobTitle] = useState<string>("");

    // Fetch applications when component mounts
    useEffect(() => {
        if (jobId) {
            fetchApplications(Number(jobId));
        }
    }, [jobId]);

    const fetchApplications = async (jobId: number) => {
        setLoading(true);
        try {
            const data = await ApplicationService.getApplicationsByJob(jobId);
            console.log('=== Applications data ===', data);
            setApplications(data.applications || data || []);
            setJobTitle(data.jobTitle || `Job #${jobId}`);
        } catch (error: any) {
            message.error(error.response?.data?.message || "Không thể tải danh sách ứng viên");
        } finally {
            setLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (applicationId: number, newStatus: string) => {
        setUpdatingId(applicationId);
        try {
            // Convert string to enum for API call
            const statusEnum = ApplicationStatus[newStatus as keyof typeof ApplicationStatus];
            await ApplicationService.updateApplicationStatus(applicationId, statusEnum);
            message.success("Cập nhật trạng thái thành công");
            // Update local state with string
            setApplications(prev =>
                prev.map(app =>
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (error: any) {
            message.error(error.response?.data?.message || "Cập nhật trạng thái thất bại");
        } finally {
            setUpdatingId(null);
        }
    };

    // Table columns
    const columns = [
        {
            title: "STT",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: any, __: ApplicationForHRLocal, index: number) => (
                <span className="font-medium">{index + 1}</span>
            ),
        },
        {
            title: "Ứng viên",
            key: "candidate",
            width: 200,
            render: (_: any, record: ApplicationForHRLocal) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <UserOutlined className="text-white text-sm" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{record.candidateName}</div>
                        <div className="text-xs text-gray-500">{record.candidateEmail || ''}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Ngày nộp",
            dataIndex: "appliedDate",
            key: "appliedDate",
            width: 120,
            render: (date: string) => (
                <span className="text-gray-600">
                    {dayjs(date).format("DD/MM/YYYY")}
                </span>
            ),
        },
        {
            title: "Đổi trạng thái",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (status: string, record: ApplicationForHRLocal) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    loading={updatingId === record.id}
                    disabled={updatingId === record.id}
                    style={{ width: 140 }}
                    options={statusOptions}
                    optionRender={(option) => (
                        <Tag color={statusColors[option.value as string]}>
                            {option.label}
                        </Tag>
                    )}
                />
            ),
        },
        {
            title: "Trạng thái hiện tại",
            dataIndex: "status",
            key: "currentStatus",
            width: 140,
            render: (status: string) => (
                <Tag color={statusColors[status] || 'default'} className="font-medium">
                    {statusLabels[status] || status}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 150,
            fixed: "right" as const,
            render: (_: any, record: ApplicationForHRLocal) => (
                <Space size="small">
                    {record.cvUrl && (
                        <>
                            <Tooltip title="Xem CV">
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => window.open(record.cvUrl, "_blank")}
                                />
                            </Tooltip>
                            <Tooltip title="Tải CV">
                                <Button
                                    type="default"
                                    icon={<DownloadOutlined />}
                                    size="small"
                                    onClick={() => {
                                        const link = document.createElement("a");
                                        link.href = record.cvUrl;
                                        link.download = `CV_${record.candidateName}.pdf`;
                                        link.click();
                                    }}
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <Card className="mb-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/hr/jobs-management")}
                            className="hover:bg-gray-100"
                        >
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 m-0">
                                Quản lý ứng viên
                            </h1>
                            <p className="text-gray-500 m-0 mt-1">
                                {jobTitle}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                            {applications.length}
                        </div>
                        <div className="text-sm text-gray-500">Ứng viên</div>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={applications}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} ứng viên`,
                    }}
                    scroll={{ x: 900 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Chưa có ứng viên nào ứng tuyển"
                            />
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default ApplicationManagement;
