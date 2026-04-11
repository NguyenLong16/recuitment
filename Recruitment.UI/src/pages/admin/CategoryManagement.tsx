import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Modal, Form } from 'antd';
import { Trash2, RefreshCw, Search, Layers, Plus, Pencil } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '../../types/category';
import useCategory from '../../hooks/useCategory';

const CategoryManagement = () => {
    const {
        categories,
        loading,
        deletingId,
        submitting,
        refetch,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useCategory();

    const [searchText, setSearchText] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form] = Form.useForm();

    // Mở modal Thêm mới
    const handleOpenAddModal = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Mở modal Chỉnh sửa
    const handleOpenEditModal = (category: Category) => {
        setEditingCategory(category);
        form.setFieldsValue({ name: category.name });
        setIsModalOpen(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // Submit form (Thêm / Sửa)
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            let success = false;

            if (editingCategory) {
                success = await updateCategory(editingCategory.id, { name: values.name });
            } else {
                success = await createCategory({ name: values.name });
            }

            if (success) {
                handleCloseModal();
            }
        } catch (error: any) {
            // Lỗi validation form, bỏ qua
            if (error?.errorFields) return;
        }
    };

    // Xoá ngành nghề
    const handleDelete = async (id: number) => {
        await deleteCategory(id);
    };

    // Lọc theo tên
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Cấu hình cột cho Table
    const columns: ColumnsType<Category> = [
        {
            title: 'STT',
            key: 'stt',
            width: 80,
            align: 'center',
            render: (_: any, __: Category, index: number) => (
                <span style={{ fontWeight: 600, color: '#6366f1' }}>{index + 1}</span>
            ),
        },
        {
            title: 'Tên ngành nghề',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Layers size={18} color="#fff" />
                    </div>
                    <Tag
                        color="purple"
                        style={{
                            fontSize: 14,
                            padding: '4px 14px',
                            borderRadius: 8,
                            fontWeight: 500,
                            border: 'none',
                        }}
                    >
                        {name}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 140,
            align: 'center',
            render: (_: any, record: Category) => (
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
                                color: '#6366f1',
                                transition: 'all 0.2s ease',
                            }}
                            className="edit-action-btn"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xoá ngành nghề"
                        description={
                            <span>
                                Bạn có chắc muốn xoá <strong>{record.name}</strong>?
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
                        <Tooltip title="Xoá ngành nghề">
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
                        Quản lý Ngành nghề
                    </h1>
                    <p style={{
                        color: '#94a3b8',
                        margin: '6px 0 0 0',
                        fontSize: 15,
                    }}>
                        Quản lý các ngành nghề tuyển dụng trong hệ thống
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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                            paddingInline: 20,
                        }}
                    >
                        Thêm ngành nghề
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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Layers size={24} color="#fff" />
                        </div>
                        <div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: '#1e293b',
                                lineHeight: 1.2,
                            }}>
                                {categories.length}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: '#94a3b8',
                                fontWeight: 500,
                            }}>
                                Tổng ngành nghề
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
                        placeholder="Tìm kiếm ngành nghề..."
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
                    dataSource={filteredCategories}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} ngành nghề`,
                        style: { padding: '16px 24px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div style={{
                                padding: '48px 0',
                                textAlign: 'center',
                            }}>
                                <Layers size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
                                <p style={{
                                    color: '#94a3b8',
                                    fontSize: 15,
                                    margin: 0,
                                }}>
                                    {searchText
                                        ? 'Không tìm thấy ngành nghề phù hợp'
                                        : 'Chưa có ngành nghề nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* Modal Thêm / Sửa ngành nghề */}
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
                            background: editingCategory
                                ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {editingCategory
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
                                {editingCategory ? 'Chỉnh sửa ngành nghề' : 'Thêm ngành nghề mới'}
                            </div>
                            <div style={{
                                fontSize: 13,
                                color: '#94a3b8',
                                fontWeight: 400,
                            }}>
                                {editingCategory
                                    ? `Đang chỉnh sửa: ${editingCategory.name}`
                                    : 'Nhập tên ngành nghề mới để thêm vào hệ thống'
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
                                Tên ngành nghề
                            </span>
                        }
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên ngành nghề!' },
                            { min: 2, message: 'Tên ngành nghề phải có ít nhất 2 ký tự!' },
                            { max: 100, message: 'Tên ngành nghề không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: Frontend Developer, Data Analyst..."
                            size="large"
                            prefix={<Layers size={16} color="#94a3b8" />}
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
                                background: editingCategory
                                    ? 'linear-gradient(135deg, #f59e0b, #f97316)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none',
                                boxShadow: editingCategory
                                    ? '0 4px 14px rgba(245, 158, 11, 0.35)'
                                    : '0 4px 14px rgba(99, 102, 241, 0.35)',
                            }}
                        >
                            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .edit-action-btn:hover {
                    background: #eef2ff !important;
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

export default CategoryManagement;
