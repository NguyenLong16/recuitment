import { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    BarChartOutlined, CalendarOutlined, TeamOutlined,
    CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined,
    PhoneOutlined, LoadingOutlined
} from '@ant-design/icons';
import ApplicationService from '../../services/applicationService';
import { ApplicationStatsResponse } from '../../types/application';

// Màu sắc cho biểu đồ
const COLORS = {
    submitted: '#3B82F6',   // Xanh dương
    interview: '#F59E0B',   // Vàng cam
    hired: '#10B981',       // Xanh lá
    rejected: '#EF4444',    // Đỏ
    total: '#6366F1',       // Tím
};

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

type PeriodType = 'week' | 'month' | 'year';

const HRDashboard = () => {
    const [stats, setStats] = useState<ApplicationStatsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<PeriodType>('month');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await ApplicationService.getStats(period);
                setStats(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Không thể tải dữ liệu thống kê');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [period]);

    // Tính tổng
    const totals = stats.reduce(
        (acc, item) => ({
            total: acc.total + item.total,
            submitted: acc.submitted + item.submitted,
            interview: acc.interview + item.interview,
            hired: acc.hired + item.hired,
            rejected: acc.rejected + item.rejected,
        }),
        { total: 0, submitted: 0, interview: 0, hired: 0, rejected: 0 }
    );

    // Data cho PieChart
    const pieData = [
        { name: 'Đã nộp', value: totals.submitted, color: COLORS.submitted },
        { name: 'Phỏng vấn', value: totals.interview, color: COLORS.interview },
        { name: 'Trúng tuyển', value: totals.hired, color: COLORS.hired },
        { name: 'Từ chối', value: totals.rejected, color: COLORS.rejected },
    ].filter(item => item.value > 0);

    const periodLabels: Record<PeriodType, string> = {
        week: 'Theo tuần',
        month: 'Theo tháng',
        year: 'Theo năm',
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-xl border border-gray-100">
                    <p className="font-semibold text-gray-800 text-xs sm:text-sm mb-1.5 sm:mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-[11px] sm:text-xs font-medium" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChartOutlined className="text-indigo-600" />
                        Thống kê tuyển dụng
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">Tổng quan hiệu suất tuyển dụng của bạn</p>
                </div>

                {/* Period Selector */}
                <div className="flex bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-1 w-full md:w-auto overflow-x-auto shrink-0">
                    {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`flex-1 md:flex-none px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${period === p
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <CalendarOutlined className="hidden sm:block" />
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── LOADING / ERROR ────────────────────────────────────────────── */}
            {loading ? (
                <div className="flex items-center justify-center py-16 sm:py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="text-center">
                        <LoadingOutlined className="text-3xl sm:text-4xl text-indigo-500 mb-3" spin />
                        <p className="text-sm sm:text-base text-gray-500 font-medium">Đang tải dữ liệu biểu đồ...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
                    <p className="text-red-600 font-medium text-sm sm:text-base">{error}</p>
                    <button
                        onClick={() => setPeriod(period)}
                        className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs sm:text-sm font-medium"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {/* ── SUMMARY CARDS ────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        {[
                            { label: 'Tổng hồ sơ', value: totals.total, icon: <FileTextOutlined />, color: 'from-indigo-500 to-purple-600', bgLight: 'bg-indigo-50', textColor: 'text-indigo-700' },
                            { label: 'Đã nộp', value: totals.submitted, icon: <TeamOutlined />, color: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50', textColor: 'text-blue-700' },
                            { label: 'Phỏng vấn', value: totals.interview, icon: <PhoneOutlined />, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textColor: 'text-amber-700' },
                            { label: 'Trúng tuyển', value: totals.hired, icon: <CheckCircleOutlined />, color: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-700' },
                            { label: 'Từ chối', value: totals.rejected, icon: <CloseCircleOutlined />, color: 'from-red-500 to-rose-600', bgLight: 'bg-red-50', textColor: 'text-red-700' },
                        ].map((card, idx) => (
                            <div
                                key={idx}
                                className={`bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-all duration-300 group
                                ${idx === 0 ? 'col-span-2 lg:col-span-1' : 'col-span-1'}
                                `}
                            >
                                <div className="flex items-center gap-3 sm:block sm:mb-3">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${card.bgLight} flex items-center justify-center ${card.textColor} text-base sm:text-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                        {card.icon}
                                    </div>
                                    <div className="min-w-0 sm:hidden">
                                        <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide truncate">{card.label}</p>
                                        <p className="text-xl font-bold text-gray-800 leading-none mt-0.5">{card.value.toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>

                                <div className="hidden sm:block">
                                    <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                                        {card.value.toLocaleString('vi-VN')}
                                    </p>
                                    <p className="text-[11px] lg:text-sm text-gray-500 mt-1 font-medium">{card.label}</p>
                                </div>
                                
                                {totals.total > 0 && card.label !== 'Tổng hồ sơ' && (
                                    <div className="mt-2 sm:mt-3">
                                        <div className="w-full bg-gray-100 rounded-full h-1 sm:h-1.5 flex overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${card.color} transition-all duration-500`}
                                                style={{ width: `${Math.round((card.value / totals.total) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-1.5 font-medium">
                                            {Math.round((card.value / totals.total) * 100)}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ── CHARTS ROW ───────────────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Bar Chart - Thống kê theo thời gian */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-hidden">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                                <span className="w-1 h-4 sm:h-5 bg-indigo-500 rounded-full"></span>
                                Biểu đồ hồ sơ {periodLabels[period].toLowerCase()}
                            </h3>
                            {stats.length === 0 ? (
                                <div className="flex items-center justify-center h-48 sm:h-72 text-gray-400 text-sm sm:text-base">
                                    <p>Chưa có dữ liệu thống kê</p>
                                </div>
                            ) : (
                                <div className="-ml-4 sm:ml-0">
                                    <ResponsiveContainer width="100%" height={300} className="sm:h-[320px]">
                                        <BarChart data={stats} barGap={2} margin={{ left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                            <XAxis
                                                dataKey="label" axisLine={false} tickLine={false}
                                                tick={{ fill: '#6B7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                                dy={10}
                                            />
                                            <YAxis
                                                axisLine={false} tickLine={false} allowDecimals={false}
                                                tick={{ fill: '#6B7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                            <Legend wrapperStyle={{ paddingTop: '16px', fontSize: window.innerWidth < 640 ? 11 : 13 }} iconType="circle" iconSize={8} />
                                            <Bar dataKey="submitted" name="Đã nộp" fill={COLORS.submitted} radius={[3, 3, 0, 0]} maxBarSize={40} />
                                            <Bar dataKey="interview" name="Phỏng vấn" fill={COLORS.interview} radius={[3, 3, 0, 0]} maxBarSize={40} />
                                            <Bar dataKey="hired" name="Trúng tuyển" fill={COLORS.hired} radius={[3, 3, 0, 0]} maxBarSize={40} />
                                            <Bar dataKey="rejected" name="Từ chối" fill={COLORS.rejected} radius={[3, 3, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* Pie Chart - Tỷ lệ trạng thái */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col h-full">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 sm:h-5 bg-emerald-500 rounded-full"></span>
                                Tỷ lệ trạng thái
                            </h3>
                            {pieData.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center min-h-[200px] text-gray-400 text-sm">
                                    <p>Chưa có dữ liệu</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="h-[180px] sm:h-[220px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData} cx="50%" cy="50%"
                                                    innerRadius={window.innerWidth < 640 ? 45 : 60}
                                                    outerRadius={window.innerWidth < 640 ? 70 : 90}
                                                    paddingAngle={3} dataKey="value" strokeWidth={0}
                                                >
                                                    {pieData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    {/* Legend tùy chỉnh */}
                                    <div className="space-y-2 mt-4 sm:mt-6 bg-gray-50/50 p-3 sm:p-4 rounded-xl">
                                        {pieData.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                                                    <span className="text-[13px] sm:text-sm text-gray-600 font-medium">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] sm:text-sm font-bold text-gray-800">{item.value}</span>
                                                    <span className="text-[11px] sm:text-xs text-gray-400 w-8 text-right">
                                                        ({totals.total > 0 ? Math.round((item.value / totals.total) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Area Chart - Xu hướng tổng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 overflow-hidden">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                            <span className="w-1 h-4 sm:h-5 bg-purple-500 rounded-full"></span>
                            Xu hướng tổng hồ sơ
                        </h3>
                        {stats.length === 0 ? (
                            <div className="flex items-center justify-center h-40 sm:h-48 text-gray-400 text-sm sm:text-base">
                                <p>Chưa có dữ liệu</p>
                            </div>
                        ) : (
                            <div className="-ml-4 sm:ml-0">
                                <ResponsiveContainer width="100%" height={250} className="sm:h-[280px]">
                                    <AreaChart data={stats} margin={{ left: -10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={COLORS.total} stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                        <XAxis
                                            dataKey="label" axisLine={false} tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: window.innerWidth < 640 ? 10 : 12 }} dy={10}
                                        />
                                        <YAxis
                                            axisLine={false} tickLine={false} allowDecimals={false}
                                            tick={{ fill: '#6B7280', fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone" dataKey="total" name="Tổng hồ sơ"
                                            stroke={COLORS.total} strokeWidth={3}
                                            fillOpacity={1} fill="url(#colorTotal)"
                                            dot={{ fill: 'white', stroke: COLORS.total, strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0, fill: COLORS.total }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default HRDashboard;