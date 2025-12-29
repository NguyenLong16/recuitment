import { Badge, Avatar, Dropdown } from 'antd';
import { Menu, Bell, User } from 'lucide-react';
import type { MenuProps } from 'antd';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Thông tin cá nhân',
        },
        {
            key: 'settings',
            label: 'Cài đặt',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
        },
    ];

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Menu size={24} className="text-gray-600" />
            </button>

            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                <Badge count={5} offset={[-5, 5]}>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell size={20} className="text-gray-600" />
                    </button>
                </Badge>

                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                        <Avatar
                            size={36}
                            icon={<User size={20} />}
                            className="bg-blue-500"
                        />
                        <span className="text-gray-800 font-medium">Long</span>
                    </div>
                </Dropdown>
            </div>
        </header>
    );
};

export default Header;
