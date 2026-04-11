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
                <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-100">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-bold">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChartOutlined className="text-indigo-600" />
                        Thống kê tuyển dụng
                    </h1>
                    <p className="text-gray-500 mt-1">Tổng quan hiệu suất tuyển dụng của bạn</p>
                </div>

                {/* Period Selector */}
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                    {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${period === p
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <CalendarOutlined />
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading / Error */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                        <LoadingOutlined className="text-4xl text-indigo-500 mb-3" spin />
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => setPeriod(period)}
                        className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'Tổng hồ sơ', value: totals.total, icon: <FileTextOutlined />, color: 'from-indigo-500 to-purple-600', bgLight: 'bg-indigo-50', textColor: 'text-indigo-700' },
                            { label: 'Đã nộp', value: totals.submitted, icon: <TeamOutlined />, color: 'from-blue-500 to-cyan-600', bgLight: 'bg-blue-50', textColor: 'text-blue-700' },
                            { label: 'Phỏng vấn', value: totals.interview, icon: <PhoneOutlined />, color: 'from-amber-500 to-orange-600', bgLight: 'bg-amber-50', textColor: 'text-amber-700' },
                            { label: 'Trúng tuyển', value: totals.hired, icon: <CheckCircleOutlined />, color: 'from-emerald-500 to-green-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-700' },
                            { label: 'Từ chối', value: totals.rejected, icon: <CloseCircleOutlined />, color: 'from-red-500 to-rose-600', bgLight: 'bg-red-50', textColor: 'text-red-700' },
                        ].map((card, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${card.bgLight} flex items-center justify-center ${card.textColor} text-lg group-hover:scale-110 transition-transform`}>
                                        {card.icon}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-800">
                                    {card.value.toLocaleString('vi-VN')}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                                {totals.total > 0 && card.label !== 'Tổng hồ sơ' && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full bg-gradient-to-r ${card.color}`}
                                                style={{ width: `${Math.round((card.value / totals.total) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {Math.round((card.value / totals.total) * 100)}%
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bar Chart - Thống kê theo thời gian */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                                Biểu đồ hồ sơ {periodLabels[period].toLowerCase()}
                            </h3>
                            {stats.length === 0 ? (
                                <div className="flex items-center justify-center h-72 text-gray-400">
                                    <p>Chưa có dữ liệu thống kê</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={stats} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="label"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend
                                            wrapperStyle={{ paddingTop: '16px' }}
                                            iconType="circle"
                                            iconSize={10}
                                        />
                                        <Bar dataKey="submitted" name="Đã nộp" fill={COLORS.submitted} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="interview" name="Phỏng vấn" fill={COLORS.interview} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="hired" name="Trúng tuyển" fill={COLORS.hired} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="rejected" name="Từ chối" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Pie Chart - Tỷ lệ trạng thái */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                                Tỷ lệ trạng thái
                            </h3>
                            {pieData.length === 0 ? (
                                <div className="flex items-center justify-center h-72 text-gray-400">
                                    <p>Chưa có dữ liệu</p>
                                </div>
                            ) : (
                                <>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={85}
                                                paddingAngle={4}
                                                dataKey="value"
                                                strokeWidth={0}
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Legend tùy chỉnh */}
                                    <div className="space-y-2.5 mt-2">
                                        {pieData.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                                                    ></span>
                                                    <span className="text-sm text-gray-600">{item.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                                                    <span className="text-xs text-gray-400">
                                                        ({totals.total > 0 ? Math.round((item.value / totals.total) * 100) : 0}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Area Chart - Xu hướng tổng */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                            Xu hướng tổng hồ sơ
                        </h3>
                        {stats.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-gray-400">
                                <p>Chưa có dữ liệu</p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={stats}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={COLORS.total} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={COLORS.total} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        name="Tổng hồ sơ"
                                        stroke={COLORS.total}
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        dot={{ fill: COLORS.total, strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default HRDashboard;