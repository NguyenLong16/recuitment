import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <Home size={20} />,
            label: 'Tổng quan',
        },
        {
            key: '/users',
            icon: <Users size={20} />,
            label: 'Người dùng',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center">
                <span className="text-xl font-bold text-gray-800">LOUGCV</span>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="border-0 flex-1"
            />
        </div>
    );
};

export default Sidebar;
