import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronRight } from 'lucide-react';
import { Input, Button } from 'antd';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
                    {/* Logo & Description */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col mb-6">
                            <span className="text-2xl font-bold mb-2">
                                <span className="text-white">LOUG</span>
                                <span className="text-emerald-500">CV</span>
                            </span>
                            <span className="text-xs text-gray-400">Tiếp lợi thế - Nối thành công</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Nền tảng tạo CV và tìm việc làm hàng đầu Việt Nam, kết nối hàng triệu ứng viên với nhà tuyển dụng.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors p-2 rounded-lg hover:bg-gray-800">
                                <Instagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Việc làm */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Việc làm</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Tìm việc làm</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Việc làm hot</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Công ty hàng đầu</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Ngành nghề</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Địa điểm</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Tạo CV */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Tạo CV</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Tạo CV mới</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Mẫu CV</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Hướng dẫn CV</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">CV Pro</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Công cụ */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Công cụ</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Tính lương</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Tính thuế</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Tính BHXH</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center space-x-1">
                                    <ChevronRight size={14} />
                                    <span className="text-sm">Cẩm nang</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Nhận tin tức</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Đăng ký nhận thông tin mới nhất về việc làm và xu hướng thị trường.
                        </p>
                        <div className="space-y-3">
                            <Input
                                type="email"
                                placeholder="Email của bạn"
                                className="bg-gray-800 border-gray-700 text-white"
                                size="large"
                                style={{
                                    backgroundColor: '#1f2937',
                                    borderColor: '#374151',
                                    color: 'white'
                                }}
                            />
                            <Button
                                type="primary"
                                block
                                size="large"
                                className="bg-emerald-500 hover:bg-emerald-600 border-0"
                            >
                                Đăng ký
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Contact & Links */}
                <div className="border-t border-gray-800 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="flex items-start space-x-3">
                            <Phone className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-white font-semibold mb-1">Hotline</h4>
                                <a href="tel:1900899292" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                    1900 899 292
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <Mail className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-white font-semibold mb-1">Email</h4>
                                <a href="mailto:support@lougcv.com" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                    support@lougcv.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <MapPin className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                            <div>
                                <h4 className="text-white font-semibold mb-1">Địa chỉ</h4>
                                <p className="text-gray-400 text-sm">
                                    123 Đường Lê Lợi<br />Tp. Hồ Chí Minh
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                        <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                            Về chúng tôi
                        </a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                            Điều khoản sử dụng
                        </a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                            Chính sách bảo mật
                        </a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                            Liên hệ quảng cáo
                        </a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                            Sitemap
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between">
                    <p className="text-gray-400 text-sm text-center sm:text-left mb-4 sm:mb-0">
                        Copyright © 2024 LOUGCV. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <span>Made with</span>
                        <span className="text-emerald-500">♥</span>
                        <span>by LOUGCV Team</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
