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
        if (keyword.trim()) {
            fetchCompanies(keyword.trim());
        } else {
            fetchCompanies();
        }
    }, [fetchCompanies]);

    const handleSearch = () => {
        fetchCompanies(keyword.trim() || undefined);
    };

    const columns: ColumnsType<AdminCompany> = [
        {
            title: 'STT',
            key: 'stt',
            width: 70,
            align: 'center',
            render: (_: any, __: AdminCompany, index: number) => (
                <span style={{ fontWeight: 600, color: '#f59e0b' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Công ty',
            key: 'company',
            width: 280,
            render: (_: any, record: AdminCompany) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={48}
                        shape="square"
                        src={record.logoUrl}
                        icon={<Building2 size={24} />}
                        style={{
                            flexShrink: 0,
                            borderRadius: 12,
                            background: record.logoUrl ? 'transparent' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        }}
                    />
                    <div style={{ minWidth: 0 }}>
                        <div style={{
                            fontWeight: 600,
                            color: '#1e293b',
                            fontSize: 15,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {record.companyName}
                        </div>
                        {record.websiteLink && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                color: '#3b82f6',
                                fontSize: 13,
                                marginTop: 2,
                            }}>
                                <Globe size={12} />
                                <a 
                                    href={record.websiteLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
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
            width: 250,
            render: (address: string | null) => (
                address ? (
                    <div style={{ display: 'flex', gap: 6, color: '#475569', fontSize: 13, alignItems: 'center' }}>
                        <MapPin size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {address}
                        </span>
                    </div>
                ) : (
                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>
                )
            ),
        },
        {
            title: 'Quy mô',
            dataIndex: 'size',
            key: 'size',
            width: 140,
            align: 'center',
            render: (size: number) => (
                <Tag
                    color="orange"
                    style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        fontWeight: 600,
                        border: 'none',
                        background: '#fffbeb',
                        color: '#d97706',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={14} />
                        {size > 0 ? `${size} nhân sự` : 'Chưa cập nhật'}
                    </div>
                </Tag>
            ),
        },
        {
            title: 'Tuyển dụng',
            dataIndex: 'totalJobs',
            key: 'totalJobs',
            width: 130,
            align: 'center',
            render: (totalJobs: number) => (
                <Tooltip title={`${totalJobs} tin tuyển dụng đang mở`}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 6, 
                        color: totalJobs > 0 ? '#10b981' : '#94a3b8',
                        fontWeight: 600,
                        background: totalJobs > 0 ? '#ecfdf5' : '#f1f5f9',
                        padding: '4px 12px',
                        borderRadius: 8,
                    }}>
                        <Briefcase size={14} />
                        {totalJobs} job
                    </div>
                </Tooltip>
            ),
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
                        Quản lý Công ty
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        margin: '6px 0 0 0',
                        fontSize: 15,
                    }}>
                        Danh sách các công ty/doanh nghiệp trên hệ thống
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                marginBottom: 24,
            }}>
                <Card
                    style={{
                        borderRadius: 16,
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                    styles={{ body: { padding: '20px 24px' } }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Building2 size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#1e293b',
                                lineHeight: 1.2,
                            }}>
                                {companies.length}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: '#94a3b8',
                                fontWeight: 500,
                            }}>
                                Tổng công ty
                            </div>
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
                {/* Search bar */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fafbfc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}>
                    <Input
                        placeholder="Tìm kiếm công ty..."
                        prefix={<Search size={16} color="#94a3b8" />}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                        style={{
                            maxWidth: 400,
                            borderRadius: 10,
                            height: 42,
                            border: '1px solid #e2e8f0',
                        }}
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
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={companies}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 900 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} công ty`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{
                                padding: '48px 0',
                                textAlign: 'center',
                            }}>
                                <Building2 size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: 15,
                                    margin: 0,
                                }}>
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

export default CompanyManagement;
