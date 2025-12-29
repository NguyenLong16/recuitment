// src/components/layout/HRLayout.tsx
import { Outlet } from 'react-router-dom';

const HRLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar dành cho HR */}
            {/* Bạn có thể truyền props role="HR" vào Sidebar để nó hiện menu của HR */}

            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {/* <Outlet /> là nơi các page con (HRDashboard, JobPost...) sẽ hiển thị */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default HRLayout;