import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import {
    Users, Building2, Briefcase, FileText, UserCircle,
    CheckCircle2, AlertCircle, Clock, XCircle,
} from 'lucide-react';
import {
    PieChart, Pie, Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line, Legend,
} from 'recharts';
import { Spin, Alert, Select } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const JOB_COLORS = {
    active:  '#10b981',
    expired: '#f59e0b',
    closed:  '#ef4444',
    draft:   '#6b7280',
};

// ── StatCard ──────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, gradientClass }: any) => (
    <div className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm
                     ${gradientClass} transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
        <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
                <p className="text-xs sm:text-sm font-medium text-white/80">{title}</p>
                <h3 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-white">{value}</h3>
            </div>
            <div className="rounded-xl p-2 sm:p-3 bg-white/20 backdrop-blur-sm flex-shrink-0">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
        </div>
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
    </div>
);

// ── CustomTooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg text-sm">
                <p className="font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

// ── SectionCard wrapper ───────────────────────────────────────────────────────
const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-50 px-4 sm:px-6 py-3.5 sm:py-5 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
        </div>
        {children}
    </div>
);

// ── RankingList ───────────────────────────────────────────────────────────────
const RankingList = ({
    title, data,
    nameKey = 'name', countKey = 'jobCount', countLabel = 'Việc làm',
}: any) => (
    <SectionCard title={title}>
        <div className="flex-1 p-0">
            <ul className="divide-y divide-gray-50">
                {data.map((item: any, index: number) => (
                    <li key={item.id}
                        className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4
                                   hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <div className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 items-center justify-center
                                             rounded-full text-[10px] sm:text-xs font-bold
                                             ${index === 0 ? 'bg-amber-100 text-amber-600'
                                               : index === 1 ? 'bg-gray-100 text-gray-600'
                                               : index === 2 ? 'bg-orange-100 text-orange-600'
                                               : 'bg-blue-50 text-blue-600'}`}>
                                {item.rank}
                            </div>
                            <span className="font-medium text-gray-700 text-xs sm:text-sm truncate">
                                {item[nameKey]}
                            </span>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                {item[countKey]}
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-gray-500">{countLabel}</span>
                        </div>
                    </li>
                ))}
            </ul>
            {data.length === 0 && (
                <div className="p-6 text-center text-sm text-gray-500">Chưa có dữ liệu</div>
            )}
        </div>
    </SectionCard>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const {
        stats, trends, distributions, rankings,
        loading, rankingsLoading, error, topN, setTopN,
    } = useAdminDashboard();

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <Alert message="Lỗi" description={error} type="error" showIcon />
            </div>
        );
    }

    if (!stats || !trends || !distributions || !rankings) return null;

    const userPieData = [
        { name: 'Ứng viên',        value: stats.userStats.totalCandidates },
        { name: 'Nhà tuyển dụng',  value: stats.userStats.totalEmployers  },
    ];

    const jobPieData = [
        { name: 'Đang hoạt động', value: stats.jobStats.activeJobs,  color: JOB_COLORS.active  },
        { name: 'Đã hết hạn',     value: stats.jobStats.expiredJobs, color: JOB_COLORS.expired },
        { name: 'Đã đóng',        value: stats.jobStats.closedJobs,  color: JOB_COLORS.closed  },
        { name: 'Bản nháp',       value: stats.jobStats.draftJobs,   color: JOB_COLORS.draft   },
    ].filter(item => item.value > 0);

    const combinedActivityTrend = trends.jobPostingTrend.map((job, idx) => ({
        label: job.label,
        jobCount: job.count,
        appCount: trends.applicationTrend[idx]?.count || 0,
    }));

    // ── Shared chart styles ─────────────────────────────────────────────────
    const tooltipStyle = {
        borderRadius: '8px',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        fontSize: 12,
    };
    const axisTickStyle = { fontSize: 11, fill: '#6B7280' };

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 space-y-5 sm:space-y-6 md:space-y-8">

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                    Tổng quan hệ thống
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Số liệu thống kê tự động cập nhật theo thời gian thực.
                </p>
            </div>

            {/* ── Stat Cards
                sm : 2 cột
                md : 2 cột (vừa)
                lg : 4 cột
            ────────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <StatCard title="Tổng người dùng"    value={stats.userStats.totalUsers}  icon={Users}    gradientClass="bg-gradient-to-br from-blue-500 to-blue-600"    />
                <StatCard title="Tổng công ty"        value={stats.totalCompanies}         icon={Building2} gradientClass="bg-gradient-to-br from-indigo-500 to-indigo-600" />
                <StatCard title="Tổng công việc"      value={stats.jobStats.totalJobs}    icon={Briefcase} gradientClass="bg-gradient-to-br from-emerald-500 to-emerald-600"/>
                <StatCard title="Tổng lượt ứng tuyển" value={stats.totalApplications}     icon={FileText}  gradientClass="bg-gradient-to-br from-violet-500 to-violet-600"  />
            </div>

            {/* ── Users + Jobs Status
                sm : 1 cột
                lg : 2 cột
            ────────────────────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">

                {/* Cơ cấu người dùng */}
                <SectionCard title="Cơ cấu Người dùng">
                    <div className="flex flex-col sm:flex-row items-center justify-center p-4 sm:p-6 gap-4">
                        {/* Chart — chiều cao responsive */}
                        <div className="h-48 sm:h-56 md:h-64 w-full sm:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={userPieData} cx="50%" cy="50%"
                                        innerRadius={50} outerRadius={70}
                                        paddingAngle={5} dataKey="value">
                                        {userPieData.map((_e, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend cards */}
                        <div className="flex sm:flex-col gap-3 w-full sm:w-1/2 sm:pl-4">
                            {[
                                { label: 'Ứng viên',       value: stats.userStats.totalCandidates, bg: 'bg-blue-100',    text: 'text-blue-600',    icon: UserCircle },
                                { label: 'Nhà tuyển dụng', value: stats.userStats.totalEmployers,  bg: 'bg-emerald-100', text: 'text-emerald-600', icon: Briefcase  },
                            ].map(({ label, value, bg, text, icon: Icon }) => (
                                <div key={label}
                                     className="flex items-center gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4 flex-1 sm:flex-none">
                                    <div className={`rounded-lg ${bg} ${text} p-1.5 sm:p-2`}>
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {/* Trạng thái công việc */}
                <SectionCard title="Trạng thái Công việc">
                    <div className="p-4 sm:p-6">
                        {/* 4 mini stat badges — 2×2 trên sm, 4 cột trên md */}
                        <div className="mb-4 sm:mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                            {[
                                { icon: CheckCircle2, label: 'Đang HĐ',   value: stats.jobStats.activeJobs,  bg: 'bg-emerald-50', text: 'text-emerald-500', val: 'text-emerald-600' },
                                { icon: Clock,        label: 'Hết hạn',   value: stats.jobStats.expiredJobs, bg: 'bg-amber-50',   text: 'text-amber-500',  val: 'text-amber-600'  },
                                { icon: XCircle,      label: 'Đã đóng',   value: stats.jobStats.closedJobs,  bg: 'bg-red-50',     text: 'text-red-500',    val: 'text-red-600'    },
                                { icon: AlertCircle,  label: 'Bản nháp',  value: stats.jobStats.draftJobs,   bg: 'bg-gray-50',    text: 'text-gray-500',   val: 'text-gray-600'   },
                            ].map(({ icon: Icon, label, value, bg, text, val }) => (
                                <div key={label}
                                     className={`flex flex-col items-center justify-center rounded-xl ${bg} p-2.5 sm:p-3 text-center`}>
                                    <Icon className={`mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 ${text}`} />
                                    <p className="text-[10px] sm:text-xs font-medium text-gray-600">{label}</p>
                                    <p className={`text-base sm:text-lg font-bold ${val}`}>{value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="h-36 sm:h-44 md:h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={jobPieData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={axisTickStyle} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} />
                                    <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                                        {jobPieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ── Trends ────────────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <SectionCard title="Tăng trưởng người dùng">
                    <div className="p-4 sm:p-6 h-56 sm:h-64 md:h-72 lg:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends.userGrowthTrend}
                                       margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTickStyle} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} />
                                <RechartsTooltip contentStyle={tooltipStyle} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                                <Line type="monotone" dataKey="candidateCount" name="Ứng viên mới"       stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="hrCount"        name="Nhà TD mới"         stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>

                <SectionCard title="Hoạt động công việc & Ứng tuyển">
                    <div className="p-4 sm:p-6 h-56 sm:h-64 md:h-72 lg:h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={combinedActivityTrend}
                                       margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisTickStyle} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={axisTickStyle} />
                                <RechartsTooltip contentStyle={tooltipStyle} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
                                <Line type="monotone" dataKey="jobCount" name="Việc làm mới"   stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                                <Line type="monotone" dataKey="appCount" name="Lượt ứng tuyển" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>

            {/* ── Distributions ─────────────────────────────────────────────── */}
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <SectionCard title="Trạng thái Ứng tuyển">
                    <div className="p-4 sm:p-6 h-56 sm:h-64 md:h-72 lg:h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributions.applicationStatusDistribution.filter(d => d.count > 0)}
                                    cx="50%" cy="50%"
                                    innerRadius={0} outerRadius="55%"
                                    paddingAngle={2}
                                    dataKey="count" nameKey="label"
                                    label={({ name, percent }: any) =>
                                        `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    labelLine={{ stroke: '#94a3b8' }}
                                >
                                    {distributions.applicationStatusDistribution
                                        .filter(d => d.count > 0)
                                        .map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <RechartsTooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>

                <SectionCard title="Loại hình Công việc">
                    <div className="p-4 sm:p-6 h-56 sm:h-64 md:h-72 lg:h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={distributions.jobTypeDistribution.filter(d => d.count > 0)}
                                layout="vertical"
                                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number"   axisLine={false} tickLine={false} tick={axisTickStyle} />
                                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={axisTickStyle} width={70} />
                                <RechartsTooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="count" name="Số lượng" radius={[0, 4, 4, 0]} maxBarSize={24}>
                                    {distributions.jobTypeDistribution
                                        .filter(d => d.count > 0)
                                        .map((_e, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </SectionCard>
            </div>

            {/* ── Rankings ──────────────────────────────────────────────────── */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                        Bảng xếp hạng nổi bật
                    </h2>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">Hiển thị:</span>
                        <Select
                            value={topN}
                            onChange={(v) => setTopN(v)}
                            options={[
                                { value: 5,  label: 'Top 5'  },
                                { value: 10, label: 'Top 10' },
                                { value: 20, label: 'Top 20' },
                            ]}
                            size="middle"
                            className="w-24"
                        />
                    </div>
                </div>

                {rankingsLoading ? (
                    <div className="flex h-48 sm:h-64 w-full items-center justify-center
                                    rounded-2xl border border-gray-100 bg-white">
                        <Spin size="large" />
                    </div>
                ) : (
                    /* sm : 1 cột, md : 2 cột, xl : 4 cột */
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        <RankingList title="Ngành nghề phổ biến"  data={rankings.topCategories} />
                        <RankingList title="Kỹ năng yêu cầu nhiều" data={rankings.topSkills} />
                        <RankingList title="Địa điểm tuyển nhiều"  data={rankings.topLocations} />

                        {/* Top Companies — custom item */}
                        <SectionCard title="Công ty hàng đầu">
                            <div className="flex-1 p-0">
                                <ul className="divide-y divide-gray-50">
                                    {rankings.topCompanies.map((company: any, index: number) => (
                                        <li key={company.id}
                                            className="flex flex-col gap-2 px-4 sm:px-6 py-3 sm:py-4
                                                       hover:bg-gray-50/50 transition-colors">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className={`flex h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0
                                                                  items-center justify-center rounded-full
                                                                  text-[10px] sm:text-xs font-bold
                                                                  ${index === 0 ? 'bg-amber-100 text-amber-600'
                                                                    : index === 1 ? 'bg-gray-100 text-gray-600'
                                                                    : index === 2 ? 'bg-orange-100 text-orange-600'
                                                                    : 'bg-blue-50 text-blue-600'}`}>
                                                    {company.rank}
                                                </div>
                                                {company.logoUrl ? (
                                                    <img
                                                        src={company.logoUrl}
                                                        alt={company.companyName}
                                                        className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 rounded-md object-cover border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center
                                                                    rounded-md bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 text-xs">
                                                        {company.companyName.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-700 text-xs sm:text-sm truncate">
                                                    {company.companyName}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 ml-8 sm:ml-10">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-sm">{company.jobCount}</span>
                                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500">Việc làm</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-sm">{company.applicationCount}</span>
                                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500">Ứng tuyển</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {rankings.topCompanies.length === 0 && (
                                    <div className="p-6 text-center text-sm text-gray-500">Chưa có dữ liệu</div>
                                )}
                            </div>
                        </SectionCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;