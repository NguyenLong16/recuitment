import { useState } from 'react';
import { Dropdown, Badge } from 'antd';
import type { MenuProps } from 'antd';
import { ChevronDown, MessageCircle, User, LogOut, BarChart, Users, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { logout } from '../../../redux/slices/authSlice';
import { Role } from '../../../types/auth';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
    const [activeMenu, setActiveMenu] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)
    const isHR = user?.role === Role.Employer

    const handleLogout = () => {
        dispatch(logout())
        navigate('/')
    }

    //Menu dành cho Candidate
    const jobsMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Tìm việc làm', onClick: () => navigate('/') },
        { key: '2', label: 'Việc làm đã lưu' },
        { key: '3', label: 'Việc làm đã ứng tuyển', onClick: () => navigate('/my-applications') },
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

    //Menu dành cho HR
    const hrRecruitmentItems: MenuProps['items'] = [
        { key: '1', label: <Link to="/hr/post-job">Đăng tin mới</Link> },
        { key: '2', label: <Link to="/hr/jobs-management">Quản lý tin đăng</Link> },
    ]

    const hrCandidateItems: MenuProps['items'] = [
        { key: '1', label: <Link to="hr/search-cv">Tìm hồ sơ ứng viên</Link> },
        { key: '2', label: <Link to="hr/saved-cv">Hồ sơ đã lưu</Link> },
        { key: '3', label: <Link to="hr/candidate-management">Quản lý ứng viên</Link> },
    ]

    const hrServiceItems: MenuProps['items'] = [
        { key: '1', label: 'Mua dịch vụ' },
        { key: '2', label: 'Lịch sử đơn hàng' },
        { key: '3', label: 'Kích hoạt mã' },
    ];

    //Chung
    const userMenuItems: MenuProps['items'] = [
        { key: '1', label: <Link to={isHR ? "/hr/my-profile" : "/my-profile"}>Thông tin cá nhân</Link> },
        { key: '2', label: 'Cài đặt tài khoản' },
        {
            key: '3',
            label: <span className='text-red-600 font-medium'>Đăng xuất</span>,
            icon: <LogOut size={16} className='text-red-600' />,
            onClick: handleLogout
        },
    ];


    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to={isHR ? "hr/dashboard" : "/"} className='flex flex-col cursor-pointer flex-shrink-0'>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold">
                                        <span className="text-gray-800">LOUG</span>
                                        <span className="text-emerald-500">CV</span>
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {isHR ? "Giải pháp tuyển dụng toàn diện" : "Tiếp lợi thế - Nối thành công"}
                                    </span>
                                </div>
                            </Link>

                            <nav className="hidden md:flex items-center space-x-6">
                                {isHR ? (
                                    <>
                                        <Dropdown menu={{ items: hrRecruitmentItems }} placement="bottomLeft">
                                            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2">
                                                <Briefcase size={18} className="mr-1" />
                                                <span className="font-medium">Tin tuyển dụng</span>
                                                <ChevronDown size={14} />
                                            </button>
                                        </Dropdown>

                                        <Dropdown menu={{ items: hrCandidateItems }} placement="bottomLeft">
                                            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2">
                                                <Users size={18} className="mr-1" />
                                                <span className="font-medium">Ứng viên</span>
                                                <ChevronDown size={14} />
                                            </button>
                                        </Dropdown>

                                        <Dropdown menu={{ items: hrServiceItems }} placement="bottomLeft">
                                            <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2">
                                                <BarChart size={18} className="mr-1" />
                                                <span className="font-medium">Dịch vụ & Báo cáo</span>
                                                <ChevronDown size={14} />
                                            </button>
                                        </Dropdown>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}

                            </nav>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="hidden lg:flex items-center space-x-4">
                                {user && (
                                    <div className='flex items-center space-x-6'>
                                        <NotificationDropdown />

                                        <Badge count={3} size="small">
                                            <button className="text-gray-600 hover:text-emerald-600 transition-colors p-2 rounded-lg hover:bg-gray-50">
                                                <MessageCircle size={20} />
                                            </button>
                                        </Badge>
                                    </div>
                                )}

                                {user ? (
                                    <Dropdown menu={{ items: userMenuItems }} placement='bottomRight' trigger={['click']}>
                                        <button
                                            className='flex items-center space-x-2 text-gray-700 hover:text-emerald-600 
                                        transition-colors p-1 rounded-lg hover:bg-gray-50'
                                        >
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.fullName}
                                                    className='w-9 h-9 rounded-full object-cover border border-gray-200'
                                                />
                                            ) : (
                                                // Fallback nếu avatar lỗi hoặc null (dùng Avatar chữ của Antd hoặc Icon)
                                                <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={18} />}
                                                </div>
                                            )}

                                            <div className="hidden md:block text-left">
                                                <div className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                                    {user.fullName}
                                                </div>
                                            </div>
                                            <ChevronDown size={16} />
                                        </button>
                                    </Dropdown>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Link to="/login" className="text-gray-600 hover:text-emerald-600 font-medium px-3 py-2">
                                            Đăng nhập
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Đăng ký
                                        </Link>
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
