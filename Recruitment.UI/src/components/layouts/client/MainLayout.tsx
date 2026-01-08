import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../common/Clients/Header';
import Footer from '../../common/Clients/Footer';
import Banner from '../../common/Clients/Banner';
import { useAppSelector } from '../../../hooks/hook';
import { Role } from '../../../types/auth';

const MainLayout = () => {
    const location = useLocation();
    const { user } = useAppSelector(state => state.auth);

    const isHome = location.pathname === "/";
    const isCandidateOrGuest =
        !user || user.role === Role.Candidate;
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            {isHome && isCandidateOrGuest && <Banner />}
            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
