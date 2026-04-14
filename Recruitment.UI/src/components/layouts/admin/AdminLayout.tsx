import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Drawer } from 'antd';
import Sidebar from '../../common/admin/Sidebar';
import Header from '../../common/admin/Header';

const { Content } = Layout;

const AdminLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => setDrawerOpen((prev) => !prev);
    const closeDrawer  = () => setDrawerOpen(false);

    return (
        <Layout className="min-h-screen bg-gray-50">

            {/* ─── Sidebar cố định: chỉ hiện >= lg ─── */}
            <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 overflow-y-auto z-50 shadow-md">
                <Sidebar />
            </aside>

            {/* ─── Drawer: dùng cho sm và md (< lg) ─── */}
            <Drawer
                placement="left"
                closable={false}
                onClose={closeDrawer}
                open={drawerOpen}
                width={256}
                styles={{ body: { padding: 0 } }}
                className="lg:hidden"
            >
                <Sidebar onClose={closeDrawer} />
            </Drawer>

            {/* ─── Main content area ─── */}
            <Layout className="lg:ml-64 min-h-screen">

                <Header onMenuClick={toggleDrawer} />

                {/* padding: nhỏ trên sm, vừa trên md, lớn trên lg */}
                <Content className="bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">
                    <Outlet />
                </Content>

            </Layout>
        </Layout>
    );
};

export default AdminLayout;
