import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    Users,
    Layers,
    MapPin,
    Code,
    Building2,
    Briefcase,
    MessageSquare,
    Star,
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <Home size={20} />,
            label: 'Tổng quan',
        },
        {
            key: '/admin/users',
            icon: <Users size={20} />,
            label: 'Người dùng',
        },
        {
            key: '/admin/companies',
            icon: <Building2 size={20} />,
            label: 'Công ty',
        },
        {
            key: '/admin/jobs',
            icon: <Briefcase size={20} />,
            label: 'Tin tuyển dụng',
        },
        {
            key: '/admin/categories',
            icon: <Layers size={20} />,
            label: 'Ngành nghề',
        },
        {
            key: '/admin/locations',
            icon: <MapPin size={20} />,
            label: 'Địa điểm',
        },
        {
            key: '/admin/skills',
            icon: <Code size={20} />,
            label: 'Kỹ năng',
        },
        {
            key: '/admin/comments',
            icon: <MessageSquare size={20} />,
            label: 'Bình luận',
        },
        {
            key: '/admin/reviews',
            icon: <Star size={20} />,
            label: 'Đánh giá',
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
