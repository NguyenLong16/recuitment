import { useState } from 'react';
import { Table, Button, Popconfirm, Tag, Input, Card, Tooltip, Badge } from 'antd';
import {
    Trash2, RefreshCw, Search, MessageSquare, MessageSquareReply, Building2, Briefcase,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminComment } from '../../types/comment';
import useAdminComment from '../../hooks/useAdminComment';

// ── Stat card nhỏ gọn dùng lại ───────────────────────────────────────────────
const StatCard = ({
    icon,
    value,
    label,
    gradient,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
    gradient: string;
}) => (
    <Card className="!rounded-2xl !border-0 !shadow-sm" styles={{ body: { padding: '16px 20px' } }}>
        <div className="flex items-center gap-3 sm:gap-4">
            <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center"
                style={{ background: gradient }}
            >
                {icon}
            </div>
            <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">{value}</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">{label}</div>
            </div>
        </div>
    </Card>
);

const CommentManagement = () => {
    const {
        comments, loading, deletingId, keyword, setKeyword, refetch, deleteComment,
    } = useAdminComment();

    const [previewContent, setPreviewContent] = useState<string | null>(null);

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const totalReplies = comments.filter(c => c.isReply).length;
    const totalMain = comments.filter(c => !c.isReply).length;

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<AdminComment> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: AdminComment, i: number) => (
                <span className="font-semibold text-sky-500">{i + 1}</span>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'isReply',
            key: 'type',
            width: 110,
            align: 'center',
            responsive: ['sm'],
            filters: [
                { text: 'Bình luận', value: false },
                { text: 'Trả lời', value: true },
            ],
            onFilter: (value, record) => record.isReply === value,
            render: (isReply: boolean) => isReply ? (
                <Tag
                    icon={<MessageSquareReply size={11} />}
                    color="purple"
                    className="!rounded-lg !font-medium !text-xs !inline-flex !items-center !gap-1"
                >
                    Trả lời
                </Tag>
            ) : (
                <Tag
                    icon={<MessageSquare size={11} />}
                    color="blue"
                    className="!rounded-lg !font-medium !text-xs !inline-flex !items-center !gap-1"
                >
                    Bình luận
                </Tag>
            ),
        },
        {
            title: 'Người bình luận',
            dataIndex: 'commenterName',
            key: 'commenterName',
            width: 160,
            render: (name: string) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                    text-white font-bold text-sm
                                    bg-gradient-to-br from-indigo-500 to-purple-500">
                        {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[90px] sm:max-w-none">
                        {name || '—'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (content: string) => (
                <div
                    title={content}
                    onClick={() => content.length > 60 && setPreviewContent(content)}
                    className={`max-w-[200px] sm:max-w-[260px] md:max-w-[300px]
                                truncate text-slate-700 text-xs sm:text-sm
                                px-2.5 sm:px-3 py-1.5 sm:py-1.5
                                bg-slate-50 rounded-lg border border-slate-200
                                ${content.length > 60 ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
                >
                    {content}
                </div>
            ),
        },
        {
            title: 'Tin tuyển dụng',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            width: 180,
            responsive: ['lg'],           // ẩn trên sm và md
            render: (jobTitle: string, record: AdminComment) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                        <Briefcase size={12} className="text-sky-500 flex-shrink-0" />
                        <span className="font-semibold text-xs text-slate-800 truncate max-w-[130px]">{jobTitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Building2 size={11} className="text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500 truncate max-w-[130px]">{record.companyName}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 130,
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
            render: (_: any, record: AdminComment) => (
                <Popconfirm
                    title="Xoá bình luận"
                    description={
                        <span>
                            Bạn có chắc muốn xoá bình luận này?<br />
                            Hành động này không thể hoàn tác.
                        </span>
                    }
                    onConfirm={() => deleteComment(record.id)}
                    okText="Xoá"
                    cancelText="Huỷ"
                    okButtonProps={{ danger: true, loading: deletingId === record.id }}
                >
                    <Tooltip title="Xoá bình luận">
                        <Button
                            type="text"
                            danger
                            icon={<Trash2 size={15} />}
                            loading={deletingId === record.id}
                            className="comment-delete-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center"
                        />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight m-0">
                        Quản lý Bình luận
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Theo dõi và xoá các bình luận vi phạm trong hệ thống
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
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <StatCard
                    icon={<MessageSquare size={20} color="#fff" className="sm:w-6 sm:h-6" />}
                    value={comments.length}
                    label="Tổng bình luận"
                    gradient="linear-gradient(135deg,#0ea5e9,#06b6d4)"
                />
                <StatCard
                    icon={<MessageSquare size={20} color="#fff" className="sm:w-6 sm:h-6" />}
                    value={totalMain}
                    label="Bình luận gốc"
                    gradient="linear-gradient(135deg,#3b82f6,#6366f1)"
                />
                <StatCard
                    icon={<MessageSquareReply size={20} color="#fff" className="sm:w-6 sm:h-6" />}
                    value={totalReplies}
                    label="Phản hồi"
                    gradient="linear-gradient(135deg,#8b5cf6,#a855f7)"
                />
            </div>

            {/* ── Search + Table ─────────────────────────────────────────────── */}
            <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>

                {/* Search bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3
                                px-3 py-3 sm:px-5 sm:py-4 md:px-6
                                border-b border-slate-100 bg-slate-50/60">
                    <Input
                        placeholder="Tìm theo tên người dùng hoặc nội dung..."
                        prefix={<Search size={15} color="#94a3b8" />}
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        allowClear
                        size="middle"
                        className="!rounded-xl !h-10 !border-slate-200 w-full sm:!max-w-xs md:!max-w-sm lg:!max-w-md"
                    />
                    {keyword && (
                        <Badge count={comments.length} style={{ backgroundColor: '#0ea5e9' }} overflowCount={999}>
                            <span className="text-xs sm:text-[13px] text-slate-500">Kết quả tìm kiếm</span>
                        </Badge>
                    )}
                </div>

                {/* Table — scroll ngang trên sm/md */}
                <Table
                    columns={columns}
                    dataSource={comments}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 480 }}
                    pagination={{
                        pageSize: 12,
                        showSizeChanger: true,
                        showTotal: total => `Tổng ${total} bình luận`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <MessageSquare size={40} color="#cbd5e1" className="mx-auto mb-3" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    {keyword ? 'Không tìm thấy bình luận phù hợp' : 'Chưa có bình luận nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* ── Preview content overlay ────────────────────────────────────── */}
            {previewContent && (
                <div
                    onClick={() => setPreviewContent(null)}
                    className="fixed inset-0 bg-black/45 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
                >
                    {/* sm: bottom sheet; md+: modal giữa màn */}
                    <div
                        onClick={e => e.stopPropagation()}
                        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl
                                   p-5 sm:p-7 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center
                                            bg-gradient-to-br from-sky-500 to-cyan-500">
                                <MessageSquare size={16} color="#fff" />
                            </div>
                            <span className="font-bold text-sm sm:text-base text-slate-800">
                                Nội dung bình luận
                            </span>
                        </div>
                        <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed m-0">
                            {previewContent}
                        </p>
                        <div className="mt-5 flex justify-end">
                            <Button
                                onClick={() => setPreviewContent(null)}
                                className="!rounded-xl !h-9 sm:!h-10 !px-5 !font-medium !border-slate-200"
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS */}
            <style>{`
                .comment-delete-btn:hover { background: #fef2f2 !important; transform: scale(1.05); }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important; font-weight: 600 !important; color: #475569 !important;
                    font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important; padding: 12px 14px !important;
                }
                .ant-table-tbody > tr > td { padding: 12px 14px !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
                .ant-table-tbody > tr { transition: all 0.15s ease; }
            `}</style>
        </div>
    );
};

export default CommentManagement;
