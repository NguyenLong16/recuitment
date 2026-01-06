// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component tự động scroll lên đầu trang mỗi khi đổi route
 * Đặt component này bên trong <BrowserRouter> nhưng ngoài <Routes>
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Smooth scroll, đổi thành 'auto' nếu muốn nhảy ngay
        });
    }, [pathname]);

    return null;  // Component không render gì
};

export default ScrollToTop;
