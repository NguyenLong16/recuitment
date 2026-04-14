import { useEffect, useState } from 'react';
import { Button, Card, Empty, Spin, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ApplicationResponseHistory } from '../../types/application';
import ApplicationService from '../../services/applicationService';
import { FileText, Eye, Briefcase } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const ApplicationHistoryPage = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<ApplicationResponseHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await ApplicationService.getMyApplicationHistory();
                const data = response.data || response || [];
                setApplications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching application history:', error);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // ── Status Color Mapping ───────────────────────────────────────────────────
    const getStatusStyle = (status: string) => {
        const map: Record<string, { color: string; bg: string; text: string; dot: string }> = {
            Submitted: { color: '#3b82f6', bg: '#eff6ff', text: 'Đã nộp', dot: '#3b82f6' },
            Viewed: { color: '#0ea5e9', bg: '#f0f9ff', text: 'Đã xem', dot: '#0ea5e9' },
            Interview: { color: '#f59e0b', bg: '#fffbeb', text: 'Phỏng vấn', dot: '#f59e0b' },
            Rejected: { color: '#ef4444', bg: '#fef2f2', text: 'Từ chối', dot: '#ef4444' },
            Accepted: { color: '#10b981', bg: '#ecfdf5', text: 'Trúng tuyển', dot: '#10b981' },
        };
        return map[status] || { color: '#64748b', bg: '#f1f5f9', text: status, dot: '#64748b' };
    };

    // ── Columns ───────────────────────────────────────────────────────────────
    const columns: ColumnsType<ApplicationResponseHistory> = [
        {
            title: 'STT',
            key: 'stt',
            width: 56,
            align: 'center' as const,
            responsive: ['md'],
            render: (_: any, __: ApplicationResponseHistory, index: number) => (
                <span className="font-semibold text-blue-500">{index + 1}</span>
            ),
        },
        {
            title: 'Vị trí ứng tuyển',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (text: string, record: ApplicationResponseHistory) => (
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                    <a
                        onClick={() => navigate(`/job/${record.jobId}`)}
                        className="font-semibold text-slate-800 text-sm sm:text-[15px] hover:text-blue-600 transition-colors line-clamp-2"
                    >
                        {text}
                    </a>
                    {/* Trên thiết bị siêu nhỏ, hiển thị ngày nộp ngay dưới title để tiết kiệm cột */}
                    <div className="flex sm:hidden items-center gap-1.5 text-xs text-slate-500">
                        <span>{dayjs(record.appliedDate).format('DD/MM/YYYY')}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'appliedDate',
            key: 'appliedDate',
            width: 140,
            responsive: ['sm'],
            render: (date: string) => (
                <span className="text-slate-500 text-xs sm:text-[13px]">
                    {dayjs(date).format('DD/MM/YYYY HH:mm')}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const style = getStatusStyle(status);
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full
                                   text-[10px] sm:text-xs font-semibold whitespace-nowrap"
                        style={{ color: style.color, background: style.bg }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: style.dot }} />
                        {style.text}
                    </span>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: ApplicationResponseHistory) => (
                <Button
                    type="link"
                    icon={<Eye size={15} />}
                    onClick={() => navigate(`/job/${record.jobId}`)}
                    className="!text-xs sm:!text-sm !font-medium hover:bg-slate-50 !rounded-lg !px-2 sm:!px-3"
                >
                    <span className="hidden sm:inline">Xem Job</span>
                </Button>
            ),
        },
    ];

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">

                {/* ── Header ───────────────────────────────────────────────── */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl
                                    bg-gradient-to-br from-blue-500 to-indigo-600
                                    flex items-center justify-center flex-shrink-0 shadow-sm">
                        <FileText size={20} color="#fff" className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 m-0 tracking-tight">
                            Lịch sử ứng tuyển
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 m-0 font-medium">
                            Theo dõi các công việc bạn đã nộp hồ sơ
                        </p>
                    </div>
                </div>

                {/* ── Content Card ─────────────────────────────────────────── */}
                <Card className="!rounded-2xl !border-0 !shadow-sm !overflow-hidden" styles={{ body: { padding: 0 } }}>
                    {loading ? (
                        <div className="py-20 text-center">
                            <Spin size="large" />
                            <p className="mt-4 text-slate-400 font-medium">Đang tải lịch sử ứng tuyển...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="py-16 sm:py-24 px-4 text-center">
                            <Empty
                                description={
                                    <span className="text-slate-400 text-[15px] font-medium">
                                        Bạn chưa ứng tuyển vị trí nào
                                    </span>
                                }
                                image={
                                    <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Briefcase size={40} className="text-slate-300" />
                                    </div>
                                }
                            >
                                <Button
                                    type="primary"
                                    onClick={() => navigate('/')}
                                    size="large"
                                    className="!rounded-xl !mt-2 !font-semibold !px-8"
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                                    }}
                                >
                                    Tìm việc ngay
                                </Button>
                            </Empty>
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={applications}
                            rowKey="id"
                            scroll={{ x: 400 }}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: false,
                                style: { padding: '16px 20px', margin: 0 },
                            }}
                            className="history-table"
                        />
                    )}
                </Card>

            </div>

            {/* Custom CSS for Table */}
            <style>{`
                .history-table .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    font-weight: 600 !important;
                    color: #475569 !important;
                    font-size: 13px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e2e8f0 !important;
                    padding: 14px 16px !important;
                }
                .history-table .ant-table-tbody > tr > td {
                    padding: 14px 16px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .history-table .ant-table-tbody > tr:hover > td {
                    background: #f8fafc !important;
                }
            `}</style>
        </div>
    );
};

export default ApplicationHistoryPage;