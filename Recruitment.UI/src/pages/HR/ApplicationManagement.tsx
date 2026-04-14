import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, message, Select, Space, Table, Tag, Tooltip, Card, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
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
    const columns: ColumnsType<ApplicationForHRLocal> = [
        {
            title: "STT",
            key: "stt",
            width: 60,
            align: "center",
            responsive: ["md"],
            render: (_, __, index) => (
                <span className="font-medium text-gray-500">{index + 1}</span>
            ),
        },
        {
            title: "Ứng viên",
            key: "candidate",
            width: 250,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                        <UserOutlined className="text-white text-lg" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm truncate">{record.candidateName}</div>
                        <div className="text-xs text-gray-500 truncate">{record.candidateEmail || 'Chưa cung cấp email'}</div>
                        {/* Mobile: Date added here instead of a separate column */}
                        <div className="md:hidden mt-0.5 text-[11px] text-gray-400">
                            Ngày nộp: {dayjs(record.appliedDate).format("DD/MM/YYYY")}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Ngày nộp",
            dataIndex: "appliedDate",
            key: "appliedDate",
            width: 120,
            responsive: ["md"],
            render: (date: string) => (
                <span className="text-gray-600 font-medium">
                    {dayjs(date).format("DD/MM/YYYY")}
                </span>
            ),
        },
        {
            title: "Đổi trạng thái",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (status: string, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    loading={updatingId === record.id}
                    disabled={updatingId === record.id}
                    className="w-full min-w-[140px]"
                    options={statusOptions}
                    optionRender={(option) => (
                        <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full bg-${statusColors[option.value as string]}-500`}></div>
                             <span className="font-medium">{option.label}</span>
                        </div>
                    )}
                />
            ),
        },
        {
            title: "Trạng thái hiện tại",
            dataIndex: "status",
            key: "currentStatus",
            width: 150,
            responsive: ["lg"],
            render: (status: string) => (
                <Tag color={statusColors[status] || 'default'} className="font-medium !m-0 !px-2.5 !py-1 rounded-md">
                    {statusLabels[status] || status}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 110,
            fixed: "right",
            align: "center",
            render: (_, record) => (
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
                                    className="!border-blue-200 hover:!bg-blue-50"
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
                                    className="hover:!text-green-600 hover:!border-green-300"
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <Card className="mb-4 sm:mb-6 shadow-sm border-0 rounded-2xl" bodyStyle={{ padding: '16px sm:24px' }}>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <Button
                            type="default"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/hr/jobs-management")}
                            className="flex-shrink-0 mt-1 sm:mt-0 !rounded-lg hover:!text-[#00B14F] hover:!border-[#00B14F]"
                        >
                            <span className="hidden sm:inline">Quay lại</span>
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 m-0 tracking-tight leading-tight">
                                Quản lý ứng viên
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 m-0 mt-1 truncate">
                                {jobTitle}
                            </p>
                        </div>
                    </div>
                    
                    {/* Badge total applications */}
                    <div className="flex items-center gap-3 bg-blue-50 px-4 py-2.5 rounded-xl border border-blue-100 self-start sm:self-auto flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <UserOutlined className="text-xl text-blue-500" />
                        </div>
                        <div>
                            <div className="text-xl sm:text-2xl font-bold text-blue-600 leading-none">
                                {applications.length}
                            </div>
                            <div className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">
                                Ứng viên
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ── TABLE ───────────────────────────────────────────────────────── */}
            <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={applications}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => <span className="font-medium text-gray-600">Tổng {total} ứng viên</span>,
                        className: "px-4 sm:px-6 my-4"
                    }}
                    scroll={{ x: 'max-content' }}
                    className="custom-responsive-table"
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={<span className="text-gray-500 font-medium">Chưa có ứng viên nào ứng tuyển</span>}
                                className="py-12"
                            />
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default ApplicationManagement;
