import { useEffect, useState } from 'react';
import { Table, Button, Input, Card, Tooltip, Select, Popconfirm } from 'antd';
import {
    RefreshCw, Search, Briefcase, Building2, MapPin,
    Layers, Calendar, Clock, Users, Eye, EyeOff,
} from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminJob, JobStatus } from '../../types/adminJob';
import useAdminJob from '../../hooks/useAdminJob';
import dayjs from 'dayjs';

const STATUS_OPTIONS = [
    { label: 'Tất cả', value: -1 },
    { label: 'Bản nháp', value: JobStatus.Draft },
    { label: 'Hoạt động', value: JobStatus.Active },
    { label: 'Đã đóng', value: JobStatus.Closed },
    { label: 'Hết hạn', value: JobStatus.Expired },
];

const getStatusTag = (status: JobStatus) => {
    switch (status) {
        case JobStatus.Active: return { color: '#10b981', bg: '#ecfdf5', label: 'Hoạt động' };
        case JobStatus.Closed: return { color: '#ef4444', bg: '#fef2f2', label: 'Đã đóng' };
        case JobStatus.Expired: return { color: '#f59e0b', bg: '#fffbeb', label: 'Hết hạn' };
        default: return { color: '#64748b', bg: '#f1f5f9', label: 'Nháp' };
    }
};

// ── Stat Card tái dùng ────────────────────────────────────────────────────────
const StatCard = ({
    icon: Icon, value, label, gradient,
}: { icon: any; value: number; label: string; gradient: string }) => (
    <Card className="!rounded-2xl !border-0 !shadow-sm" styles={{ body: { padding: '14px 18px' } }}>
        <div className="flex items-center gap-3">
            <div
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl flex-shrink-0
                           flex items-center justify-center"
                style={{ background: gradient }}
            >
                <Icon size={18} color="#fff" />
            </div>
            <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-800 leading-none">
                    {value}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">{label}</div>
            </div>
        </div>
    </Card>
);

