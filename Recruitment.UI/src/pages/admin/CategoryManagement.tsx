import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Modal, Form } from 'antd';
import { Trash2, RefreshCw, Search, Layers, Plus, Pencil } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { Category } from '../../types/category';
import useCategory from '../../hooks/useCategory';

const CategoryManagement = () => {
    const {
        categories, loading, deletingId, submitting,
        refetch, createCategory, updateCategory, deleteCategory,
    } = useCategory();

    const [searchText, setSearchText]           = useState('');
    const [isModalOpen, setIsModalOpen]         = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [form]                                = Form.useForm();

    const handleOpenAddModal = () => {
        setEditingCategory(null); form.resetFields(); setIsModalOpen(true);
    };
    const handleOpenEditModal = (cat: Category) => {
        setEditingCategory(cat); form.setFieldsValue({ name: cat.name }); setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); setEditingCategory(null); form.resetFields();
    };
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const success = editingCategory
                ? await updateCategory(editingCategory.id, { name: values.name })
                : await createCategory({ name: values.name });
            if (success) handleCloseModal();
        } catch (error: any) {
            if (error?.errorFields) return;
        }
    };

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<Category> = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            responsive: ['md'],               // ẩn trên sm
            render: (_: any, __: Category, i: number) => (
                <span className="font-semibold text-indigo-500">{i + 1}</span>
            ),
        },
        {
            title: 'Tên ngành nghề',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Icon box — nhỏ hơn trên sm */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0
                                    flex items-center justify-center
                                    bg-gradient-to-br from-indigo-500 to-purple-500">
                        <Layers size={15} color="#fff" className="sm:w-4 sm:h-4" />
                    </div>
                    <Tag
                        color="purple"
                        className="!text-xs sm:!text-sm !font-medium !rounded-lg !border-0
                                   !px-2 sm:!px-3.5 !py-0.5 sm:!py-1"
                    >
                        {name}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_: any, record: Category) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<Pencil size={15} />}
                            onClick={() => handleOpenEditModal(record)}
                            className="edit-action-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center !text-indigo-500"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xoá ngành nghề"
                        description={
                            <span>
                                Bạn có chắc muốn xoá <strong>{record.name}</strong>?
                                <br />Hành động này không thể hoàn tác.
                            </span>
                        }
                        onConfirm={() => deleteCategory(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    >
                        <Tooltip title="Xoá ngành nghề">
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={15} />}
                                loading={deletingId === record.id}
                                className="delete-action-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800
                                   tracking-tight leading-tight m-0">
                        Quản lý Ngành nghề
                    </h1>
                    {/* Subtitle: ẩn trên sm để tiết kiệm chỗ */}
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Quản lý các ngành nghề tuyển dụng trong hệ thống
                    </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
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
                    <Button
                        type="primary"
                        icon={<Plus size={16} />}
                        onClick={handleOpenAddModal}
                        size="middle"
                        className="!rounded-xl !h-10 sm:!h-[42px] !font-semibold !border-0 flex items-center gap-1.5"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        }}
                    >
                        <span className="hidden sm:inline">Thêm ngành nghề</span>
                        <span className="sm:hidden">Thêm</span>
                    </Button>
                </div>
            </div>

            {/* ── Stat Card ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card
                    className="!rounded-2xl !border-0 !shadow-sm col-span-1"
                    styles={{ body: { padding: '16px 20px' } }}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0
                                        flex items-center justify-center
                                        bg-gradient-to-br from-indigo-500 to-purple-500">
                            <Layers size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                                {categories.length}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                                Tổng ngành nghề
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ── Search + Table Card ────────────────────────────────────────── */}
            <Card
                className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden"
                styles={{ body: { padding: 0 } }}
            >
                {/* Search bar */}
                <div className="px-3 py-3 sm:px-5 sm:py-4 md:px-6 border-b border-slate-100 bg-slate-50/60">
                    <Input
                        placeholder="Tìm kiếm ngành nghề..."
                        prefix={<Search size={15} color="#94a3b8" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        size="middle"
                        className="!rounded-xl !max-w-xs sm:!max-w-sm !h-10 !border-slate-200"
                    />
                </div>

                {/* Table — scroll ngang trên sm */}
                <Table
                    columns={columns}
                    dataSource={filteredCategories}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 360 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} ngành nghề`,
                        style: { padding: '12px 16px', margin: 0 },
                        simple: false,
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Layers size={40} color="#cbd5e1" className="mx-auto mb-3 sm:w-12 sm:h-12" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    {searchText
                                        ? 'Không tìm thấy ngành nghề phù hợp'
                                        : 'Chưa có ngành nghề nào'}
                                </p>
                            </div>
                        ),
                    }}
                />
            </Card>

            {/* ── Modal Thêm / Sửa ──────────────────────────────────────────── */}
            <Modal
                title={
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                            style={{
                                background: editingCategory
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            }}
                        >
                            {editingCategory ? <Pencil size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
                        </div>
                        <div>
                            <div className="text-sm sm:text-base font-semibold text-slate-800 leading-tight">
                                {editingCategory ? 'Chỉnh sửa ngành nghề' : 'Thêm ngành nghề mới'}
                            </div>
                            <div className="text-xs text-slate-400 font-normal leading-tight">
                                {editingCategory
                                    ? `Đang chỉnh sửa: ${editingCategory.name}`
                                    : 'Nhập tên ngành nghề mới để thêm vào hệ thống'}
                            </div>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
                centered
                /* sm: full width gần như; md+: 480px */
                width="min(480px, calc(100vw - 32px))"
                styles={{
                    header: { padding: '20px 20px 14px', borderBottom: '1px solid #f1f5f9' },
                    body:   { padding: '20px' },
                }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-sm">Tên ngành nghề</span>}
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên ngành nghề!' },
                            { min: 2,         message: 'Tên ngành nghề phải có ít nhất 2 ký tự!' },
                            { max: 100,       message: 'Tên ngành nghề không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: Frontend Developer, Data Analyst..."
                            size="large"
                            prefix={<Layers size={15} color="#94a3b8" />}
                            className="!rounded-xl !h-11 !border-slate-200"
                        />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-2">
                        <Button
                            onClick={handleCloseModal}
                            className="!rounded-xl !h-10 !font-medium !border-slate-200 !px-5"
                        >
                            Huỷ
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            className="!rounded-xl !h-10 !font-semibold !border-0 !px-6"
                            style={{
                                background: editingCategory
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                boxShadow: editingCategory
                                    ? '0 4px 14px rgba(245,158,11,0.35)'
                                    : '0 4px 14px rgba(99,102,241,0.35)',
                            }}
                        >
                            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .edit-action-btn:hover   { background: #eef2ff !important; transform: scale(1.05); }
                .delete-action-btn:hover { background: #fef2f2 !important; transform: scale(1.05); }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                    font-size: 12px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important;
                    padding: 12px 14px !important;
                }
                .ant-table-tbody > tr > td { padding: 12px 14px !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
                .ant-modal-content { border-radius: 16px !important; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default CategoryManagement;
