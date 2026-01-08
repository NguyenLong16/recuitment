import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Empty, message, Select, Space, Table, Tag, Tooltip, Input } from "antd";
import { DownloadOutlined, EyeOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ApplicationService from "../../services/applicationService";
import { ApplicationStatus } from "../../types/application";

// Interface cho dữ liệu ứng viên từ API
interface ApplicationWithJob {
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

const AllApplicationsManagement = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<ApplicationWithJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Fetch all applications when component mounts
    useEffect(() => {
        fetchApplications();
    }, []);

    // Filter applications when search or status filter changes
    useEffect(() => {
        let filtered = [...applications];

        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            filtered = filtered.filter(app =>
                app.candidateName.toLowerCase().includes(lowerSearch) ||
                (app.candidateEmail || "").toLowerCase().includes(lowerSearch) ||
                app.jobTitle.toLowerCase().includes(lowerSearch)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        setFilteredApplications(filtered);
    }, [applications, searchText, statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await ApplicationService.getAllApplicationsForHR();
            setApplications(data || []);
            setFilteredApplications(data || []);
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
            render: (_: any, __: ApplicationWithJob, index: number) => (
                <span className="font-medium">{index + 1}</span>
            ),
        },
        {
            title: "Ứng viên",
            key: "candidate",
            width: 220,
            render: (_: any, record: ApplicationWithJob) => (
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <UserOutlined className="text-white text-sm" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-800">{record.candidateName}</div>
                        <div className="text-xs text-gray-500">{record.candidateEmail}</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Vị trí ứng tuyển",
            dataIndex: "jobTitle",
            key: "jobTitle",
            width: 200,
            render: (text: string, record: ApplicationWithJob) => (
                <a
                    onClick={() => navigate(`/hr/applications/${record.jobId}`)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
                >
                    {text}
                </a>
            ),
        },
        {
            title: "Ngày nộp",
            dataIndex: "appliedDate",
            key: "appliedDate",
            width: 120,
            sorter: (a: ApplicationWithJob, b: ApplicationWithJob) =>
                dayjs(a.appliedDate).unix() - dayjs(b.appliedDate).unix(),
            render: (date: string) => (
                <span className="text-gray-600">
                    {dayjs(date).format("DD/MM/YYYY")}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (status: string, record: ApplicationWithJob) => (
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
            title: "Hiện tại",
            dataIndex: "status",
            key: "currentStatus",
            width: 120,
            render: (status: string) => (
                <Tag color={statusColors[status]} className="font-medium">
                    {statusLabels[status]}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 120,
            fixed: "right" as const,
            render: (_: any, record: ApplicationWithJob) => (
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

    // Get statistics
    const stats = {
        total: applications.length,
        submitted: applications.filter(a => a.status === "Submitted").length,
        interview: applications.filter(a => a.status === "Interview").length,
        accepted: applications.filter(a => a.status === "Accepted").length,
    };

    return (
        <div className="p-6">
            {/* Header */}
            <Card className="mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 m-0">
                            Quản lý tất cả ứng viên
                        </h1>
                        <p className="text-gray-500 m-0 mt-1">
                            Danh sách ứng viên đã ứng tuyển các vị trí của bạn
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <div className="text-xs text-gray-500">Tổng</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-cyan-50 rounded-lg">
                            <div className="text-2xl font-bold text-cyan-600">{stats.submitted}</div>
                            <div className="text-xs text-gray-500">Chờ xem</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{stats.interview}</div>
                            <div className="text-xs text-gray-500">Phỏng vấn</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                            <div className="text-xs text-gray-500">Trúng tuyển</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <Card className="mb-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Tìm kiếm theo tên, email, vị trí..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="md:w-80"
                        allowClear
                    />
                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: 180 }}
                        allowClear
                        options={[
                            { value: null, label: "Tất cả trạng thái" },
                            ...statusOptions
                        ]}
                    />
                </div>
            </Card>

            {/* Table */}
            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={filteredApplications}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} ứng viên`,
                    }}
                    scroll={{ x: 1100 }}
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

export default AllApplicationsManagement;