const JobManagement = () => {
    const { jobs, loading, fetchJobs, toggleHideJob } = useAdminJob();
    const [keyword, setKeyword] = useState('');
    const [statusId, setStatusId] = useState<number>(-1);

    useEffect(() => {
        fetchJobs(keyword.trim() || undefined, statusId);
    }, [statusId]);

    const handleSearch = () => fetchJobs(keyword.trim() || undefined, statusId);

    const countActive = jobs.filter(j => j.status === JobStatus.Active).length;
    const countClosed = jobs.filter(j => j.status === JobStatus.Closed).length;
    const countDraft = jobs.filter(j => j.status === JobStatus.Draft).length;

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<AdminJob> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center',
            responsive: ['lg'],
            render: (_: any, __: AdminJob, i: number) => (
                <span className="font-semibold text-blue-500">{i + 1}</span>
            ),
        },
        {
            title: 'Thông tin Job',
            key: 'jobInfo',
            render: (_: any, record: AdminJob) => (
                <div className="min-w-0">
                    <div className="font-semibold text-slate-800 text-xs sm:text-sm md:text-[15px]
                                    line-clamp-2 leading-snug mb-1">
                        {record.title}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5 text-slate-500 text-[11px] sm:text-xs flex-wrap">
                        <Building2 size={11} className="flex-shrink-0" />
                        <span className="font-medium truncate max-w-[100px] sm:max-w-[150px]">
                            {record.companyName || 'Ẩn danh'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="italic truncate max-w-[80px] sm:max-w-[120px]">
                            {record.employerName}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Phân loại',
            key: 'classification',
            responsive: ['md'],
            width: 180,
            render: (_: any, record: AdminJob) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-slate-600 text-[12px] sm:text-[13px]">
                        <Layers size={12} className="text-violet-500 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{record.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 text-[12px] sm:text-[13px]">
                        <MapPin size={12} className="text-sky-500 flex-shrink-0" />
                        <span className="truncate max-w-[130px]">{record.locationName}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 110,
            align: 'center',
            filters: STATUS_OPTIONS.filter(o => o.value !== -1).map(o => ({ text: o.label, value: o.value })),
            onFilter: (value, record) => record.status === value,
            render: (status: JobStatus) => {
                const tag = getStatusTag(status);
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full
                                   text-[10px] sm:text-xs font-semibold"
                        style={{ color: tag.color, background: tag.bg }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: tag.color }} />
                        {tag.label}
                    </span>
                );
            },
        },
        {
            title: 'Thời gian',
            key: 'time',
            width: 150,
            responsive: ['lg'],
            render: (_: any, record: AdminJob) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[12px]">
                        <Calendar size={11} className="flex-shrink-0" />
                        <span>Tạo: {dayjs(record.createdDate).format('DD/MM/YYYY')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-red-500 text-[12px] font-medium">
                        <Clock size={11} className="flex-shrink-0" />
                        <span>Hạn: {dayjs(record.deadline).format('DD/MM/YYYY')}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Ứng tuyển',
            dataIndex: 'totalApplications',
            key: 'totalApplications',
            width: 90,
            align: 'center',
            responsive: ['sm'],
            render: (totalApps: number) => (
                <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg
                                text-xs font-semibold
                                ${totalApps > 0
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-400 bg-slate-50'}`}
                >
                    <Users size={11} />
                    {totalApps}
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 56,
            align: 'center',
            render: (_: any, record: AdminJob) => {
                const isHidden = record.status === JobStatus.Closed;
                const isDraftOrExpired = record.status === JobStatus.Draft
                    || record.status === JobStatus.Expired;

                return (
                    <Popconfirm
                        title={isHidden ? 'Hoàn tác (Hiện lại)' : 'Ẩn bài viết'}
                        description={
                            <span>
                                Bạn có chắc muốn {isHidden ? 'hoàn tác' : 'ẩn'} bài viết{' '}
                                <strong>{record.title}</strong>?
                            </span>
                        }
                        onConfirm={async () => {
                            const ok = await toggleHideJob(record.id);
                            if (ok) handleSearch();
                        }}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: !isHidden }}
                        disabled={isDraftOrExpired}
                    >
                        <Tooltip title={
                            isDraftOrExpired
                                ? 'Không thể thao tác Nháp/Hết hạn'
                                : (isHidden ? 'Hiện lại' : 'Ẩn bài')
                        }>
                            <Button
                                type="text"
                                danger={!isHidden}
                                icon={isHidden ? <Eye size={15} /> : <EyeOff size={15} />}
                                disabled={isDraftOrExpired}
                                className={`!rounded-lg !w-9 !h-9 !flex !items-center !justify-center
                                            ${isHidden ? 'job-show-btn' : 'job-hide-btn'}`}
                                style={{
                                    color: isDraftOrExpired
                                        ? '#cbd5e1'
                                        : isHidden ? '#10b981' : '#ef4444',
                                }}
                            />
                        </Tooltip>
                    </Popconfirm>
                );
            },
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight m-0">
                        Quản lý Tin tuyển dụng
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Danh sách tất cả Job đăng tải trên hệ thống
                    </p>
                </div>
                <Tooltip title="Làm mới danh sách">
                    <Button
                        icon={<RefreshCw size={15} />}
                        onClick={handleSearch}
                        loading={loading}
                        size="middle"
                        className="!rounded-xl !h-10 sm:!h-[42px] !font-medium !border-slate-200 flex items-center gap-1.5"
                    >
                        <span className="hidden sm:inline">Làm mới</span>
                    </Button>
                </Tooltip>
            </div>

            {/* ── Stat Cards: sm=2 cột, md=4 cột ─────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <StatCard icon={Briefcase} value={jobs.length} label="Tổng tin TD" gradient="linear-gradient(135deg,#3b82f6,#2563eb)" />
                <StatCard icon={RefreshCw} value={countActive} label="Đang HĐ" gradient="linear-gradient(135deg,#10b981,#059669)" />
                <StatCard icon={Users} value={countClosed} label="Đã đóng" gradient="linear-gradient(135deg,#ef4444,#dc2626)" />
                <StatCard icon={Layers} value={countDraft} label="Bản nháp" gradient="linear-gradient(135deg,#64748b,#475569)" />
            </div>

            {/* ── Filter + Table ─────────────────────────────────────────────── */}
            <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>

                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2
                                px-3 py-3 sm:px-5 sm:py-4 md:px-6
                                border-b border-slate-100 bg-slate-50/60 flex-wrap">
                    {/* Search input */}
                    <Input
                        placeholder="Tìm tiêu đề, công ty..."
                        prefix={<Search size={14} color="#94a3b8" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        size="middle"
                        className="!rounded-xl !h-10 !border-slate-200 w-full sm:!max-w-[260px]"
                    />

                    {/* Status select */}
                    <Select
                        value={statusId}
                        onChange={(v) => setStatusId(v)}
                        options={STATUS_OPTIONS}
                        size="middle"
                        className="w-full sm:!w-40 md:!w-44"
                        popupMatchSelectWidth={false}
                    />

                    {/* Search button */}
                    <Button
                        type="primary"
                        icon={<Search size={14} />}
                        onClick={handleSearch}
                        loading={loading}
                        size="middle"
                        className="!rounded-xl !h-10 !font-semibold !border-0 flex items-center gap-1.5 sm:flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                            boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
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
                    scroll={{ x: 500 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} tin tuyển dụng`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Briefcase size={40} color="#cbd5e1" className="mx-auto mb-3" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    Không tìm thấy tin tuyển dụng nào
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Custom CSS */}
            <style>{`
                .job-show-btn:hover:not(:disabled) { background: #ecfdf5 !important; transform: scale(1.05); }
                .job-hide-btn:hover:not(:disabled)  { background: #fef2f2 !important; transform: scale(1.05); }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important; font-weight: 600 !important; color: #475569 !important;
                    font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important; padding: 12px 14px !important;
                }
                .ant-table-tbody > tr > td { padding: 12px 14px !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
                .ant-table-tbody > tr { transition: all 0.15s ease; }
                .ant-select-selector { border-radius: 12px !important; border: 1px solid #e2e8f0 !important; }
            `}</style>
        </div>
    );
};

export default JobManagement;
