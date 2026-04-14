import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { useEffect } from "react";
import { fetchMyJobs, toggleJobStatus, deleteJob } from "../../redux/slices/jobSlice";
import { Button, Card, message, Popconfirm, Switch, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    PlusOutlined
} from "@ant-design/icons";
import { JobResponse } from "../../types/job";

const JobManagement = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { jobs, loading } = useAppSelector((state) => state.jobs);  // Giả sử slice tên 'jobs'

    useEffect(() => {
        dispatch(fetchMyJobs());
    }, [dispatch]);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        if (currentStatus === 'Expired') {
            message.warning('Job đã hết hạn. Vui lòng sửa deadline để hiện lại.');
            return;
        }
        try {
            await dispatch(toggleJobStatus(id));
            message.success('Cập nhật trạng thái thành công');
            // THÊM: Refetch list để update UI ngay
            dispatch(fetchMyJobs());
        } catch (error: any) {
            // THÊM: Xử lý message từ backend (ví dụ: "Vui lòng cập nhật deadline...")
            const errorMsg = typeof error === 'string' ? error : (error.payload as any)?.message || 'Cập nhật thất bại';
            if (errorMsg.includes('hết hạn') || errorMsg.includes('deadline')) {
                message.warning(errorMsg);
            } else {
                message.error(errorMsg);
            }
        }
    };

    const handleDeleteJob = async (id: number) => {
        try {
            await dispatch(deleteJob(id));
            message.success('Đã xóa bài đăng thành công');
        } catch (error: any) {
            message.error('Xóa thất bại');
        }
    };

    const getStatusTag = (status: string): { text: string; color: string; icon?: React.ReactNode } => {
        switch (status) {
            case 'Active':
                return { text: 'Đang tuyển', color: 'green' };
            case 'Expired':
                return {
                    text: 'Hết hạn',
                    color: 'error',
                    icon: <ExclamationCircleOutlined className="mr-1" />
                };
            case 'Closed':
            case 'Draft':
                return { text: 'Đã ẩn', color: 'default' };
            default:
                return { text: status, color: 'default' };
        }
    };

    // Format lương
    const formatSalary = (min?: number, max?: number): string => {
        if (!min && !max) return 'Thương lượng';
        const fmt = (val: number) => (val / 1000000).toFixed(0) + 'tr';
        if (min && max) return `${fmt(min)} - ${fmt(max)}`;
        if (min) return `Từ ${fmt(min)}`;
        return `Tới ${fmt(max!)}`;
    };

    // Get status display & color
    const columns: ColumnsType<JobResponse> = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            responsive: ['md'],
            render: (_, __, index) => (
                <span className="font-medium text-gray-500">{index + 1}</span>
            ),
        },
        {
            title: 'Công việc',
            key: 'jobInfo',
            width: 320,
            render: (_, record) => {
                const PLACEHOLDER = 'https://via.placeholder.com/48?text=Job';
                const API_BASE = 'https://localhost:7016';
                const imgSrc = record.imageUrl
                    ? (record.imageUrl.startsWith('http') ? record.imageUrl : `${API_BASE}${record.imageUrl}`)
                    : PLACEHOLDER;

                return (
                    <div className="flex items-start gap-3 sm:gap-4 py-1">
                        <img
                            src={imgSrc}
                            alt="Job"
                            className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0 hidden sm:block"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.dataset.errorHandled) {
                                    target.dataset.errorHandled = 'true';
                                    target.src = PLACEHOLDER;
                                }
                            }}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-800 text-sm sm:text-[15px] truncate max-w-[200px] sm:max-w-[300px] mb-1 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/hr/job-detail/${record.id}`)}>
                                {record.title}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-1 hidden md:flex">
                                {record.categoryName && <span className="text-xs text-gray-500 truncate max-w-[150px]">{record.categoryName}</span>}
                            </div>

                            {/* Mobile Extra Info inside Title Column */}
                            <div className="md:hidden flex flex-wrap gap-1.5 mt-2">
                                <Tag className="!m-0 text-[10px] text-[#00B14F] bg-green-50/50 border-0">
                                    <DollarOutlined className="mr-1" />
                                    {formatSalary(record.salaryMin, record.salaryMax)}
                                </Tag>
                                <Tag className="!m-0 text-[10px] text-gray-500 bg-gray-50 border-0 truncate max-w-[100px]">
                                    <EnvironmentOutlined className="mr-1" />
                                    {record.locationName}
                                </Tag>
                                <div className="w-full flex items-center justify-between mt-1">
                                    <span className={`text-[11px] font-medium ${dayjs(record.deadline).isBefore(dayjs()) ? 'text-red-500' : 'text-gray-500'}`}>
                                        <CalendarOutlined className="mr-1" />
                                        {dayjs(record.deadline).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Mức lương & Địa điểm',
            key: 'salaryAndLocation',
            width: 160,
            responsive: ['md'],
            render: (_, record) => (
                <div className="space-y-1">
                    <div className="text-sm font-semibold text-[#00B14F]">
                        <DollarOutlined className="mr-1.5" />
                        {formatSalary(record.salaryMin, record.salaryMax)}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={record.locationName}>
                        <EnvironmentOutlined className="mr-1.5" />
                        {record.locationName}
                    </div>
                </div>
            ),
        },
        {
            title: 'Hạn nộp',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 110,
            responsive: ['lg'],
            render: (date: string) => {
                const isExpired = dayjs(date).isBefore(dayjs());
                return (
                    <div className={`text-sm font-medium ${isExpired ? 'text-red-500' : 'text-gray-700'}`}>
                        {dayjs(date).format('DD/MM/YYYY')}
                        {isExpired && <div className="text-[10px] leading-tight mt-0.5">(Đã hết hạn)</div>}
                    </div>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string, record) => {
                const { text, color, icon } = getStatusTag(status);
                const isActive = status === 'Active';
                const isExpired = status === 'Expired';

                return (
                    <div className="flex flex-col gap-2">
                        <Tag color={color} className="font-medium w-fit !m-0 !px-2.5 !py-0.5 rounded-md text-xs">
                            {icon}{text}
                        </Tag>
                        {!isExpired && (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <Switch
                                    checked={isActive}
                                    onChange={() => handleToggleStatus(record.id, status)}
                                    size="small"
                                />
                                <span className="text-[11px] text-gray-500">{isActive ? 'Đang bật' : 'Đang tắt'}</span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: '...',
            key: 'action',
            width: 100, // Reduced width since buttons are icon-only mostly
            fixed: 'right',
            align: 'right',
            render: (_, record) => (
                <div className="flex justify-end gap-1.5 sm:gap-2">
                    <Tooltip title="Xem ứng viên">
                        <Button
                            type="primary"
                            ghost
                            icon={<TeamOutlined />}
                            onClick={() => navigate(`/hr/applications/${record.id}`)}
                            size="small"
                            className="flex items-center justify-center !border-indigo-200 hover:!bg-indigo-50"
                        />
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => navigate(`/hr/edit-job/${record.id}`)}
                            size="small"
                            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                        />
                    </Tooltip>

                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài đăng này?"
                        onConfirm={() => handleDeleteJob(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Tooltip title="Xóa">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                className="flex items-center justify-center"
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const activeJobsCount = jobs?.filter(j => j.status === 'Active').length || 0;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto bg-gray-50 min-h-screen">
            {/* ── HEADER ──────────────────────────────────────────────────────── */}
            <Card className="mb-4 sm:mb-6 shadow-sm border-0 rounded-2xl" bodyStyle={{ padding: '16px sm:24px' }}>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <FileTextOutlined className="text-xl sm:text-2xl text-[#00B14F]" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 m-0 tracking-tight leading-tight">
                                Tin tuyển dụng
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 m-0 mt-0.5 sm:mt-1 truncate">
                                Quản lý ({jobs?.length || 0}) bài đăng • {activeJobsCount} đang tuyển
                            </p>
                        </div>
                    </div>

                    {/* Add Job Button */}
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/hr/post-job')}
                        className="w-full sm:w-auto h-10 sm:h-11 px-5 rounded-xl font-medium bg-[#00B14F] hover:bg-[#009e46] border-0 shadow-sm sm:shadow-md"
                    >
                        Đăng tin mới
                    </Button>
                </div>
            </Card>

            {/* ── TABLE ───────────────────────────────────────────────────────── */}
            <Card className="shadow-sm border-0 rounded-2xl overflow-hidden" bodyStyle={{ padding: 0 }}>
                <Table
                    columns={columns}
                    dataSource={jobs}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => <span className="font-medium text-gray-600 hidden sm:inline">Tổng {total} tin</span>,
                        className: "px-4 sm:px-6 my-4"
                    }}
                    scroll={{ x: 'max-content' }}
                    className="custom-responsive-table job-management-table"
                />
            </Card>

            <style>{`
                .job-management-table .ant-table-cell {
                    vertical-align: middle;
                }
                @media (max-width: 640px) {
                    .job-management-table .ant-table-cell {
                        padding: 12px 8px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobManagement;