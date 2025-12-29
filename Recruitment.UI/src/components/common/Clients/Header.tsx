import { useState } from 'react';
import { Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { ChevronDown, Bell, MessageCircle, User } from 'lucide-react';

const Header = () => {
    const [activeMenu, setActiveMenu] = useState<string>('');

    const jobsMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Tìm việc làm' },
        { key: '2', label: 'Việc làm đã lưu' },
        { key: '3', label: 'Việc làm đã ứng tuyển' },
    ];

    const cvMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Tạo CV mới' },
        { key: '2', label: 'Quản lý CV' },
        { key: '3', label: 'Mẫu CV' },
    ];

    const toolsMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Tính lương Gross - Net' },
        { key: '2', label: 'Tính thuế thu nhập' },
        { key: '3', label: 'Tính BHXH' },
    ];

    const careerMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Cẩm nang nghề nghiệp' },
        { key: '2', label: 'Định hướng nghề nghiệp' },
        { key: '3', label: 'Kỹ năng mềm' },
    ];

    const userMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Thông tin cá nhân' },
        { key: '2', label: 'Cài đặt tài khoản' },
        { key: '3', label: 'Đăng xuất' },
    ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">
                                    <span className="text-gray-800">LOUG</span>
                                    <span className="text-emerald-500">CV</span>
                                </span>
                                <span className="text-xs text-gray-500">Tiếp lợi thế - Nối thành công</span>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-6">
                            <Dropdown menu={{ items: jobsMenuItems }} placement="bottomLeft">
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors py-2"
                                    onMouseEnter={() => setActiveMenu('jobs')}
                                    onMouseLeave={() => setActiveMenu('')}
                                >
                                    <span className="font-medium">Việc làm</span>
                                    <ChevronDown size={16} />
                                </button>
                            </Dropdown>

                            <Dropdown menu={{ items: cvMenuItems }} placement="bottomLeft">
                                <button
                                    className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors py-2"
                                    onMouseEnter={() => setActiveMenu('cv')}
                                    onMouseLeave={() => setActiveMenu('')}
                                >
                                    <span className="font-medium">Tạo CV</span>
                                    <ChevronDown size={16} />
                                </button>
                            </Dropdown>

                            <Dropdown menu={{ items: toolsMenuItems }} placement="bottomLeft">
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors py-2"
                                    onMouseEnter={() => setActiveMenu('tools')}
                                    onMouseLeave={() => setActiveMenu('')}
                                >
                                    <span className="font-medium">Công cụ</span>
                                    <ChevronDown size={16} />
                                </button>
                            </Dropdown>

                            <Dropdown menu={{ items: careerMenuItems }} placement="bottomLeft">
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-emerald-600 transition-colors py-2"
                                    onMouseEnter={() => setActiveMenu('career')}
                                    onMouseLeave={() => setActiveMenu('')}
                                >
                                    <span className="font-medium">Cẩm nang nghề nghiệp</span>
                                    <ChevronDown size={16} />
                                </button>
                            </Dropdown>

                        </nav>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex items-center space-x-4">
                            <Badge count={5} size="small">
                                <button className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                                    <Bell size={20} />
                                </button>
                            </Badge>

                            <Badge count={3} size="small">
                                <button className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                                    <MessageCircle size={20} />
                                </button>
                            </Badge>

                            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                                <button className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User size={18} />
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                            </Dropdown>
                        </div>

                        <div className="hidden lg:flex items-center space-x-2 border-l border-gray-200 pl-6">
                            <span className="text-sm text-gray-600">Bạn là nhà tuyển dụng?</span>
                            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-sm hover:shadow flex items-center space-x-1">
                                <span>Đăng tuyển ngay</span>
                                <span className="text-lg">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
