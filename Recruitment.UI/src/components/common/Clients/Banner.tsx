import { Carousel } from 'antd';
import 'antd/dist/reset.css';

const slides = [
    {
        url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Tìm việc làm mơ ước',
        subtitle: 'Hơn 10,000 cơ hội việc làm đang chờ bạn',
    },
    {
        url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Kết nối nhà tuyển dụng',
        subtitle: 'Hàng nghìn doanh nghiệp hàng đầu Việt Nam',
    },
    {
        url: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Phát triển sự nghiệp',
        subtitle: 'Nâng tầm kỹ năng và bứt phá trong sự nghiệp',
    },
    {
        url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
        title: 'Tương lai thuộc về bạn',
        subtitle: 'Bắt đầu hành trình mới ngay hôm nay',
    },
];

const Banner = () => {
    return (
        /*
         * Responsive height:
         *   sm  (< 768px)  : 220px
         *   md  (768–1023) : 360px
         *   lg  (≥ 1024px) : 480px
         *
         * Dùng CSS variable để đồng bộ giữa wrapper, Carousel và slide
         */
        <div className="w-full overflow-hidden">
            <Carousel
                autoplay
                autoplaySpeed={4000}
                effect="fade"
                dots
                dotPosition="bottom"
            >
                {slides.map((slide, idx) => (
                    <div key={idx} tabIndex={-1}>
                        {/* ── Slide wrapper: height responsive qua Tailwind ── */}
                        <div className="relative w-full h-[220px] md:h-[360px] lg:h-[480px]">

                            {/* Ảnh nền */}
                            <img
                                src={slide.url}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                draggable={false}
                                loading={idx === 0 ? 'eager' : 'lazy'}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                            {/* Text content — căn giữa theo màn hình */}
                            <div className="absolute inset-0 flex flex-col justify-end pb-6 px-4
                                            sm:pb-8 sm:px-8
                                            md:pb-10 md:px-12
                                            lg:pb-14 lg:px-16">

                                {/* Badge nhỏ — ẩn trên sm */}
                                <span className="hidden sm:inline-block w-fit mb-2 px-3 py-1 rounded-full
                                                 bg-emerald-500/80 text-white text-xs font-semibold tracking-wide uppercase">
                                    LOUGCV · Tuyển Dụng
                                </span>

                                {/* Tiêu đề chính */}
                                <h2 className="text-white font-bold leading-tight
                                               text-xl
                                               sm:text-2xl
                                               md:text-3xl
                                               lg:text-4xl xl:text-5xl
                                               drop-shadow-lg">
                                    {slide.title}
                                </h2>

                                {/* Phụ đề — ẩn trên sm */}
                                <p className="hidden sm:block mt-1 md:mt-2
                                              text-white/85
                                              text-sm md:text-base lg:text-lg
                                              drop-shadow">
                                    {slide.subtitle}
                                </p>

                                {/* CTA button — chỉ hiện từ md trở lên */}
                                <div className="hidden md:flex mt-4 md:mt-5 gap-3">
                                    <a
                                        href="/"
                                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600
                                                   text-white font-semibold rounded-full text-sm
                                                   transition-all shadow-lg hover:shadow-emerald-500/40"
                                    >
                                        Tìm việc ngay
                                    </a>
                                    <a
                                        href="/register"
                                        className="px-5 py-2.5 bg-white/20 hover:bg-white/30
                                                   text-white font-semibold rounded-full text-sm
                                                   backdrop-blur-sm transition-all border border-white/40"
                                    >
                                        Đăng ký miễn phí
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Banner;
