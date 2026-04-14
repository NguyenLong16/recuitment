import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Empty, Input, message, Row, Select, Space, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DownloadOutlined, EyeOutlined, SearchOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
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

const StatCard = ({ title, value, color, icon, bgColor }: any) => (
    <Card className="hover:shadow-md transition-shadow h-full bg-white border border-gray-100" bodyStyle={{ padding: "16px" }}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 text-xl text-${color}-600`}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-2xl font-bold text-gray-800 leading-tight">{value}</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium truncate">{title}</div>
            </div>
        </div>
    </Card>
);

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
    const columns: ColumnsType<ApplicationWithJob> = [
        {
            title: "STT",
            key: "stt",
            width: 60,
            align: "center",
            responsive: ["md"],
            render: (_, __, index) => <span className="font-medium text-gray-500">{index + 1}</span>,
        },
        {
            title: "Ứng viên",
            key: "candidate",
            width: 250,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <UserOutlined className="text-white text-lg" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-gray-800 text-sm truncate">{record.candidateName}</div>
                        <div className="text-xs text-gray-500 truncate">{record.candidateEmail}</div>
                        {/* Mobile: Job Title, Date (hidden on large screens to save space) */}
                        <div className="md:hidden mt-1">
                            {record.jobTitle && (
                                <div className="text-xs text-blue-600 font-medium truncate mb-0.5">{record.jobTitle}</div>
                            )}
                            <div className="text-[11px] text-gray-400">{dayjs(record.appliedDate).format("DD/MM/YYYY")}</div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Vị trí ứng tuyển",
            dataIndex: "jobTitle",
            key: "jobTitle",
            width: 220,
            responsive: ["md"],
            render: (text: string, record) => (
                <a
                    onClick={() => navigate(`/hr/applications/${record.jobId}`)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium hover:underline line-clamp-2"
                    title={text}
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
            responsive: ["lg"],
            sorter: (a, b) => dayjs(a.appliedDate).unix() - dayjs(b.appliedDate).unix(),
            render: (date: string) => (
                <span className="text-gray-600 font-medium whitespace-nowrap">
                    {dayjs(date).format("DD/MM/YYYY")}
                </span>
            ),
        },
        {
            title: "Cập nhật TT",
            dataIndex: "status",
            key: "updateStatus",
            width: 150,
            render: (status: string, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    loading={updatingId === record.id}
                    disabled={updatingId === record.id}
                    className="w-full min-w-[130px]"
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
            title: "Hiện tại",
            dataIndex: "status",
            key: "currentStatus",
            width: 130,
            responsive: ["lg"],
            render: (status: string) => (
                <Tag color={statusColors[status]} className="font-medium !m-0 !px-2.5 !py-1 rounded-md">
                    {statusLabels[status]}
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

    // Get statistics
    const stats = {
        total: applications.length,
        submitted: applications.filter(a => a.status === "Submitted").length,
        interview: applications.filter(a => a.status === "Interview").length,
        accepted: applications.filter(a => a.status === "Accepted").length,
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 m-0 tracking-tight">
                    Tất cả ứng viên
                </h1>
                <p className="text-sm sm:text-base text-gray-500 m-0 mt-1 sm:mt-2">
                    Quản lý toàn bộ danh sách hồ sơ ứng tuyển
                </p>
            </div>

            {/* ── STATS CARDS ─────────────────────────────────────────────────── */}
            <Row gutter={[16, 16]} className="mb-6 sm:mb-8">
                <Col xs={12} sm={12} lg={6}>
                    <StatCard title="Tổng hồ sơ" value={stats.total} color="blue" bgColor="bg-blue-50" icon={<FileTextOutlined />} />
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <StatCard title="Đợi xem" value={stats.submitted} color="cyan" bgColor="bg-cyan-50" icon={<ClockCircleOutlined />} />
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <StatCard title="Phỏng vấn" value={stats.interview} color="orange" bgColor="bg-orange-50" icon={<UserOutlined />} />
                </Col>
                <Col xs={12} sm={12} lg={6}>
                    <StatCard title="Trúng tuyển" value={stats.accepted} color="green" bgColor="bg-green-50" icon={<CheckCircleOutlined />} />
                </Col>
            </Row>

            {/* ── FILTERS ─────────────────────────────────────────────────────── */}
            <Card className="mb-4 sm:mb-6 shadow-sm border-0 rounded-2xl" bodyStyle={{ padding: '16px sm:24px' }}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Input
                        placeholder="Tìm kiếm ứng viên, email, vị trí..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full sm:flex-1 h-10 sm:h-11 rounded-xl text-sm sm:text-base"
                        allowClear
                    />
                    <Select
                        placeholder="Trạng thái"
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value)}
                        className="w-full sm:w-[200px] lg:w-[240px] h-10 sm:h-11 text-sm sm:text-base custom-select-rounded"
                        allowClear
                        options={[
                            { value: null, label: "Tất cả trạng thái" },
                            ...statusOptions
                        ]}
                    />
                </div>
            </Card>

            {/* Custom style for Select rounded corners inside Card */}
            <style>{`
                .custom-select-rounded .ant-select-selector {
                    border-radius: 0.75rem !important; /* xl rounded */
                    height: 100% !important;
                    align-items: center;
                }
            `}</style>

            {/* ── TABLE ───────────────────────────────────────────────────────── */}
            <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={filteredApplications}
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
                                description={<span className="text-gray-500 font-medium">Không tìm thấy ứng viên phù hợp</span>}
                                className="py-12"
                            />
                        ),
                    }}
                />
            </Card>
        </div>
    );
};

export default AllApplicationsManagement;
