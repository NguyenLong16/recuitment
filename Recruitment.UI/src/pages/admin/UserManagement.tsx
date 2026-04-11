import { useEffect, useState } from 'react';
import { Table, Button, Tag, Input, Card, Tooltip, Avatar, Select, Popconfirm } from 'antd';
import { RefreshCw, Search, Users, User, Building2, Mail, Phone, Calendar, Lock, Unlock } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { AdminUser } from '../../types/adminUser';
import useAdminUser from '../../hooks/useAdminUser';
import dayjs from 'dayjs';

// Map roleId cho API filter
const ROLE_OPTIONS = [
    { label: 'Tất cả', value: 0 },
    { label: 'Admin', value: 1 },
    { label: 'Employer (HR)', value: 2 },
    { label: 'Candidate', value: 3 },
];

// Map roleName → tag color + label
const getRoleTag = (roleName: string) => {
    switch (roleName) {
        case 'Admin':
            return { color: '#f43f5e', bg: '#fff1f2', label: 'Admin' };
        case 'Employer':
            return { color: '#f59e0b', bg: '#fffbeb', label: 'Employer' };
        case 'Candidate':
            return { color: '#3b82f6', bg: '#eff6ff', label: 'Candidate' };
        default:
            return { color: '#64748b', bg: '#f1f5f9', label: roleName };
    }
};

const UserManagement = () => {
    const { users, loading, fetchUsers, toggleStatus } = useAdminUser();

    const [keyword, setKeyword] = useState('');
    const [roleId, setRoleId] = useState<number>(0);

    // Fetch khi mount và khi filter thay đổi
    useEffect(() => {
        const filter: any = {};
        if (keyword.trim()) filter.keyword = keyword.trim();
        if (roleId > 0) filter.roleId = roleId;
        fetchUsers(Object.keys(filter).length > 0 ? filter : undefined);
    }, [roleId]); // Chỉ auto-fetch khi roleId thay đổi

    // Tìm kiếm khi nhấn Enter hoặc click nút
    const handleSearch = () => {
        const filter: any = {};
        if (keyword.trim()) filter.keyword = keyword.trim();
        if (roleId > 0) filter.roleId = roleId;
        fetchUsers(Object.keys(filter).length > 0 ? filter : undefined);
    };

    // Đếm theo role
    const countByRole = (role: string) => users.filter(u => u.roleName === role).length;

    // Cấu hình cột cho Table
    const columns: ColumnsType<AdminUser> = [
        {
            title: 'STT',
            key: 'stt',
            width: 70,
            align: 'center',
            render: (_: any, __: AdminUser, index: number) => (
                <span style={{ fontWeight: 600, color: '#6366f1' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Người dùng',
            key: 'user',
            width: 280,
            render: (_: any, record: AdminUser) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={42}
                        src={record.avatarUrl}
                        icon={<User size={20} />}
                        style={{
                            flexShrink: 0,
                            background: record.avatarUrl ? 'transparent' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        }}
                    />
                    <div style={{ minWidth: 0 }}>
                        <div style={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {record.fullName}
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            color: '#94a3b8',
                            fontSize: 13,
                        }}>
                            <Mail size={12} />
                            <span style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                                {record.email}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 150,
            render: (phone: string | null) => (
                phone ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
                        <Phone size={14} color="#94a3b8" />
                        {phone}
                    </div>
                ) : (
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                )
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 130,
            align: 'center',
            render: (roleName: string) => {
                const roleInfo = getRoleTag(roleName);
                return (
                    <Tag
                        style={{
                            color: roleInfo.color,
                            background: roleInfo.bg,
                            border: 'none',
                            borderRadius: 8,
                            padding: '4px 12px',
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    >
                        {roleInfo.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Công ty',
            dataIndex: 'companyName',
            key: 'companyName',
            width: 180,
            render: (companyName: string | null) => (
                companyName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
                        <Building2 size={14} color="#94a3b8" />
                        <span style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {companyName}
                        </span>
                    </div>
                ) : (
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                )
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 150,
            render: (date: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 13 }}>
                    <Calendar size={14} color="#94a3b8" />
                    {dayjs(date).format('DD/MM/YYYY')}
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 120,
            align: 'center',
            render: (isActive: boolean) => {
                // Đảo ngược logic theo backend: isActive === false -> Hoạt động, isActive === true -> Khoá
                const isUserActive = !isActive;
                return (
                    <Tag
                        style={{
                            color: isUserActive ? '#10b981' : '#ef4444',
                            background: isUserActive ? '#ecfdf5' : '#fef2f2',
                            border: 'none',
                            borderRadius: 20,
                            padding: '3px 12px',
                            fontWeight: 600,
                            fontSize: 12,
                        }}
                    >
                        <span style={{
                            display: 'inline-block',
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: isUserActive ? '#10b981' : '#ef4444',
                            marginRight: 6,
                        }} />
                        {isUserActive ? 'Hoạt động' : 'Đã khoá'}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_: any, record: AdminUser) => {
                // Đảo logic như trên
                const isUserActive = !record.isActive;
                // Không cho phép Admin tự khoá mình (nếu cần, nhưng demo có thể cho)
                const isAdmin = record.roleName === 'Admin';

                return (
                    <Popconfirm
                        title={isUserActive ? "Khoá tài khoản" : "Mở khoá tài khoản"}
                        description={
                            <span>
                                Bạn có chắc muốn {isUserActive ? "khoá" : "mở khoá"} tài khoản <strong>{record.email}</strong>?
                            </span>
                        }
                        onConfirm={async () => {
                            const success = await toggleStatus(record.id);
                            if (success) {
                                handleSearch(); // Refresh lại danh sách
                            }
                        }}
                        okText="Đồng ý"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: isUserActive }}
                        disabled={isAdmin}
                    >
                        <Tooltip title={isAdmin ? "Không thể khoá Admin" : (isUserActive ? "Khoá tài khoản" : "Mở khoá tài khoản")}>
                            <Button
                                type="text"
                                danger={isUserActive}
                                icon={isUserActive ? <Lock size={17} /> : <Unlock size={17} />}
                                disabled={isAdmin}
                                style={{
                                    borderRadius: 10,
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    color: isAdmin ? '#cbd5e1' : (isUserActive ? '#ef4444' : '#10b981')
                                }}
                                className={isUserActive ? "delete-action-btn" : "edit-action-btn"}
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
                        Quản lý Người dùng
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        margin: '6px 0 0 0',
                        fontSize: 15,
                    }}>
                        Danh sách tất cả tài khoản trong hệ thống
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
                {/* Tổng users */}
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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Users size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {users.length}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Tổng người dùng</div>
                        </div>
                    </div>
                </Card>

                {/* Admin */}
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
                            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <User size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countByRole('Admin')}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Admin</div>
                        </div>
                    </div>
                </Card>

                {/* Employer */}
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
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Building2 size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countByRole('Employer')}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Employer</div>
                        </div>
                    </div>
                </Card>

                {/* Candidate */}
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
                            <User size={22} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                                {countByRole('Candidate')}
                            </div>
                            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Candidate</div>
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
                        placeholder="Tìm theo tên, email, công ty..."
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
                        value={roleId}
                        onChange={(value) => setRoleId(value)}
                        options={ROLE_OPTIONS}
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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
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
                    scroll={{ x: 1100 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} người dùng`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{
                                padding: '48px 0',
                                textAlign: 'center',
                            }}>
                                <Users size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: 15,
                                    margin: 0,
                                }}>
                                    Không tìm thấy người dùng nào
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
            `}</style>
        </div>
    );
};

export default UserManagement;