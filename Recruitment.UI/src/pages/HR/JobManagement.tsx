import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hook";
import { useEffect } from "react";
import { fetchMyJobs, toggleJobStatus, deleteJob } from "../../redux/slices/jobSlice";
import { Button, message, Popconfirm, Space, Switch, Table, Tag } from "antd";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
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
        const fmt = (val: number) => val.toLocaleString('vi-VN') + ' VND';
        return `${fmt(min || 0)} - ${fmt(max || 0)}`;
    };

    // Format skills (comma-separated)
    const formatSkills = (skills: string[] | undefined): string => {
        return skills?.join(', ') || 'Không yêu cầu';
    };

    // Get status display & color
    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center' as const,
            render: (_: any, __: JobResponse, index: number) => (
                <span className="font-medium">{index + 1}</span>
            ),
        },
        {
            title: 'Ảnh',
            dataIndex: 'imageFile',
            key: 'imageFile',
            width: 80,
            render: (imageFile: string) => {
                const API_BASE = 'https://localhost:7016';
                const PLACEHOLDER = 'https://via.placeholder.com/48x48?text=Job';
                const imgSrc = imageFile
                    ? (imageFile.startsWith('http') ? imageFile : `${API_BASE}${imageFile}`)
                    : PLACEHOLDER;
                return (
                    <img
                        src={imgSrc}
                        alt="Job"
                        className="w-12 h-12 object-cover rounded bg-gray-100"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Prevent infinite loop
                            if (!target.dataset.errorHandled) {
                                target.dataset.errorHandled = 'true';
                                target.src = PLACEHOLDER;
                            }
                        }}
                    />
                );
            },
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            render: (text: string) => <span className="font-semibold">{text}</span>,
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 150,
        },
        {
            title: 'Ngành nghề',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 150,
        },
        {
            title: 'Địa điểm',
            dataIndex: 'locationName',
            key: 'locationName',
            width: 120,
        },
        {
            title: 'Lương',
            key: 'salary',
            width: 150,
            render: (_: any, record: JobResponse) => (
                <span>{formatSalary(record.salaryMin, record.salaryMax)}</span>
            ),
        },
        {
            title: 'Kỹ năng',
            key: 'skills',
            width: 200,
            render: (_: any, record: JobResponse) => (
                <span className="text-sm">{formatSkills(record.skillNames)}</span>
            ),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 120,
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Hạn nộp',
            dataIndex: 'deadline',  // SỬA: Từ 'dealine' → 'deadline'
            key: 'deadline',
            width: 120,
            render: (date: string) => {
                const isExpired = dayjs(date).isBefore(dayjs());
                return (
                    <span className={isExpired ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                        {dayjs(date).format('DD/MM/YYYY')}
                    </span>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 180,
            render: (status: string, record: JobResponse) => {
                const { text, color, icon } = getStatusTag(status);
                const isActive = status === 'Active';
                const isExpired = status === 'Expired';

                return (
                    <Space direction="vertical" size="small" className="align-start">
                        {/* THÊM: Chỉ show Switch nếu không Expired */}
                        {!isExpired ? (
                            <Space>
                                <Switch
                                    checked={isActive}
                                    onChange={() => handleToggleStatus(record.id, status)}
                                    checkedChildren="Hiện"
                                    unCheckedChildren="Ẩn"
                                    size="small"
                                    title={isActive ? 'Ẩn job' : 'Hiện job (kiểm tra deadline)'}  // THÊM: Tooltip
                                />
                            </Space>
                        ) : (
                            // THÊM: Nếu Expired, show message thay Switch
                            <div className="text-xs text-gray-600 italic">
                                Không thể toggle (hết hạn)
                            </div>
                        )}
                        <Tag color={color} className="font-medium">
                            {icon}{text}
                        </Tag>
                    </Space>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 200,
            render: (_: any, record: JobResponse) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/hr/edit-job/${record.id}`)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa bài đăng này không?"
                        onConfirm={() => handleDeleteJob(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý tin tuyển dụng</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/hr/post-job')}  // SỬA: Thêm '/' để absolute path
                    size="large"
                >
                    Đăng tin tuyển dụng
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={jobs}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1500 }}  // THÊM: Scroll ngang để table responsive (tổng width ~1500px)
                className="custom-table"  // Optional: Custom CSS nếu cần (ví dụ: .custom-table { overflow-x: auto; })
            />
        </div>
    );
};

export default JobManagement;