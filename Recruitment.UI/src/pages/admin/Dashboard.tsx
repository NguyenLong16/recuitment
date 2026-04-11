import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  UserCircle, 
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Spin, Alert, Select } from 'antd';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const JOB_COLORS = {
  active: '#10b981', // emerald-500
  expired: '#f59e0b', // amber-500
  closed: '#ef4444', // red-500
  draft: '#6b7280'   // gray-500
};

const StatCard = ({ title, value, icon: Icon, colorClass, gradientClass }: any) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 shadow-sm ${gradientClass} transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`rounded-xl p-3 ${colorClass} bg-white/20 backdrop-blur-sm`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
  </div>
);

const Dashboard = () => {
  const { stats, trends, distributions, rankings, loading, rankingsLoading, error, topN, setTopN } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert message="Lỗi" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!stats || !trends || !distributions || !rankings) return null;

  const userPieData = [
    { name: 'Ứng viên', value: stats.userStats.totalCandidates },
    { name: 'Nhà tuyển dụng', value: stats.userStats.totalEmployers },
  ];

  const jobPieData = [
    { name: 'Đang hoạt động', value: stats.jobStats.activeJobs, color: JOB_COLORS.active },
    { name: 'Đã hết hạn', value: stats.jobStats.expiredJobs, color: JOB_COLORS.expired },
    { name: 'Đã đóng', value: stats.jobStats.closedJobs, color: JOB_COLORS.closed },
    { name: 'Bản nháp', value: stats.jobStats.draftJobs, color: JOB_COLORS.draft },
  ].filter(item => item.value > 0);

  const combinedActivityTrend = trends.jobPostingTrend.map((job, idx) => ({
    label: job.label,
    jobCount: job.count,
    appCount: trends.applicationTrend[idx]?.count || 0
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const RankingList = ({ title, data, nameKey = 'name', countKey = 'jobCount', countLabel = 'Việc làm' }: any) => (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-50 px-6 py-5 pb-4 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex-1 p-0">
        <ul className="divide-y divide-gray-50">
          {data.map((item: any, index: number) => (
            <li key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {item.rank}
                </div>
                <span className="font-medium text-gray-700">{item[nameKey]}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-gray-900">{item[countKey]}</span>
                <span className="text-[10px] text-gray-500">{countLabel}</span>
              </div>
            </li>
          ))}
        </ul>
        {data.length === 0 && <div className="p-6 text-center text-sm text-gray-500">Chưa có dữ liệu</div>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-sm text-gray-500">Số liệu thống kê tự động cập nhật theo thời gian thực.</p>
      </div>

      {/* Top Value Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng người dùng"
          value={stats.userStats.totalUsers}
          icon={Users}
          colorClass="text-blue-100"
          gradientClass="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Tổng công ty"
          value={stats.totalCompanies}
          icon={Building2}
          colorClass="text-indigo-100"
          gradientClass="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          title="Tổng công việc"
          value={stats.jobStats.totalJobs}
          icon={Briefcase}
          colorClass="text-emerald-100"
          gradientClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Tổng lượt ứng tuyển"
          value={stats.totalApplications}
          icon={FileText}
          colorClass="text-violet-100"
          gradientClass="bg-gradient-to-br from-violet-500 to-violet-600"
        />
      </div>

      {/* Detailed Stats and Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users Breakdown */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Cơ cấu Người dùng</h3>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center p-6 sm:flex-row">
            <div className="h-64 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userPieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex w-full flex-col gap-4 sm:mt-0 sm:w-1/2 sm:pl-6">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ứng viên</p>
                    <p className="text-xl font-bold text-gray-900">{stats.userStats.totalCandidates}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nhà tuyển dụng</p>
                    <p className="text-xl font-bold text-gray-900">{stats.userStats.totalEmployers}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Breakdown */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Trạng thái Công việc</h3>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-50 p-3 text-center">
                <CheckCircle2 className="mb-2 h-6 w-6 text-emerald-500" />
                <p className="text-xs font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-lg font-bold text-emerald-600">{stats.jobStats.activeJobs}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-amber-50 p-3 text-center">
                <Clock className="mb-2 h-6 w-6 text-amber-500" />
                <p className="text-xs font-medium text-gray-600">Đã hết hạn</p>
                <p className="text-lg font-bold text-amber-600">{stats.jobStats.expiredJobs}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-red-50 p-3 text-center">
                <XCircle className="mb-2 h-6 w-6 text-red-500" />
                <p className="text-xs font-medium text-gray-600">Đã đóng</p>
                <p className="text-lg font-bold text-red-600">{stats.jobStats.closedJobs}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-3 text-center">
                <AlertCircle className="mb-2 h-6 w-6 text-gray-500" />
                <p className="text-xs font-medium text-gray-600">Bản nháp</p>
                <p className="text-lg font-bold text-gray-600">{stats.jobStats.draftJobs}</p>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobPieData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <RechartsTooltip
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                    {jobPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Trends Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* User Growth Trend */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Tăng trưởng người dùng</h3>
          </div>
          <div className="p-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.userGrowthTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="candidateCount" name="Ứng viên mới" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="hrCount" name="Nhà tuyển dụng mới" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Posting & Application Trend */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Hoạt động công việc & Ứng tuyển</h3>
          </div>
          <div className="p-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedActivityTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="jobCount" name="Việc làm mới" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="appCount" name="Lượt ứng tuyển" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Distributions Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Application Status Distribution */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Trạng thái Ứng tuyển</h3>
          </div>
          <div className="p-6 h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributions.applicationStatusDistribution.filter(d => d.count > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="label"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {distributions.applicationStatusDistribution.filter(d => d.count > 0).map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Type Distribution */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 px-6 py-5 pb-4">
            <h3 className="font-semibold text-gray-900">Loại hình Công việc</h3>
          </div>
          <div className="p-6 h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributions.jobTypeDistribution.filter(d => d.count > 0)} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" name="Số lượng" radius={[0, 4, 4, 0]} maxBarSize={30}>
                  {distributions.jobTypeDistribution.filter(d => d.count > 0).map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="mt-10 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">Bảng xếp hạng nổi bật</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Hiển thị:</span>
          <Select
            value={topN}
            onChange={(value) => setTopN(value)}
            options={[
              { value: 5, label: 'Top 5' },
              { value: 10, label: 'Top 10' },
              { value: 20, label: 'Top 20' },
            ]}
            style={{ width: 100 }}
          />
        </div>
      </div>
      
      {rankingsLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-gray-100 bg-white">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <RankingList title="Ngành nghề phổ biến" data={rankings.topCategories} />
          <RankingList title="Kỹ năng yêu cầu nhiều" data={rankings.topSkills} />
          <RankingList title="Địa điểm tuyển nhiều" data={rankings.topLocations} />
          
          {/* Top Companies */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-50 px-6 py-5 pb-4 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Công ty hàng đầu</h3>
            </div>
            <div className="flex-1 p-0">
              <ul className="divide-y divide-gray-50">
                {rankings.topCompanies.map((company: any, index: number) => (
                  <li key={company.id} className="flex flex-col gap-3 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {company.rank}
                      </div>
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.companyName} className="h-8 w-8 flex-shrink-0 rounded-md object-cover border border-gray-100 bg-white shadow-sm" />
                      ) : (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                          {company.companyName.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-700 truncate" title={company.companyName}>{company.companyName}</span>
                    </div>
                    <div className="flex gap-4 ml-10">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{company.jobCount}</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Việc làm</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{company.applicationCount}</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">Ứng tuyển</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {rankings.topCompanies.length === 0 && <div className="p-6 text-center text-sm text-gray-500">Chưa có dữ liệu</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;