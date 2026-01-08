import { Carousel } from 'antd';
import 'antd/dist/reset.css';

const Banner = () => {
    const images = [
        {
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920',
            title: 'Modern Technology',
        },
        {
            url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920',
            title: 'Digital Innovation',
        },
        {
            url: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1920',
            title: 'Creative Design',
        },
        {
            url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1920',
            title: 'Future Vision',
        },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto">
            <Carousel
                autoplay
                autoplaySpeed={3000}
                effect="fade"
                dots={true}
                dotPosition="bottom"
            >
                {images.map((image, index) => (
                    <div key={index} className="relative">
                        <div className="h-[500px] w-full overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                <div className="p-8 text-white">
                                    <h2 className="text-4xl font-bold mb-2">{image.title}</h2>
                                    <p className="text-lg">Discover amazing content</p>
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
