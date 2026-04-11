import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Modal, Form } from 'antd';
import { Trash2, RefreshCw, Search, Code, Plus, Pencil } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { Skill } from '../../types/skill';
import useSkill from '../../hooks/useSkill';

const SkillManagement = () => {
    const {
        skills,
        loading,
        deletingId,
        submitting,
        refetch,
        createSkill,
        updateSkill,
        deleteSkill,
    } = useSkill();

    const [searchText, setSearchText] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [form] = Form.useForm();

    // Mở modal Thêm mới
    const handleOpenAddModal = () => {
        setEditingSkill(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Mở modal Chỉnh sửa
    const handleOpenEditModal = (skill: Skill) => {
        setEditingSkill(skill);
        form.setFieldsValue({ skillName: skill.skillName });
        setIsModalOpen(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSkill(null);
        form.resetFields();
    };

    // Submit form (Thêm / Sửa)
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            let success = false;

            if (editingSkill) {
                success = await updateSkill(editingSkill.id, { name: values.skillName });
            } else {
                success = await createSkill({ name: values.skillName });
            }

            if (success) {
                handleCloseModal();
            }
        } catch (error: any) {
            if (error?.errorFields) return;
        }
    };

    // Xoá kỹ năng
    const handleDelete = async (id: number) => {
        await deleteSkill(id);
    };

    // Lọc theo tên
    const filteredSkills = skills.filter((skill) =>
        skill.skillName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Cấu hình cột cho Table
    const columns: ColumnsType<Skill> = [
        {
            title: 'STT',
            key: 'stt',
            width: 80,
            align: 'center',
            render: (_: any, __: Skill, index: number) => (
                <span style={{ fontWeight: 600, color: '#10b981' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Tên kỹ năng',
            dataIndex: 'skillName',
            key: 'skillName',
            render: (skillName: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Code size={18} color="#fff" />
                    </div>
                    <Tag
                        color="green"
                        style={{
                            fontSize: 14,
                            padding: '4px 14px',
                            borderRadius: 8,
                            fontWeight: 500,
                            border: 'none',
                        }}
                    >
                        {skillName}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 140,
            align: 'center',
            render: (_: any, record: Skill) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<Pencil size={17} />}
                            onClick={() => handleOpenEditModal(record)}
                            style={{
                                borderRadius: 10,
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981',
                                transition: 'all 0.2s ease',
                            }}
                            className="edit-action-btn"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xoá kỹ năng"
                        description={
                            <span>
                                Bạn có chắc muốn xoá <strong>{record.skillName}</strong>?
                                <br />
                                Hành động này không thể hoàn tác.
                            </span>
                        }
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{
                            danger: true,
                            loading: deletingId === record.id,
                        }}
                    >
                        <Tooltip title="Xoá kỹ năng">
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
                                className="delete-action-btn"
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
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
                        Quản lý Kỹ năng
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        margin: '6px 0 0 0',
                        fontSize: 15,
                    }}>
                        Quản lý các kỹ năng tuyển dụng trong hệ thống
                    </p>
                </div>

                <Space>
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
                    <Button
                        type="primary"
                        icon={<Plus size={18} />}
                        onClick={handleOpenAddModal}
                        style={{
                            borderRadius: 10,
                            height: 42,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                            paddingInline: 20,
                        }}
                    >
                        Thêm kỹ năng
                    </Button>
                </Space>
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
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Code size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#1e293b',
                                lineHeight: 1.2,
                            }}>
                                {skills.length}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: '#94a3b8',
                                fontWeight: 500,
                            }}>
                                Tổng kỹ năng
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
                }}>
                    <Input
                        placeholder="Tìm kiếm kỹ năng..."
                        prefix={<Search size={16} color="#94a3b8" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{
                            maxWidth: 400,
                            borderRadius: 10,
                            height: 42,
                            border: '1px solid #e2e8f0',
                        }}
                    />
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredSkills}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} kỹ năng`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{
                                padding: '48px 0',
                                textAlign: 'center',
                            }}>
                                <Code size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: 15,
                                    margin: 0,
                                }}>
                                    {searchText
                                        ? 'Không tìm thấy kỹ năng phù hợp'
                                        : 'Chưa có kỹ năng nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Modal Thêm / Sửa kỹ năng */}
            <Modal
                title={
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            background: editingSkill
                                ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                                : 'linear-gradient(135deg, #10b981, #059669)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {editingSkill
                                ? <Pencil size={20} color="#fff" />
                                : <Plus size={20} color="#fff" />
                            }
                        </div>
                        <div>
                            <div style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#1e293b',
                            }}>
                                {editingSkill ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: '#94a3b8',
                                fontWeight: 400,
                            }}>
                                {editingSkill
                                    ? `Đang chỉnh sửa: ${editingSkill.skillName}`
                                    : 'Nhập tên kỹ năng mới để thêm vào hệ thống'
                                }
                            </div>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
                centered
                width={480}
                styles={{
                    header: {
                        padding: '24px 24px 16px',
                        borderBottom: '1px solid #f1f5f9',
                    },
                    body: {
                        padding: '24px',
                    },
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label={
                            <span style={{
                                fontWeight: 600,
                                color: '#374151',
                                fontSize: 14,
                            }}>
                                Tên kỹ năng
                            </span>
                        }
                        name="skillName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên kỹ năng!' },
                            { min: 1, message: 'Tên kỹ năng phải có ít nhất 1 ký tự!' },
                            { max: 100, message: 'Tên kỹ năng không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: ReactJS, Java, C#, SQL Server..."
                            size="large"
                            prefix={<Code size={16} color="#94a3b8" />}
                            style={{
                                borderRadius: 10,
                                height: 46,
                                border: '1px solid #e2e8f0',
                            }}
                        />
                    </Form.Item>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 10,
                        marginTop: 8,
                    }}>
                        <Button
                            onClick={handleCloseModal}
                            style={{
                                borderRadius: 10,
                                height: 42,
                                paddingInline: 20,
                                fontWeight: 500,
                                border: '1px solid #e2e8f0',
                            }}
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            style={{
                                borderRadius: 10,
                                height: 42,
                                paddingInline: 24,
                                fontWeight: 600,
                                background: editingSkill
                                    ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                                    : 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                boxShadow: editingSkill
                                    ? '0 4px 14px rgba(245, 158, 11, 0.35)'
                                    : '0 4px 14px rgba(16, 185, 129, 0.35)',
                            }}
                        >
                            {editingSkill ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .edit-action-btn:hover {
                    background: #ecfdf5 !important;
                    transform: scale(1.05);
                }
                .delete-action-btn:hover {
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
                .ant-modal-content {
                    border-radius: 16px !important;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default SkillManagement;
