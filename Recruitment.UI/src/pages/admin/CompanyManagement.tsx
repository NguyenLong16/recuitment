import { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Card, Tooltip, Avatar } from 'antd';
import { RefreshCw, Search, Building2, Globe, MapPin, Users, Briefcase } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminCompany } from '../../types/adminCompany';
import useAdminCompany from '../../hooks/useAdminCompany';

const CompanyManagement = () => {
    const { companies, loading, fetchCompanies } = useAdminCompany();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetchCompanies(keyword.trim() || undefined);
    }, [fetchCompanies]);

    const handleSearch = () => fetchCompanies(keyword.trim() || undefined);

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<AdminCompany> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: AdminCompany, i: number) => (
                <span className="font-semibold text-amber-500">{i + 1}</span>
            ),
        },
        {
            title: 'Công ty',
            key: 'company',
            render: (_: any, record: AdminCompany) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Logo — nhỏ hơn trên sm */}
                    <Avatar
                        size={36}
                        shape="square"
                        src={record.logoUrl}
                        icon={<Building2 size={18} />}
                        className="flex-shrink-0 !rounded-xl sm:!w-12 sm:!h-12"
                        style={{
                            background: record.logoUrl
                                ? 'transparent'
                                : 'linear-gradient(135deg,#f59e0b,#d97706)',
                        }}
                    />
                    <div className="min-w-0">
                        <div className="font-semibold text-slate-800 text-xs sm:text-sm md:text-[15px] truncate max-w-[120px] sm:max-w-[180px] md:max-w-none">
                            {record.companyName}
                        </div>
                        {record.websiteLink && (
                            <div className="hidden sm:flex items-center gap-1 text-blue-500 text-xs mt-0.5">
                                <Globe size={11} className="flex-shrink-0" />
                                <a
                                    href={record.websiteLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate max-w-[120px] md:max-w-[180px] hover:underline"
                                    style={{ color: 'inherit' }}
                                >
                                    {record.websiteLink.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            responsive: ['md'],          // ẩn trên sm
            render: (address: string | null) =>
                address ? (
                    <div className="flex items-start gap-1.5 text-slate-600 text-[13px]">
                        <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{address}</span>
                    </div>
                ) : (
                    <span className="text-slate-300 text-[13px]">—</span>
                ),
        },
        {
            title: 'Quy mô',
            dataIndex: 'size',
            key: 'size',
            width: 130,
            align: 'center',
            responsive: ['sm'],          // ẩn hoàn toàn trên xs (< 576px)
            render: (size: number) => (
                <Tag
                    className="!rounded-lg !font-semibold !border-0 !px-2.5 !py-1
                               !inline-flex !items-center !gap-1.5
                               !bg-amber-50 !text-amber-700 !text-xs"
                >
                    <Users size={12} />
                    {size > 0 ? `${size} nhân sự` : 'Chưa cập nhật'}
                </Tag>
            ),
        },
        {
            title: 'Tuyển dụng',
            dataIndex: 'totalJobs',
            key: 'totalJobs',
            width: 110,
            align: 'center',
            render: (totalJobs: number) => (
                <Tooltip title={`${totalJobs} tin tuyển dụng đang mở`}>
                    <div
                        className={`inline-flex items-center gap-1 sm:gap-1.5 font-semibold
                                    px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-[13px]
                                    ${totalJobs > 0
                                        ? 'text-emerald-600 bg-emerald-50'
                                        : 'text-slate-400 bg-slate-50'}`}
                    >
                        <Briefcase size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        {totalJobs} job
                    </div>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">

            {/* ── Page Header ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 tracking-tight m-0">
                        Quản lý Công ty
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Danh sách các công ty / doanh nghiệp trên hệ thống
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

            {/* ── Stat Card ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="!rounded-2xl !border-0 !shadow-sm" styles={{ body: { padding: '16px 20px' } }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0
                                        flex items-center justify-center
                                        bg-gradient-to-br from-amber-400 to-amber-600">
                            <Building2 size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                                {companies.length}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                                Tổng công ty
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stat: công ty có tuyển dụng */}
                <Card className="!rounded-2xl !border-0 !shadow-sm" styles={{ body: { padding: '16px 20px' } }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0
                                        flex items-center justify-center
                                        bg-gradient-to-br from-emerald-400 to-emerald-600">
                            <Briefcase size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                                {companies.filter(c => c.totalJobs > 0).length}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                                Đang tuyển dụng
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── Search + Table ─────────────────────────────────────────────── */}
            <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>

                {/* Search bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2
                                px-3 py-3 sm:px-5 sm:py-4 md:px-6
                                border-b border-slate-100 bg-slate-50/60">
                    <Input
                        placeholder="Tìm kiếm công ty..."
                        prefix={<Search size={15} color="#94a3b8" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        size="middle"
                        className="!rounded-xl !h-10 !border-slate-200 w-full sm:!max-w-xs md:!max-w-sm"
                    />
                    <Button
                        type="primary"
                        icon={<Search size={14} />}
                        onClick={handleSearch}
                        loading={loading}
                        size="middle"
                        className="!rounded-xl !h-10 !font-semibold !border-0 flex items-center gap-1.5 sm:flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>

                {/* Table — scroll ngang trên sm/md */}
                <Table
                    columns={columns}
                    dataSource={companies}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 480 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} công ty`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Building2 size={40} color="#cbd5e1" className="mx-auto mb-3 sm:w-12 sm:h-12" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    {keyword
                                        ? 'Không tìm thấy công ty phù hợp'
                                        : 'Chưa có công ty nào trên hệ thống'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Custom CSS */}
            <style>{`
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

export default CompanyManagement;
