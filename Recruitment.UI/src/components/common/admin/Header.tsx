import { Badge, Avatar, Dropdown } from 'antd';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import type { MenuProps } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { logoutUser } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate('/');
    };

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <User size={14} />,
            label: 'Thông tin cá nhân',
        },
        {
            key: 'settings',
            icon: <Settings size={14} />,
            label: 'Cài đặt',
        },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogOut size={14} className="text-red-500" />,
            label: <span className="text-red-500 font-medium">Đăng xuất</span>,
            onClick: handleLogout,
        },
    ];

    const initial = user?.fullName?.charAt(0).toUpperCase() ?? 'A';

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
            {/* ─── Left: Hamburger (chỉ hiện khi < lg) ─── */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Open menu"
            >
                <Menu size={22} className="text-gray-600" />
            </button>

            {/* ─── Center: Logo / Title (lg: bị đẩy sang bên vì sidebar cố định) ─── */}
            <div className="flex-1 flex items-center lg:hidden px-3">
                <span className="text-lg font-bold">
                    <span className="text-gray-800">LOUG</span>
                    <span className="text-blue-600">CV</span>
                </span>
                <span className="ml-2 text-xs text-gray-400 hidden sm:inline">Admin</span>
            </div>

            {/* ─── lg: spacer thay cho logo (sidebar đã có logo) ─── */}
            <div className="hidden lg:flex flex-1 items-center">
                {/* Có thể đặt search bar hoặc breadcrumb ở đây sau */}
            </div>

            {/* ─── Right: Actions ─── */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">

                {/* Bell notification */}
                <Badge count={5} offset={[-4, 4]} size="small">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell size={20} className="text-gray-600" />
                    </button>
                </Badge>

                {/* User dropdown */}
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
                        <Avatar
                            size={34}
                            className="bg-blue-500 flex-shrink-0 text-white font-bold"
                        >
                            {initial}
                        </Avatar>

                        {/* Tên: ẩn trên sm, hiện từ md trở lên */}
                        <div className="hidden md:flex flex-col leading-tight">
                            <span className="text-gray-800 font-medium text-sm max-w-[100px] truncate">
                                {user?.fullName ?? 'Admin'}
                            </span>
                            <span className="text-gray-400 text-xs">Quản trị viên</span>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </header>
    );
};

export default Header;
