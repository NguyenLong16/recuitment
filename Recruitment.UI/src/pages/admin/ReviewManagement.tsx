import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Rate, Select, Badge } from 'antd';
import { Trash2, RefreshCw, Search, Star, Briefcase, Building2, AlertTriangle } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminReview } from '../../types/review';
import useAdminReview from '../../hooks/useAdminReview';

const { Option } = Select;

/** Màu sắc cho từng mức rating */
const ratingConfig: Record<number, { color: string; bg: string; label: string }> = {
    1: { color: '#ef4444', bg: '#fef2f2', label: '1 sao — Rất tệ' },
    2: { color: '#f97316', bg: '#fff7ed', label: '2 sao — Tệ' },
    3: { color: '#eab308', bg: '#fefce8', label: '3 sao — Trung bình' },
    4: { color: '#22c55e', bg: '#f0fdf4', label: '4 sao — Tốt' },
    5: { color: '#0ea5e9', bg: '#f0f9ff', label: '5 sao — Rất tốt' },
};

const ReviewManagement = () => {
    const {
        reviews,
        loading,
        deletingId,
        keyword,
        ratingFilter,
        setKeyword,
        setRatingFilter,
        refetch,
        deleteReview,
    } = useAdminReview();

    /** Format ngày giờ sang "dd/MM/yyyy HH:mm" */
    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    /** Đếm theo rating */
    const countByRating = (r: number) => reviews.filter(x => x.rating === r).length;
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : '—';

    /** Phát hiện review nghi ngờ spam (1 sao) */
    const spamCount = countByRating(1);

    const columns: ColumnsType<AdminReview> = [
        {
            title: 'STT',
            key: 'stt',
            width: 64,
            align: 'center',
            render: (_: any, __: AdminReview, index: number) => (
                <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Người đánh giá',
            dataIndex: 'reviewerName',
            key: 'reviewerName',
            width: 170,
            render: (name: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
                    }}>
                        {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>
                        {name || '—'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 180,
            align: 'center',
            sorter: (a, b) => a.rating - b.rating,
            filters: [1, 2, 3, 4, 5].map(r => ({ text: `${r} sao`, value: r })),
            onFilter: (value, record) => record.rating === value,
            render: (rating: number) => {
                const cfg = ratingConfig[rating];
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <Rate disabled value={rating} style={{ fontSize: 16, color: cfg?.color }} />
                        <Tag
                            style={{
                                borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none',
                                color: cfg?.color, background: cfg?.bg,
                            }}
                        >
                            {rating === 1 && <AlertTriangle size={11} style={{ marginRight: 4, verticalAlign: -1 }} />}
                            {cfg?.label}
                        </Tag>
                    </div>
                );
            },
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
            render: (comment: string, record: AdminReview) => (
                <div style={{
                    maxWidth: 280,
                    padding: '8px 12px',
                    background: record.rating === 1 ? '#fef2f2' : '#f8fafc',
                    borderRadius: 8,
                    border: `1px solid ${record.rating === 1 ? '#fecaca' : '#e2e8f0'}`,
                    color: record.rating === 1 ? '#dc2626' : '#334155',
                    fontSize: 14,
                    lineHeight: 1.6,
                }}>
                    {comment || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có nội dung</span>}
                </div>
            ),
        },
        {
            title: 'Tin tuyển dụng',
            key: 'job',
            width: 200,
            render: (_: any, record: AdminReview) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={13} color="#0ea5e9" />
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                            {record.jobTitle}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={12} color="#94a3b8" />
                        <span style={{ fontSize: 12, color: '#64748b' }}>{record.companyName}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 140,
            sorter: (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
            defaultSortOrder: 'ascend',
            render: (date: string) => (
                <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {formatDate(date)}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_: any, record: AdminReview) => (
                <Space size={4}>
                    <Popconfirm
                        title="Xoá đánh giá"
                        description={
                            <span>
                                Bạn có chắc muốn xoá đánh giá này?<br />
                                Hành động này không thể hoàn tác.
                            </span>
                        }
                        onConfirm={() => deleteReview(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    >
                        <Tooltip title="Xoá đánh giá">
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={17} />}
                                loading={deletingId === record.id}
                                style={{
                                    borderRadius: 10, width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                }}
                                className="review-delete-btn"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 0 }}>
            {/* Page Header */}
            <div style={{
                marginBottom: 28,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
            }}>
                <div>
                    <h1 style={{
                        fontSize: 28, fontWeight: 700, color: '#1e293b',
                        margin: 0, letterSpacing: '-0.02em',
                    }}>
                        Quản lý Đánh giá
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 15 }}>
                        Theo dõi và xoá các đánh giá spam hoặc vi phạm
                    </p>
                </div>
                <Tooltip title="Làm mới danh sách">
                    <Button
                        icon={<RefreshCw size={16} />}
                        onClick={refetch}
                        loading={loading}
                        style={{
                            borderRadius: 10, height: 42,
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontWeight: 500, border: '1px solid #e2e8f0',
                        }}
                    >
                        Làm mới
                    </Button>
                </Tooltip>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: 16, marginBottom: 24,
            }}>
                {/* Tổng đánh giá */}
                <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Star size={24} color="#fff" fill="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {reviews.length}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Tổng đánh giá
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Điểm TB */}
                <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Star size={24} color="#fff" fill="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {avgRating}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Điểm trung bình
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Nghi ngờ spam */}
                <Card style={{
                    borderRadius: 16, border: 'none',
                    boxShadow: spamCount > 0
                        ? '0 1px 3px rgba(239,68,68,0.15), 0 0 0 1px #fecaca'
                        : '0 1px 3px rgba(0,0,0,0.04)',
                }}
                    styles={{ body: { padding: '20px 24px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: spamCount > 0
                                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                : 'linear-gradient(135deg, #94a3b8, #64748b)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <AlertTriangle size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 28, fontWeight: 700, lineHeight: 1.2,
                                color: spamCount > 0 ? '#ef4444' : '#1e293b',
                            }}>
                                {spamCount}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Nghi ngờ spam (1★)
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 5 sao */}
                <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Star size={24} color="#fff" fill="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countByRating(5)}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Đánh giá 5 sao
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search + Filter + Table */}
            <Card
                style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}
                styles={{ body: { padding: 0 } }}
            >
                {/* Toolbar */}
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
                        placeholder="Tìm theo tên người dùng hoặc nội dung..."
                        prefix={<Search size={16} color="#94a3b8" />}
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        allowClear
                        style={{ maxWidth: 380, borderRadius: 10, height: 42, border: '1px solid #e2e8f0' }}
                    />
                    <Select
                        placeholder="Lọc theo số sao"
                        allowClear
                        value={ratingFilter}
                        onChange={(val) => setRatingFilter(val ?? null)}
                        style={{ width: 180, borderRadius: 10 }}
                        size="large"
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                            <Option key={r} value={r}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Rate disabled value={r} count={r} style={{ fontSize: 13, color: ratingConfig[r]?.color }} />
                                    <span style={{ color: ratingConfig[r]?.color, fontWeight: 600, fontSize: 13 }}>
                                        {r} sao
                                    </span>
                                </div>
                            </Option>
                        ))}
                    </Select>

                    {(keyword || ratingFilter) && (
                        <Badge
                            count={reviews.length}
                            style={{ backgroundColor: '#0ea5e9' }}
                            overflowCount={999}
                        >
                            <span style={{ fontSize: 13, color: '#64748b' }}>Kết quả</span>
                        </Badge>
                    )}
                </div>

                {/* Alert spam banner */}
                {spamCount > 0 && !ratingFilter && !keyword && (
                    <div style={{
                        padding: '12px 24px',
                        background: '#fef2f2',
                        borderBottom: '1px solid #fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                    }}>
                        <AlertTriangle size={18} color="#ef4444" />
                        <span style={{ color: '#dc2626', fontSize: 14, fontWeight: 500 }}>
                            Có <strong>{spamCount}</strong> đánh giá 1 sao nghi ngờ spam —{' '}
                            <button
                                onClick={() => setRatingFilter(1)}
                                style={{
                                    background: 'none', border: 'none', color: '#dc2626',
                                    fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0,
                                }}
                            >
                                Xem ngay
                            </button>
                        </span>
                    </div>
                )}

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={reviews}
                    rowKey="id"
                    loading={loading}
                    rowClassName={(record) => record.rating === 1 ? 'review-spam-row' : ''}
                    pagination={{
                        pageSize: 12,
                        showSizeChanger: true,
                        showTotal: total => `Tổng ${total} đánh giá`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '48px 0', textAlign: 'center' }}>
                                <Star size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>
                                    {keyword || ratingFilter
                                        ? 'Không tìm thấy đánh giá phù hợp'
                                        : 'Chưa có đánh giá nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Custom CSS */}
            <style>{`
                .review-delete-btn:hover {
                    background: #fef2f2 !important;
                    transform: scale(1.05);
                }
                .review-spam-row > td {
                    background: #fffbfb !important;
                }
                .review-spam-row:hover > td {
                    background: #fef2f2 !important;
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
                .ant-table-tbody > tr {
                    transition: all 0.15s ease;
                }
            `}</style>
        </div>
    );
};

export default ReviewManagement;
