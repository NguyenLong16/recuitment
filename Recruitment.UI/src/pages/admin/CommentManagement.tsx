import { useState } from 'react';
import {
    Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Badge,
} from 'antd';
import {
    Trash2, RefreshCw, Search, MessageSquare, MessageSquareReply, Building2, Briefcase,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminComment } from '../../types/comment';
import useAdminComment from '../../hooks/useAdminComment';

const CommentManagement = () => {
    const {
        comments,
        loading,
        deletingId,
        keyword,
        setKeyword,
        refetch,
        deleteComment,
    } = useAdminComment();

    const [previewContent, setPreviewContent] = useState<string | null>(null);

    /** Format ngày giờ sang "dd/MM/yyyy HH:mm" */
    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const totalReplies = comments.filter(c => c.isReply).length;
    const totalMain = comments.filter(c => !c.isReply).length;

    const columns: ColumnsType<AdminComment> = [
        {
            title: 'STT',
            key: 'stt',
            width: 64,
            align: 'center',
            render: (_: any, __: AdminComment, index: number) => (
                <span style={{ fontWeight: 600, color: '#0ea5e9' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'isReply',
            key: 'type',
            width: 110,
            align: 'center',
            filters: [
                { text: 'Bình luận', value: false },
                { text: 'Trả lời', value: true },
            ],
            onFilter: (value, record) => record.isReply === value,
            render: (isReply: boolean) =>
                isReply ? (
                    <Tag
                        icon={<MessageSquareReply size={12} />}
                        color="purple"
                        style={{ borderRadius: 8, fontWeight: 500, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                        Trả lời
                    </Tag>
                ) : (
                    <Tag
                        icon={<MessageSquare size={12} />}
                        color="blue"
                        style={{ borderRadius: 8, fontWeight: 500, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 14,
                    }}>
                        {name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{name || '—'}</span>
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
                    style={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#334155',
                        fontSize: 14,
                        cursor: content.length > 60 ? 'pointer' : 'default',
                        padding: '6px 12px',
                        background: '#f8fafc',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                    }}
                    onClick={() => content.length > 60 && setPreviewContent(content)}
                >
                    {content}
                </div>
            ),
        },
        {
            title: 'Tin tuyển dụng',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            width: 200,
            render: (jobTitle: string, record: AdminComment) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Briefcase size={13} color="#0ea5e9" />
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{jobTitle}</span>
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
            render: (_: any, record: AdminComment) => (
                <Space size={4}>
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
                                icon={<Trash2 size={17} />}
                                loading={deletingId === record.id}
                                style={{
                                    borderRadius: 10,
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                }}
                                className="comment-delete-btn"
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
                        Quản lý Bình luận
                    </h1>
                    <p style={{ color: '#94a3b8', margin: '6px 0 0 0', fontSize: 15 }}>
                        Theo dõi và xoá các bình luận vi phạm trong hệ thống
                    </p>
                </div>
                <Tooltip title="Làm mới danh sách">
                    <Button
                        icon={<RefreshCw size={16} />}
                        onClick={refetch}
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
                {/* Tổng bình luận */}
                <Card
                    style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MessageSquare size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {comments.length}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Tổng bình luận
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bình luận gốc */}
                <Card
                    style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MessageSquare size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {totalMain}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Bình luận gốc
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Phản hồi */}
                <Card
                    style={{ borderRadius: 16, border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MessageSquareReply size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {totalReplies}
                            </div>
                            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
                                Phản hồi
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search & Table */}
            <Card
                style={{
                    borderRadius: 16,
                    border: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}
                styles={{ body: { padding: 0 } }}
            >
                {/* Search bar */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                }}>
                    <Input
                        placeholder="Tìm theo tên người dùng hoặc nội dung bình luận..."
                        prefix={<Search size={16} color="#94a3b8" />}
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        allowClear
                        style={{ maxWidth: 440, borderRadius: 10, height: 42, border: '1px solid #e2e8f0' }}
                    />
                    {keyword && (
                        <Badge
                            count={comments.length}
                            style={{ backgroundColor: '#0ea5e9' }}
                            overflowCount={999}
                        >
                            <span style={{ fontSize: 13, color: '#64748b' }}>
                                Kết quả tìm kiếm
                            </span>
                        </Badge>
                    )}
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={comments}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 12,
                        showSizeChanger: true,
                        showTotal: total => `Tổng ${total} bình luận`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{ padding: '48px 0', textAlign: 'center' }}>
                                <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{ color: '#94a3b8', fontSize: 15, margin: 0 }}>
                                    {keyword ? 'Không tìm thấy bình luận phù hợp' : 'Chưa có bình luận nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Preview content modal (nhỏ gọn, dùng Tooltip-style overlay) */}
            {previewContent && (
                <div
                    onClick={() => setPreviewContent(null)}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#fff', borderRadius: 16, padding: '28px 32px',
                            maxWidth: 540, width: '90%', boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <MessageSquare size={18} color="#fff" />
                            </div>
                            <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Nội dung bình luận</span>
                        </div>
                        <p style={{ color: '#334155', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{previewContent}</p>
                        <div style={{ marginTop: 20, textAlign: 'right' }}>
                            <Button
                                onClick={() => setPreviewContent(null)}
                                style={{ borderRadius: 10, height: 40, paddingInline: 20, fontWeight: 500 }}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom CSS */}
            <style>{`
                .comment-delete-btn:hover {
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
            `}</style>
        </div>
    );
};

export default CommentManagement;
