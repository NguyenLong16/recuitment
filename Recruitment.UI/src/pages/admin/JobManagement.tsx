import { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Card, Tooltip, Select, Popconfirm } from 'antd';
import { RefreshCw, Search, Briefcase, Building2, MapPin, Layers, Calendar, Clock, Users, Eye, EyeOff } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminJob, JobStatus } from '../../types/adminJob';
import useAdminJob from '../../hooks/useAdminJob';
import dayjs from 'dayjs';

const STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: -1 },
    { label: 'Bản nháp (Draft)', value: JobStatus.Draft },
    { label: 'Đang hoạt động (Active)', value: JobStatus.Active },
    { label: 'Đã đóng (Closed)', value: JobStatus.Closed },
    { label: 'Đã hết hạn (Expired)', value: JobStatus.Expired },
];

const getStatusTag = (status: JobStatus) => {
    switch (status) {
        case JobStatus.Active:
            return { color: '#10b981', bg: '#ecfdf5', label: 'Hoạt động', dot: '#10b981' };
        case JobStatus.Closed:
            return { color: '#ef4444', bg: '#fef2f2', label: 'Đã đóng', dot: '#ef4444' };
        case JobStatus.Expired:
            return { color: '#f59e0b', bg: '#fffbeb', label: 'Hết hạn', dot: '#f59e0b' };
        case JobStatus.Draft:
        default:
            return { color: '#64748b', bg: '#f1f5f9', label: 'Nháp', dot: '#64748b' };
    }
};

