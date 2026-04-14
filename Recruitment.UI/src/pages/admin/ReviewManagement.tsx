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

// ── Stat Card tái dùng ────────────────────────────────────────────────────────
const StatCard = ({
    icon: Icon, value, label, gradient, highlight,
}: { icon: any; value: string | number; label: string; gradient: string, highlight?: boolean }) => (
    <Card
        className={`!rounded-2xl !border-0 ${highlight ? '!ring-1 !ring-red-200 !shadow-[0_1px_3px_rgba(239,68,68,0.15)]' : '!shadow-sm'}`}
        styles={{ body: { padding: '16px 20px' } }}
    >
        <div className="flex items-center gap-3 sm:gap-4">
            <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0
                           flex items-center justify-center"
                style={{ background: gradient }}
            >
                <Icon size={20} color="#fff" className="sm:w-[24px] sm:h-[24px]" fill={Icon === Star ? "#fff" : "none"} />
            </div>
            <div>
                <div className={`text-2xl sm:text-3xl font-bold leading-none ${highlight ? 'text-red-500' : 'text-slate-800'}`}>
                    {value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{label}</div>
            </div>
        </div>
    </Card>
);

const ReviewManagement = () => {
    const {
        reviews, loading, deletingId, keyword, ratingFilter,
        setKeyword, setRatingFilter, refetch, deleteReview,
    } = useAdminReview();

    /** Format ngày giờ */
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

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<AdminReview> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: AdminReview, index: number) => (
                <span className="font-semibold text-sky-500">{index + 1}</span>
            ),
        },
        {
            title: 'Người đánh giá',
            dataIndex: 'reviewerName',
            key: 'reviewerName',
            width: 170,
            render: (name: string) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex-shrink-0 flex items-center justify-center
                                    text-white font-bold text-sm bg-gradient-to-br from-amber-500 to-orange-500">
                        {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none">
                        {name || '—'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 140,
            align: 'center',
            sorter: (a, b) => a.rating - b.rating,
            filters: [1, 2, 3, 4, 5].map(r => ({ text: `${r} sao`, value: r })),
            onFilter: (value, record) => record.rating === value,
            render: (rating: number) => {
                const cfg = ratingConfig[rating];
                return (
                    <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5">
                        <Rate disabled value={rating} className="!text-sm sm:!text-base" style={{ color: cfg?.color }} />
                        <Tag
                            className="!rounded-lg !text-[10px] sm:!text-xs !font-semibold !border-0 !m-0 !px-2 !py-0.5"
                            style={{ color: cfg?.color, background: cfg?.bg }}
                        >
                            {rating === 1 && <AlertTriangle size={10} className="inline mr-1 -mt-0.5" />}
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
                <div
                    className={`max-w-[200px] sm:max-w-[260px] lg:max-w-[280px]
                                px-2.5 sm:px-3 py-1.5 sm:py-2
                                rounded-lg border text-xs sm:text-sm leading-relaxed`}
                    style={{
                        background: record.rating === 1 ? '#fef2f2' : '#f8fafc',
                        borderColor: record.rating === 1 ? '#fecaca' : '#e2e8f0',
                        color: record.rating === 1 ? '#dc2626' : '#334155',
                    }}
                >
                    <div className="line-clamp-3">
                        {comment || <span className="text-slate-400 italic">Không có nội dung</span>}
                    </div>
                </div>
            ),
        },
        {
            title: 'Tin tuyển dụng',
            key: 'job',
            width: 180,
            responsive: ['lg'], // chỉ hiện trên desktop lớn
            render: (_: any, record: AdminReview) => (
                <div className="flex flex-col gap-1 sm:gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs">
                        <Briefcase size={12} className="text-sky-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">{record.jobTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 size={12} className="flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{record.companyName}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 120,
            responsive: ['md'],
            sorter: (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
            defaultSortOrder: 'ascend',
            render: (date: string) => (
                <span className="text-xs sm:text-[13px] text-slate-500 whitespace-nowrap">{formatDate(date)}</span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 56,
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
                                icon={<Trash2 size={15} />}
                                loading={deletingId === record.id}
                                className="review-delete-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight m-0">
                        Quản lý Đánh giá
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Theo dõi và xoá các đánh giá spam hoặc vi phạm
                    </p>
                </div>
                <Tooltip title="Làm mới danh sách">
                    <Button
                        icon={<RefreshCw size={15} />}
                        onClick={refetch}
                        loading={loading}
                        size="middle"
                        className="!rounded-xl !h-10 sm:!h-[42px] !font-medium !border-slate-200 flex items-center gap-1.5"
                    >
                        <span className="hidden sm:inline">Làm mới</span>
                    </Button>
                </Tooltip>
            </div>

            {/* ── Stat Cards ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={Star} value={reviews.length} label="Tổng đánh giá"
                    gradient="linear-gradient(135deg,#0ea5e9,#06b6d4)"
                />
                <StatCard
                    icon={Star} value={avgRating} label="Điểm TB"
                    gradient="linear-gradient(135deg,#f59e0b,#f97316)"
                />
                <StatCard
                    icon={AlertTriangle} value={spamCount} label="Spam (1★)"
                    gradient={spamCount > 0 ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#94a3b8,#64748b)'}
                    highlight={spamCount > 0}
                />
                <StatCard
                    icon={Star} value={countByRating(5)} label="5 sao"
                    gradient="linear-gradient(135deg,#22c55e,#16a34a)"
                />
            </div>

            {/* ── Filter + Table ─────────────────────────────────────────────── */}
            <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3
                                px-3 py-3 sm:px-5 sm:py-4 md:px-6
                                border-b border-slate-100 bg-slate-50/60 w-full">
                    <Input
                        placeholder="Tìm người dùng, nội dung..."
                        prefix={<Search size={15} color="#94a3b8" />}
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        allowClear
                        size="middle"
                        className="!rounded-xl !h-10 !border-slate-200 w-full sm:w-[220px] md:w-[260px] lg:w-[320px]"
                    />
                    <Select
                        placeholder="Lọc số sao"
                        allowClear
                        value={ratingFilter}
                        onChange={(val) => setRatingFilter(val ?? null)}
                        size="middle"
                        className="w-full sm:w-[160px] md:w-[180px] custom-rate-select"
                        popupMatchSelectWidth={false}
                    >
                        {[1, 2, 3, 4, 5].map(r => (
                            <Option key={r} value={r}>
                                <div className="flex items-center gap-1.5">
                                    <Rate disabled value={r} count={r} className="!text-xs" style={{ color: ratingConfig[r]?.color }} />
                                    <span className="font-semibold text-xs whitespace-nowrap" style={{ color: ratingConfig[r]?.color }}>
                                        {r} sao
                                    </span>
                                </div>
                            </Option>
                        ))}
                    </Select>

                    {(keyword || ratingFilter) && (
                        <div className="hidden sm:flex items-center ml-auto">
                            <Badge count={reviews.length} style={{ backgroundColor: '#0ea5e9' }} overflowCount={999}>
                                <span className="text-xs sm:text-[13px] text-slate-500 mr-2">Kết quả</span>
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Alert spam banner */}
                {spamCount > 0 && !ratingFilter && !keyword && (
                    <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-red-50 border-b border-red-200 flex items-center gap-2 sm:gap-3">
                        <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                        <span className="text-red-700 text-xs sm:text-sm font-medium">
                            Có <strong>{spamCount}</strong> đánh giá 1 sao nghi ngờ spam — {' '}
                            <button
                                onClick={() => setRatingFilter(1)}
                                className="bg-transparent border-0 text-red-600 font-bold underline cursor-pointer p-0 hover:text-red-800"
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
                    scroll={{ x: 500 }}
                    rowClassName={(record) => record.rating === 1 ? 'review-spam-row' : ''}
                    pagination={{
                        pageSize: 12,
                        showSizeChanger: true,
                        showTotal: total => `Tổng ${total} đánh giá`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Star size={40} color="#cbd5e1" className="mx-auto mb-3" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
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
                .review-delete-btn:hover { background: #fef2f2 !important; transform: scale(1.05); }
                .review-spam-row > td { background: #fffbfb !important; }
                .review-spam-row:hover > td { background: #fef2f2 !important; }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important; font-weight: 600 !important; color: #475569 !important;
                    font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important; padding: 12px 14px !important;
                }
                .ant-table-tbody > tr > td { padding: 12px 14px !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-tbody > tr { transition: all 0.15s ease; }
                .custom-rate-select .ant-select-selector { border-radius: 12px !important; border: 1px solid #e2e8f0 !important; }
                .ant-rate-star:not(:last-child) { margin-inline-end: 2px !important; }
            `}</style>
        </div>
    );
};

export default ReviewManagement;
