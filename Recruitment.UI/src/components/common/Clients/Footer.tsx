import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronRight } from 'lucide-react';
import { Input, Button } from 'antd';

// ── Reusable link item ─────────────────────────────────────────────────────────
const FooterLink = ({ label, href = '#' }: { label: string; href?: string }) => (
    <li>
        <a
            href={href}
            className="text-gray-400 hover:text-emerald-400 transition-colors
                       flex items-center gap-1 text-sm group"
        >
            <ChevronRight size={13} className="opacity-0 group-hover:opacity-100 -ml-1 transition-opacity" />
            {label}
        </a>
    </li>
);

// ── Reusable contact row ───────────────────────────────────────────────────────
const ContactRow = ({
    icon,
    title,
    content,
    href,
}: {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
    href?: string;
}) => (
    <div className="flex items-start gap-3">
        <div className="text-emerald-400 mt-0.5 flex-shrink-0">{icon}</div>
        <div>
            <h4 className="text-white font-semibold text-sm mb-0.5">{title}</h4>
            {href ? (
                <a href={href} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    {content}
                </a>
            ) : (
                <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
            )}
        </div>
    </div>
);

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Main grid ──────────────────────────────────────────────────
                    sm : 1 cột (stack dọc, dễ đọc trên mobile)
                    md : 2 cột (logo+newsletter | không gian cho 3 cột links)
                    lg : 5 cột (logo | việc làm | CV | công cụ | newsletter)
                ─────────────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5
                                gap-6 sm:gap-8
                                py-8 sm:py-10 lg:py-12">

                    {/* ── Logo & Description (lg chiếm 2/5) ── */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        {/* Logo */}
                        <div className="flex flex-col mb-4">
                            <span className="text-2xl font-bold">
                                <span className="text-white">LOUG</span>
                                <span className="text-emerald-400">CV</span>
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">Tiếp lợi thế - Nối thành công</span>
                        </div>

                        {/* Mô tả — ẩn trên sm để tiết kiệm không gian */}
                        <p className="hidden sm:block text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
                            Nền tảng tạo CV và tìm việc làm hàng đầu Việt Nam, kết nối hàng triệu
                            ứng viên với nhà tuyển dụng.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-1">
                            {[
                                { Icon: Facebook, label: 'Facebook' },
                                { Icon: Twitter,  label: 'Twitter'  },
                                { Icon: Linkedin, label: 'LinkedIn' },
                                { Icon: Instagram,label: 'Instagram'},
                            ].map(({ Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="text-gray-400 hover:text-emerald-400
                                               transition-colors p-2 rounded-lg hover:bg-gray-800"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* ── Việc làm ── */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                            Việc làm
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <FooterLink label="Tìm việc làm" />
                            <FooterLink label="Việc làm hot" />
                            <FooterLink label="Công ty hàng đầu" />
                            <FooterLink label="Ngành nghề" />
                            <FooterLink label="Địa điểm" />
                        </ul>
                    </div>

                    {/* ── Tạo CV ── */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                            Tạo CV
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <FooterLink label="Tạo CV mới" />
                            <FooterLink label="Mẫu CV" />
                            <FooterLink label="Hướng dẫn CV" />
                            <FooterLink label="CV Pro" />
                        </ul>
                    </div>

                    {/* ── Công cụ + Newsletter (sm: span 2, lg: 1 cột) ── */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        {/* Công cụ — ẩn trên sm vì đã hiện ở cột riêng ở md+ */}
                        <div className="mb-6 lg:hidden">
                            <h3 className="text-white font-semibold mb-3 text-sm sm:text-base">
                                Công cụ
                            </h3>
                            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4">
                                <FooterLink label="Tính lương" />
                                <FooterLink label="Tính thuế" />
                                <FooterLink label="Tính BHXH" />
                                <FooterLink label="Cẩm nang" />
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                                Nhận tin tức
                            </h3>
                            <p className="text-sm text-gray-400 mb-3 hidden sm:block">
                                Đăng ký nhận thông tin việc làm mới nhất.
                            </p>
                            <div className="flex sm:flex-col gap-2">
                                <Input
                                    type="email"
                                    placeholder="Email của bạn"
                                    size="middle"
                                    className="flex-1 sm:flex-none"
                                    style={{
                                        backgroundColor: '#1f2937',
                                        borderColor: '#374151',
                                        color: 'white',
                                    }}
                                />
                                <Button
                                    type="primary"
                                    size="middle"
                                    className="flex-shrink-0 sm:w-full"
                                    style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Contact strip ─────────────────────────────────────────────
                    sm : stack dọc
                    md : 3 cột ngang
                ─────────────────────────────────────────────────────────────── */}
                <div className="border-t border-gray-800 py-6 sm:py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <ContactRow
                            icon={<Phone size={18} />}
                            title="Hotline"
                            content="1900 899 292"
                            href="tel:1900899292"
                        />
                        <ContactRow
                            icon={<Mail size={18} />}
                            title="Email"
                            content="support@lougcv.com"
                            href="mailto:support@lougcv.com"
                        />
                        <ContactRow
                            icon={<MapPin size={18} />}
                            title="Địa chỉ"
                            content={<>123 Đường Lê Lợi<br />Tp. Hồ Chí Minh</>}
                        />
                    </div>

                    {/* Footer links — wrap trên sm, 1 hàng từ md */}
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-4">
                        {['Về chúng tôi', 'Điều khoản sử dụng', 'Chính sách bảo mật', 'Liên hệ quảng cáo', 'Sitemap'].map(
                            (label, i, arr) => (
                                <span key={label} className="flex items-center gap-3 sm:gap-4">
                                    <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-xs sm:text-sm">
                                        {label}
                                    </a>
                                    {i < arr.length - 1 && (
                                        <span className="text-gray-700 hidden sm:inline">|</span>
                                    )}
                                </span>
                            )
                        )}
                    </div>
                </div>

                {/* ── Copyright ── */}
                <div className="border-t border-gray-800 py-4 sm:py-5
                                flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                        © 2024 LOUGCV. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs sm:text-sm">
                        <span>Made with</span>
                        <span className="text-emerald-400 text-base">♥</span>
                        <span>by LOUGCV Team</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