const JobManagement = () => {
    const { jobs, loading, fetchJobs, toggleHideJob } = useAdminJob();

    const [keyword, setKeyword] = useState('');
    const [statusId, setStatusId] = useState<number>(-1);

    useEffect(() => {
        fetchJobs(keyword.trim() || undefined, statusId);
    }, [statusId]); // Tự động gọi lại khi thay đổi filter trạng thái

    const handleSearch = () => {
        fetchJobs(keyword.trim() || undefined, statusId);
    };

    // Card Stats logic
    const countActive = jobs.filter(j => j.status === JobStatus.Active).length;
    const countClosed = jobs.filter(j => j.status === JobStatus.Closed).length;
    const countDraft = jobs.filter(j => j.status === JobStatus.Draft).length;

    const columns: ColumnsType<AdminJob> = [
        {
            title: 'STT',
            key: 'stt',
            width: 70,
            align: 'center',
            render: (_: any, __: AdminJob, index: number) => (
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Thông tin Job',
            key: 'jobInfo',
            width: 300,
            render: (_: any, record: AdminJob) => (
                <div style={{ minWidth: 0 }}>
                    <div style={{
                        fontWeight: 600,
                        color: '#1e293b',
                        fontSize: 15,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: 4,
                        lineHeight: 1.4,
                    }}>
                        {record.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                            <Building2 size={13} style={{ flexShrink: 0 }} />
                            <span style={{ fontWeight: 500 }} className="truncate">{record.companyName || 'Công ty ẩn danh'}</span>
                            <span style={{ color: '#cbd5e1' }}>•</span>
                            <span className="truncate" style={{ fontStyle: 'italic' }}>{record.employerName}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Phân loại',
            key: 'classification',
            width: 200,
            render: (_: any, record: AdminJob) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                        <Layers size={13} style={{ flexShrink: 0, color: '#8b5cf6' }} />
                        <span className="truncate">{record.categoryName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                        <MapPin size={13} style={{ flexShrink: 0, color: '#0ea5e9' }} />
                        <span className="truncate">{record.locationName}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            align: 'center',
            render: (status: JobStatus) => {
                const tag = getStatusTag(status);
                return (
                    <Tag
                        style={{
                            color: tag.color,
                            background: tag.bg,
                            border: 'none',
                            borderRadius: 20,
                            padding: '4px 12px',
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: tag.dot,
                            marginRight: 6,
                        }} />
                        {tag.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Thời gian',
            key: 'time',
            width: 170,
            render: (_: any, record: AdminJob) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13 }}>
                        <Calendar size={13} style={{ flexShrink: 0 }} />
                        <span>Tạo: {dayjs(record.createdDate).format('DD/MM/YYYY')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 13, fontWeight: 500 }}>
                        <Clock size={13} style={{ flexShrink: 0 }} />
                        <span>Hạn: {dayjs(record.deadline).format('DD/MM/YYYY')}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Ứng tuyển',
            dataIndex: 'totalApplications',
            key: 'totalApplications',
            width: 120,
            align: 'center',
            render: (totalApps: number) => (
                <Tag
                    color={totalApps > 0 ? 'blue' : 'default'}
                    style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        fontWeight: 600,
                        border: 'none',
                        background: totalApps > 0 ? '#eff6ff' : '#f8fafc',
                        color: totalApps > 0 ? '#3b82f6' : '#94a3b8',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} />
                        {totalApps}
                    </div>
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_: any, record: AdminJob) => {
                // Xác định trạng thái ẩn/hiện:
                const isHidden = record.status === JobStatus.Closed;
                const isDraftOrExpired = record.status === JobStatus.Draft || record.status === JobStatus.Expired;

                return (
                    <Popconfirm
                        title={isHidden ? "Hoàn tác (Hiện lại)" : "Ẩn bài viết"}
                        description={
                            <span>
                                Bạn có chắc muốn {isHidden ? "hoàn tác" : "ẩn"} bài viết <strong>{record.title}</strong>?
                            </span>
                        }
                        onConfirm={async () => {
                            const success = await toggleHideJob(record.id);
                            if (success) {
                                handleSearch(); // Refresh lại danh sách
                            }
                        }}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: !isHidden }}
                        disabled={isDraftOrExpired}
                    >
                        <Tooltip title={isDraftOrExpired ? "Không thể thao tác Nháp/Hết hạn" : (isHidden ? "Hiện lại" : "Ẩn bài")}>
                            <Button
                                type="text"
                                danger={!isHidden}
                                icon={isHidden ? <Eye size={17} /> : <EyeOff size={17} />}
                                disabled={isDraftOrExpired}
                                style={{
                                    borderRadius: 10,
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    color: isDraftOrExpired ? '#cbd5e1' : (isHidden ? '#10b981' : '#ef4444')
                                }}
                                className={isHidden ? "edit-action-btn" : "delete-action-btn"}
                            />
                        </Tooltip>
                    </Popconfirm>
                );
            },
        },
    ];

    return (
        <div style={{ padding: '0' }}>
            {/* Page Header */}
            <div style={{
                marginBottom: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
            }}>
                <div>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: '#1e293b',
                        margin: 0,
                        letterSpacing: '-0.02em',
                    }}>
                        Quản lý Tin tuyển dụng
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        margin: '6px 0 0 0',
                        fontSize: 15,
                    }}>
                        Danh sách tất cả Job đăng tải trên hệ thống
                    </p>
                </div>

                <Tooltip title="Làm mới danh sách">
                    <Button
                        icon={<RefreshCw size={16} />}
                        onClick={handleSearch}
                        loading={loading}
                        style={{
                            borderRadius: 10,
                            height: 42,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 500,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        Làm mới
                    </Button>
                </Tooltip>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 24,
            }}>
                {/* Tổng Job */}
                <Card
                    style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Briefcase size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {jobs.length}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Tổng tin tuyển dụng</div>
                        </div>
                    </div>
                </Card>

                {/* Hoạt động */}
                <Card
                    style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <RefreshCw size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countActive}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Đang hoạt động</div>
                        </div>
                    </div>
                </Card>

                {/* Đã đóng */}
                <Card
                    style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Users size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countClosed}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Đã đóng</div>
                        </div>
                    </div>
                </Card>

                {/* Bản nháp */}
                <Card
                    style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #64748b, #475569)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Layers size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countDraft}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Bản nháp</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter & Table */}
            <Card
                style={{
                    borderRadius: 16,
                    border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                }}
                styles={{ body: { padding: 0 } }}
            >
                {/* Filter bar */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexWrap: 'wrap',
                }}>
                    <Input
                        placeholder="Tìm tiêu đề, công ty..."
                        prefix={<Search size={16} color="#94a3b8" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        style={{
                            maxWidth: 360,
                            borderRadius: 10,
                            height: 42,
                            border: '1px solid #e2e8f0',
                        }}
                    />
                    <Select
                        value={statusId}
                        onChange={(value) => setStatusId(value)}
                        options={STATUS_OPTIONS}
                        style={{
                            width: 180,
                            height: 42,
                        }}
                        popupMatchSelectWidth={false}
                    />
                    <Button
                        type="primary"
                        icon={<Search size={16} />}
                        onClick={handleSearch}
                        loading={loading}
                        style={{
                            borderRadius: 10,
                            height: 42,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={jobs}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} tin tuyển dụng`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{
                                padding: '48px 0',
                                textAlign: 'center',
                            }}>
                                <Briefcase size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: 15,
                                    margin: 0,
                                }}>
                                    Không tìm thấy tin tuyển dụng nào
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Custom CSS */}
            <style>{`
                .edit-action-btn:hover:not(:disabled) {
                    background: #ecfdf5 !important;
                    transform: scale(1.05);
                }
                .delete-action-btn:hover:not(:disabled) {
                    background: #fef2f2 !important;
                    transform: scale(1.05);
                }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                    font-size: 13px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important;
                    padding: 14px 16px !important;
                }
                .ant-table-tbody > tr > td {
                    padding: 14px 16px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .ant-table-tbody > tr:hover > td {
                    background: #f8fafc !important;
                }
                .ant-table-tbody > tr {
                    transition: all 0.15s ease;
                }
                .ant-select-selector {
                    border-radius: 10px !important;
                    border: 1px solid #e2e8f0 !important;
                }
                .truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            `}</style>
        </div>
    );
};

export default JobManagement;
