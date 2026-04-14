import { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input, Card, Tooltip, Modal, Form } from 'antd';
import { Trash2, RefreshCw, Search, MapPin, Plus, Pencil } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { Location } from '../../types/Location';
import useLocation from '../../hooks/useLocation';

const LocationManagement = () => {
    const {
        locations, loading, deletingId, submitting,
        refetch, createLocation, updateLocation, deleteLocation,
    } = useLocation();

    const [searchText, setSearchText]         = useState('');
    const [isModalOpen, setIsModalOpen]       = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);
    const [form]                              = Form.useForm();

    const handleOpenAddModal = () => {
        setEditingLocation(null); form.resetFields(); setIsModalOpen(true);
    };
    const handleOpenEditModal = (loc: Location) => {
        setEditingLocation(loc); form.setFieldsValue({ name: loc.name }); setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false); setEditingLocation(null); form.resetFields();
    };
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const success = editingLocation
                ? await updateLocation(editingLocation.id, { name: values.name })
                : await createLocation({ name: values.name });
            if (success) handleCloseModal();
        } catch (error: any) {
            if (error?.errorFields) return;
        }
    };

    const filteredLocations = locations.filter((loc) =>
        loc.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<Location> = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            responsive: ['md'],
            render: (_: any, __: Location, i: number) => (
                <span className="font-semibold text-sky-500">{i + 1}</span>
            ),
        },
        {
            title: 'Tên địa điểm',
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => (
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex-shrink-0
                                    flex items-center justify-center
                                    bg-gradient-to-br from-sky-400 to-cyan-500">
                        <MapPin size={15} color="#fff" className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <Tag
                        color="cyan"
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
            render: (_: any, record: Location) => (
                <Space size={4}>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<Pencil size={15} />}
                            onClick={() => handleOpenEditModal(record)}
                            className="loc-edit-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center !text-sky-500"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xoá địa điểm"
                        description={
                            <span>
                                Bạn có chắc muốn xoá <strong>{record.name}</strong>?
                                <br />Hành động này không thể hoàn tác.
                            </span>
                        }
                        onConfirm={() => deleteLocation(record.id)}
                        okText="Xoá"
                        cancelText="Huỷ"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    >
                        <Tooltip title="Xoá địa điểm">
                            <Button
                                type="text"
                                danger
                                icon={<Trash2 size={15} />}
                                loading={deletingId === record.id}
                                className="loc-delete-btn !rounded-lg !w-9 !h-9 !flex !items-center !justify-center"
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
                        Quản lý Địa điểm
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-sm md:text-[15px] mt-1 m-0">
                        Quản lý các địa điểm tuyển dụng trong hệ thống
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
                            background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
                            boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
                        }}
                    >
                        <span className="hidden sm:inline">Thêm địa điểm</span>
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
                                        bg-gradient-to-br from-sky-400 to-cyan-500">
                            <MapPin size={20} color="#fff" className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <div className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                                {locations.length}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                                Tổng địa điểm
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
                        placeholder="Tìm kiếm địa điểm..."
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
                    dataSource={filteredLocations}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 360 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} địa điểm`,
                        style: { padding: '12px 16px', margin: 0 },
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 sm:py-14 text-center">
                                <MapPin size={40} color="#cbd5e1" className="mx-auto mb-3 sm:w-12 sm:h-12" />
                                <p className="text-slate-400 text-sm sm:text-[15px] m-0">
                                    {searchText ? 'Không tìm thấy địa điểm phù hợp' : 'Chưa có địa điểm nào'}
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
                                background: editingLocation
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
                            }}
                        >
                            {editingLocation
                                ? <Pencil size={18} color="#fff" />
                                : <Plus size={18} color="#fff" />}
                        </div>
                        <div>
                            <div className="text-sm sm:text-base font-semibold text-slate-800 leading-tight">
                                {editingLocation ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
                            </div>
                            <div className="text-xs text-slate-400 font-normal">
                                {editingLocation
                                    ? `Đang chỉnh sửa: ${editingLocation.name}`
                                    : 'Nhập tên địa điểm mới để thêm vào hệ thống'}
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
                        label={<span className="font-semibold text-gray-700 text-sm">Tên địa điểm</span>}
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên địa điểm!' },
                            { min: 2,         message: 'Tên địa điểm phải có ít nhất 2 ký tự!' },
                            { max: 100,       message: 'Tên địa điểm không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input
                            placeholder="Ví dụ: Hà Nội, TP.HCM, Đà Nẵng..."
                            size="large"
                            prefix={<MapPin size={15} color="#94a3b8" />}
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
                                background: editingLocation
                                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                                    : 'linear-gradient(135deg,#0ea5e9,#06b6d4)',
                                boxShadow: editingLocation
                                    ? '0 4px 14px rgba(245,158,11,0.35)'
                                    : '0 4px 14px rgba(14,165,233,0.35)',
                            }}
                        >
                            {editingLocation ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Custom CSS */}
            <style>{`
                .loc-edit-btn:hover   { background: #e0f2fe !important; transform: scale(1.05); }
                .loc-delete-btn:hover { background: #fef2f2 !important; transform: scale(1.05); }
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

export default LocationManagement;
