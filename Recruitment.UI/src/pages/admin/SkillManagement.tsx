import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Modal, Form } from 'antd';
import { Trash2, RefreshCw, Search, Code, Plus, Pencil } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { Skill } from '../../types/skill';
import useSkill from '../../hooks/useSkill';

const SkillManagement = () => {
    const {
        skills, loading, deletingId, submitting,
        refetch, createSkill, updateSkill, deleteSkill,
    } = useSkill();

    const [searchText, setSearchText]       = useState('');
    const [isModalOpen, setIsModalOpen]     = useState(false);
    const [editingSkill, setEditingSkill]   = useState<Skill | null>(null);
    const [form]                            = Form.useForm();

    const handleOpenAddModal = () => {
        setEditingSkill(null); form.resetFields(); setIsModalOpen(true);
    };
    const handleOpenEditModal = (skill: Skill) => {
        setEditingSkill(skill); form.setFieldsValue({ skillName: skill.skillName }); setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); setEditingSkill(null); form.resetFields();
    };
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const success = editingSkill
                ? await updateSkill(editingSkill.id, { name: values.skillName })
                : await createSkill({ name: values.skillName });
            if (success) handleCloseModal();
        } catch (error: any) {
            if (error?.errorFields) return;
        }
    };

    const filteredSkills = skills.filter((skill) =>
        skill.skillName.toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<Skill> = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: Skill, i: number) => (
                <span className="font-semibold text-emerald-500">{i + 1}</span>
            ),
        },
        {
            title: 'Tên kỹ năng',
            dataIndex: 'skillName',
            key: 'skillName',
            render: (skillName: string) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0
                                    flex items-center justify-center
                                    bg-gradient-to-br from-emerald-400 to-emerald-600">
                        <Code size={15} color="#fff" className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <Tag
                        color="green"
                        className="!text-xs sm:!text-sm !font-medium !rounded-lg !border-0
                                   !px-2 sm:!px-3.5 !py-0.5 sm:!py-1"
                    >
                        {skillName}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_: any, record: Skill) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<Pencil size={15} />}
                            onClick={() => handleOpenEditModal(record)}
                            className="skill-edit-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center !text-emerald-500"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xoá kỹ năng"
                        description={
                            <span>
                                Bạn có chắc muốn xoá <strong>{record.skillName}</strong>?
                                <br />Hành động này không thể hoàn tác.
                            </span>
                        }
                        onConfirm={() => deleteSkill(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    >
                        <Tooltip title="Xoá kỹ năng">
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={15} />}
                                loading={deletingId === record.id}
                                className="skill-delete-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center"
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
                        Quản lý Kỹ năng
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Quản lý các kỹ năng tuyển dụng trong hệ thống
                    </p>
                </div>

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
                            background: 'linear-gradient(135deg,#10b981,#059669)',
                            boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                        }}
                    >
                        <span className="hidden sm:inline">Thêm kỹ năng</span>
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
                                        bg-gradient-to-br from-emerald-400 to-emerald-600">
                            <Code size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                                {skills.length}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                                Tổng kỹ năng
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
                        placeholder="Tìm kiếm kỹ năng..."
                        prefix={<Search size={15} color="#94a3b8" />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        size="middle"
                        className="!rounded-xl !max-w-xs sm:!max-w-sm !h-10 !border-slate-200"
                    />
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredSkills}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 360 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} kỹ năng`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <Code size={40} color="#cbd5e1" className="mx-auto mb-3 sm:w-12 sm:h-12" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    {searchText ? 'Không tìm thấy kỹ năng phù hợp' : 'Chưa có kỹ năng nào'}
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
                                background: editingSkill
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#10b981,#059669)',
                            }}
                        >
                            {editingSkill
                                ? <Pencil size={18} color="#fff" />
                                : <Plus size={18} color="#fff" />}
                        </div>
                        <div>
                            <div className="text-sm sm:text-base font-semibold text-slate-800 leading-tight">
                                {editingSkill ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng mới'}
                            </div>
                            <div className="text-xs text-slate-400 font-normal">
                                {editingSkill
                                    ? `Đang chỉnh sửa: ${editingSkill.skillName}`
                                    : 'Nhập tên kỹ năng mới để thêm vào hệ thống'}
                            </div>
                        </div>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                destroyOnClose
                centered
                width="min(480px, calc(100vw - 32px))"
                styles={{
                    header: { padding: '20px 20px 14px', borderBottom: '1px solid #f1f5f9' },
                    body:   { padding: '20px' },
                }}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <Form.Item
                        label={<span className="font-semibold text-gray-700 text-sm">Tên kỹ năng</span>}
                        name="skillName"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên kỹ năng!' },
                            { min: 1,         message: 'Tên kỹ năng phải có ít nhất 1 ký tự!' },
                            { max: 100,       message: 'Tên kỹ năng không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: ReactJS, Java, C#, SQL Server..."
                            size="large"
                            prefix={<Code size={15} color="#94a3b8" />}
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
                                background: editingSkill
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#10b981,#059669)',
                                boxShadow: editingSkill
                                    ? '0 4px 14px rgba(245,158,11,0.35)'
                                    : '0 4px 14px rgba(16,185,129,0.35)',
                            }}
                        >
                            {editingSkill ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .skill-edit-btn:hover   { background: #ecfdf5 !important; transform: scale(1.05); }
                .skill-delete-btn:hover { background: #fef2f2 !important; transform: scale(1.05); }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important; font-weight: 600 !important; color: #475569 !important;
                    font-size: 12px !important; text-transform: uppercase; letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important; padding: 12px 14px !important;
                }
                .ant-table-tbody > tr > td { padding: 12px 14px !important; border-bottom: 1px solid #f1f5f9 !important; }
                .ant-table-tbody > tr:hover > td { background: #f8fafc !important; }
                .ant-modal-content { border-radius: 16px !important; overflow: hidden; }
            `}</style>
        </div>
    );
};

export default SkillManagement;
