import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout, Drawer } from 'antd';
import Sidebar from '../../common/admin/Sidebar';
import Header from '../../common/admin/Header';

const { Content } = Layout;

const AdminLayout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Layout className="min-h-screen">
            <aside className="hidden lg:block w-64 fixed left-0 top-0 bottom-0 overflow-auto">
                <Sidebar />
            </aside>

            <Drawer
                placement="left"
                closable={false}
                onClose={toggleDrawer}
                open={drawerOpen}
                width={256}
                styles={{ body: { padding: 0 } }}
            >
                <Sidebar />
            </Drawer>

            <Layout className="lg:ml-64">
                <Header onMenuClick={toggleDrawer} />
                <Content className="bg-gray-50 p-6">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
