import { Outlet } from 'react-router-dom';
import Header from '../../common/Clients/Header';
import Footer from '../../common/Clients/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
