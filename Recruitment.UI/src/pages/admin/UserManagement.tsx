import { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Card, Tooltip, Avatar, Select, Popconfirm } from 'antd';
import { RefreshCw, Search, Users, User, Building2, Mail, Phone, Calendar, Lock, Unlock } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminUser } from '../../types/adminUser';
import useAdminUser from '../../hooks/useAdminUser';
import dayjs from 'dayjs';

const ROLE_OPTIONS = [
    { label: 'Tất cả',        value: 0 },
    { label: 'Admin',         value: 1 },
    { label: 'Employer (HR)', value: 2 },
    { label: 'Candidate',     value: 3 },
];

const getRoleTag = (roleName: string) => {
    switch (roleName) {
        case 'Admin':     return { color: '#f43f5e', bg: '#fff1f2', label: 'Admin' };
        case 'Employer':  return { color: '#f59e0b', bg: '#fffbeb', label: 'Employer' };
        case 'Candidate': return { color: '#3b82f6', bg: '#eff6ff', label: 'Candidate' };
        default:          return { color: '#64748b', bg: '#f1f5f9', label: roleName };
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

const UserManagement = () => {
    const { users, loading, fetchUsers, toggleStatus } = useAdminUser();
    const [keyword, setKeyword] = useState('');
    const [roleId, setRoleId]   = useState<number>(0);

    useEffect(() => {
        const filter: any = {};
        if (keyword.trim()) filter.keyword = keyword.trim();
        if (roleId > 0)    filter.roleId = roleId;
        fetchUsers(Object.keys(filter).length > 0 ? filter : undefined);
    }, [roleId]);

    const handleSearch = () => {
        const filter: any = {};
        if (keyword.trim()) filter.keyword = keyword.trim();
        if (roleId > 0)    filter.roleId = roleId;
        fetchUsers(Object.keys(filter).length > 0 ? filter : undefined);
    };

    const countByRole = (role: string) => users.filter(u => u.roleName === role).length;

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<AdminUser> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: AdminUser, index: number) => (
                <span className="font-semibold text-indigo-500">{index + 1}</span>
            ),
        },
        {
            title: 'Người dùng',
            key: 'user',
            render: (_: any, record: AdminUser) => (
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <Avatar
                        size={{ xs: 36, sm: 40, lg: 42 }}
                        src={record.avatarUrl}
                        icon={<User size={18} />}
                        className="flex-shrink-0"
                        style={{ background: record.avatarUrl ? 'transparent' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    />
                    <div className="min-w-0">
                        <div className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[180px]">
                            {record.fullName}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs">
                            <Mail size={11} className="flex-shrink-0" />
                            <span className="truncate max-w-[120px] sm:max-w-[180px]">{record.email}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 140,
            responsive: ['lg'],
            render: (phone: string | null) => (
                phone ? (
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-[13px]">
                        <Phone size={12} className="text-slate-400 flex-shrink-0" />
                        {phone}
                    </div>
                ) : <span className="text-slate-300 text-xs sm:text-[13px]">—</span>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 110,
            align: 'center',
            render: (roleName: string) => {
                const info = getRoleTag(roleName);
                return (
                    <Tag
                        className="!m-0 !px-2 sm:!px-3 !py-0.5 sm:!py-1 !rounded-lg !text-[10px] sm:!text-xs !font-semibold !border-0"
                        style={{ color: info.color, background: info.bg }}
                    >
                        {info.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 160,
            responsive: ['md'],
            render: (companyName: string | null) => (
                companyName ? (
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs sm:text-[13px]">
                        <Building2 size={12} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px] sm:max-w-[140px]">{companyName}</span>
                    </div>
                ) : <span className="text-slate-300 text-xs sm:text-[13px]">—</span>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 120,
            responsive: ['lg'],
            render: (date: string) => (
                <div className="flex items-center gap-1.5 text-slate-600 text-[12px]">
                    <Calendar size={12} className="text-slate-400 flex-shrink-0" />
                    {dayjs(date).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 110,
            align: 'center',
            render: (isActive: boolean) => {
                const isUserActive = !isActive;
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full
                                   text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                        style={{
                            color: isUserActive ? '#10b981' : '#ef4444',
                            background: isUserActive ? '#ecfdf5' : '#fef2f2',
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{ background: isUserActive ? '#10b981' : '#ef4444' }} />
                        {isUserActive ? 'Hoạt động' : 'Đã khoá'}
                    </span>
                );
            },
        },
        {
            title: '',
            key: 'action',
            width: 56,
            align: 'center',
            render: (_: any, record: AdminUser) => {
                const isUserActive = !record.isActive;
                const isAdmin      = record.roleName === 'Admin';

                return (
                    <Popconfirm
                        title={isUserActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}
                        description={
                            <span>
                                Bạn có chắc muốn {isUserActive ? 'khoá' : 'mở khoá'} tài khoản <strong>{record.email}</strong>?
                            </span>
                        }
                        onConfirm={async () => {
                            const ok = await toggleStatus(record.id);
                            if (ok) handleSearch();
                        }}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: isUserActive }}
                        disabled={isAdmin}
                    >
                        <Tooltip title={
                            isAdmin ? 'Không thể khoá Admin'
                                : (isUserActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản')
                        }>
                            <Button
                                type="text"
                                danger={isUserActive}
                                icon={isUserActive ? <Lock size={15} /> : <Unlock size={15} />}
                                disabled={isAdmin}
                                className={`!rounded-lg !w-9 !h-9 !flex !items-center !justify-center
                                            ${isUserActive ? 'user-lock-btn' : 'user-unlock-btn'}`}
                                style={{
                                    color: isAdmin ? '#cbd5e1' : (isUserActive ? '#ef4444' : '#10b981'),
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
                        Quản lý Người dùng
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Danh sách tất cả tài khoản trong hệ thống
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

            {/* ── Stat Cards ────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <StatCard
                    icon={Users} value={users.length} label="Tổng người dùng"
                    gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
                />
                <StatCard
                    icon={User} value={countByRole('Admin')} label="Admin"
                    gradient="linear-gradient(135deg,#f43f5e,#e11d48)"
                />
                <StatCard
                    icon={Building2} value={countByRole('Employer')} label="Employer"
                    gradient="linear-gradient(135deg,#f59e0b,#d97706)"
                />
                <StatCard
                    icon={User} value={countByRole('Candidate')} label="Candidate"
                    gradient="linear-gradient(135deg,#3b82f6,#2563eb)"
                />
            </div>

            {/* ── Filter + Table ─────────────────────────────────────────────── */}
            <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>

                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-3 sm:px-5 sm:py-4 md:px-6
                                border-b border-slate-100 bg-slate-50/60 w-full flex-wrap">
                    <Input
                        placeholder="Tìm tên, email..."
                        prefix={<Search size={14} color="#94a3b8" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        size="middle"
                        className="!rounded-xl !h-10 !border-slate-200 w-full sm:!max-w-[240px] md:!max-w-[280px]"
                    />
                    <Select
                        value={roleId}
                        onChange={(v) => setRoleId(v)}
                        options={ROLE_OPTIONS}
                        size="middle"
                        className="w-full sm:!w-40 md:!w-44"
                        popupMatchSelectWidth={false}
                    />
                    <Button
                        type="primary"
                        icon={<Search size={14} />}
                        onClick={handleSearch}
                        loading={loading}
                        size="middle"
                        className="!rounded-xl !h-10 !font-semibold !border-0 flex items-center gap-1.5 sm:flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 600 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} người dùng`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Users size={40} color="#cbd5e1" className="mx-auto mb-3" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    Không tìm thấy người dùng nào
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Custom CSS */}
            <style>{`
                .user-unlock-btn:hover:not(:disabled) { background: #ecfdf5 !important; transform: scale(1.05); }
                .user-lock-btn:hover:not(:disabled)   { background: #fef2f2 !important; transform: scale(1.05); }
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

export default UserManagement;