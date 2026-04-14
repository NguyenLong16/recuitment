import { useState } from 'react';
import { Drawer, Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import {
    ChevronDown, MessageCircle, User, LogOut,
    BarChart, Users, Briefcase, Menu, X,
    Home, Bookmark, FileText,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { logoutUser } from '../../../redux/slices/authSlice';
import { Role } from '../../../types/auth';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const isHR = user?.role === Role.Employer;

    const handleLogout = async () => {
        await dispatch(logoutUser());
        setMobileOpen(false);
        navigate('/');
    };

    const goTo = (path: string) => {
        navigate(path);
        setMobileOpen(false);
    };

    // ── Ant Design dropdown menus ──────────────────────────────────────────────
    const jobsMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Tìm việc làm', onClick: () => goTo('/') },
        { key: '2', label: 'Việc làm đã lưu' },
        { key: '3', label: 'Việc làm đã ứng tuyển', onClick: () => goTo('/my-applications') },
    ];

    const hrRecruitmentItems: MenuProps['items'] = [
        { key: '1', label: <Link to="/hr/post-job">Đăng tin mới</Link> },
        { key: '2', label: <Link to="/hr/jobs-management">Quản lý tin đăng</Link> },
    ];

    const hrCandidateItems: MenuProps['items'] = [
        { key: '1', label: <Link to="/hr/search-cv">Tìm hồ sơ ứng viên</Link> },
        { key: '2', label: <Link to="/hr/saved-cv">Hồ sơ đã lưu</Link> },
        { key: '3', label: <Link to="/hr/candidate-management">Quản lý ứng viên</Link> },
    ];

    const hrServiceItems: MenuProps['items'] = [
        { key: '1', label: <Link to="/hr/dashboard">Thống kê</Link> },
        { key: '2', label: 'Lịch sử đơn hàng' },
        { key: '3', label: 'Kích hoạt mã' },
    ];

    const userMenuItems: MenuProps['items'] = [
        { key: '1', label: <Link to={isHR ? '/hr/my-profile' : '/my-profile'}>Thông tin cá nhân</Link> },
        { key: '2', label: 'Cài đặt tài khoản' },
        {
            key: '3',
            label: <span className="text-red-600 font-medium">Đăng xuất</span>,
            icon: <LogOut size={15} className="text-red-600" />,
            onClick: handleLogout,
        },
    ];

    // ── Avatar / initial ───────────────────────────────────────────────────────
    const initial = user?.fullName?.charAt(0).toUpperCase() ?? <User size={16} />;

    const AvatarCircle = ({ size = 36 }: { size?: number }) => (
        <div
            style={{ width: size, height: size, fontSize: size * 0.4 }}
            className="bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold flex-shrink-0"
        >
            {initial}
        </div>
    );

    // ── Nav button (dùng lại cho desktop hr/candidate) ─────────────────────────
    const NavBtn = ({
        icon,
        label,
        items,
        colorHover = 'hover:text-emerald-600',
    }: {
        icon?: React.ReactNode;
        label: string;
        items: MenuProps['items'];
        colorHover?: string;
    }) => (
        <Dropdown menu={{ items }} placement="bottomLeft">
            <button className={`flex items-center gap-1 text-gray-700 ${colorHover} transition-colors py-2 font-medium text-sm`}>
                {icon}
                <span>{label}</span>
                <ChevronDown size={13} className="opacity-70" />
            </button>
        </Dropdown>
    );

    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">

                        {/* ── LEFT: Logo ─────────────────────────────────────── */}
                        <Link
                            to={isHR ? '/hr/dashboard' : '/'}
                            className="flex flex-col flex-shrink-0 leading-tight"
                        >
                            <span className="text-xl sm:text-2xl font-bold">
                                <span className="text-gray-800">LOUG</span>
                                <span className="text-emerald-500">CV</span>
                            </span>
                            {/* Tagline: ẩn trên sm, hiện từ md */}
                            <span className="hidden md:block text-[10px] text-gray-400 -mt-0.5">
                                {isHR ? 'Giải pháp tuyển dụng toàn diện' : 'Tiếp lợi thế - Nối thành công'}
                            </span>
                        </Link>

                        {/* ── CENTER: Desktop nav (hidden < md) ──────────────── */}
                        <nav className="hidden md:flex items-center gap-1 lg:gap-4 ml-4 lg:ml-8">
                            {isHR ? (
                                <>
                                    <NavBtn icon={<Briefcase size={16} />} label="Tin tuyển dụng" items={hrRecruitmentItems} colorHover="hover:text-blue-600" />
                                    <NavBtn icon={<Users size={16} />} label="Ứng viên" items={hrCandidateItems} colorHover="hover:text-blue-600" />
                                    <NavBtn icon={<BarChart size={16} />} label="Thống kê" items={hrServiceItems} colorHover="hover:text-blue-600" />
                                </>
                            ) : (
                                <NavBtn label="Việc làm" items={jobsMenuItems} />
                            )}
                        </nav>

                        {/* ── RIGHT: Actions ─────────────────────────────────── */}
                        <div className="flex items-center gap-1 sm:gap-2">

                            {/* Notification + Message: chỉ hiện lg khi đã login */}
                            {user && (
                                <div className="hidden lg:flex items-center gap-1">
                                    <NotificationDropdown />
                                    <Badge count={3} size="small">
                                        <button className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                                            <MessageCircle size={20} />
                                        </button>
                                    </Badge>
                                </div>
                            )}

                            {/* Notification icon: md (không có message) */}
                            {user && (
                                <div className="hidden md:flex lg:hidden">
                                    <NotificationDropdown />
                                </div>
                            )}

                            {/* Avatar dropdown: md trở lên */}
                            {user ? (
                                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                                    <button className="hidden md:flex items-center gap-1.5 text-gray-700 hover:text-emerald-600 transition-colors p-1 rounded-lg hover:bg-gray-50">
                                        <AvatarCircle size={34} />
                                        {/* Tên: chỉ lg */}
                                        <span className="hidden lg:block text-sm font-medium max-w-[90px] truncate">
                                            {user.fullName}
                                        </span>
                                        <ChevronDown size={13} className="hidden lg:block opacity-60" />
                                    </button>
                                </Dropdown>
                            ) : (
                                /* Đăng nhập / Đăng ký: md trở lên */
                                <div className="hidden md:flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-emerald-600 font-medium text-sm px-3 py-1.5 transition-colors"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium
                                                   px-4 py-1.5 rounded-full transition-all shadow hover:shadow-emerald-500/30"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}

                            {/* ── Hamburger: chỉ sm (< md) ── */}
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                                aria-label="Mở menu"
                            >
                                <Menu size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Mobile Drawer (sm only) ──────────────────────────────────── */}
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                placement="right"
                width="80%"
                closable={false}
                styles={{ body: { padding: 0 } }}
                className="md:hidden"
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-xl font-bold">
                        <span className="text-gray-800">LOUG</span>
                        <span className="text-emerald-500">CV</span>
                    </span>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* User info */}
                {user && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                        <AvatarCircle size={40} />
                        <div>
                            <div className="font-semibold text-gray-800 text-sm">{user.fullName}</div>
                            <div className="text-xs text-gray-500">{user.role}</div>
                        </div>
                    </div>
                )}

                {/* Nav links */}
                <nav className="py-2">
                    {!isHR && (
                        <>
                            <MobileNavItem icon={<Home size={18} />} label="Trang chủ" onClick={() => goTo('/')} />
                            <MobileNavItem icon={<Bookmark size={18} />} label="Việc làm đã lưu" onClick={() => goTo('/')} />
                            <MobileNavItem icon={<FileText size={18} />} label="Việc làm đã ứng tuyển" onClick={() => goTo('/my-applications')} />
                        </>
                    )}
                    {isHR && (
                        <>
                            <MobileNavItem icon={<Briefcase size={18} />} label="Đăng tin mới" onClick={() => goTo('/hr/post-job')} />
                            <MobileNavItem icon={<FileText size={18} />} label="Quản lý tin đăng" onClick={() => goTo('/hr/jobs-management')} />
                            <MobileNavItem icon={<Users size={18} />} label="Tìm hồ sơ ứng viên" onClick={() => goTo('/hr/search-cv')} />
                            <MobileNavItem icon={<BarChart size={18} />} label="Thống kê" onClick={() => goTo('/hr/dashboard')} />
                        </>
                    )}
                </nav>

                {/* Auth actions */}
                <div className="border-t border-gray-100 p-4 mt-auto">
                    {user ? (
                        <div className="space-y-2">
                            <MobileNavItem
                                icon={<User size={18} />}
                                label="Thông tin cá nhân"
                                onClick={() => goTo(isHR ? '/hr/my-profile' : '/my-profile')}
                            />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                                           text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                <LogOut size={18} />
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="block w-full text-center py-2.5 border border-emerald-600
                                           text-emerald-600 rounded-lg font-medium text-sm hover:bg-emerald-50 transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMobileOpen(false)}
                                className="block w-full text-center py-2.5 bg-emerald-600
                                           text-white rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors"
                            >
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
};

// ── Mobile nav item ────────────────────────────────────────────────────────────
const MobileNavItem = ({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 w-full px-4 py-2.5
                   text-gray-700 hover:bg-gray-50 hover:text-emerald-600
                   transition-colors text-sm font-medium"
    >
        <span className="text-gray-400">{icon}</span>
        {label}
    </button>
);

export default Header;
