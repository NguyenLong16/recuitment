// src/pages/auth/Login.tsx
import { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/slices/authSlice'; // Bỏ clearError nếu không dùng
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { Role } from '../../types/auth';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, user } = useAppSelector((state) => state.auth);

    // Nếu user đã tồn tại (do F5 hoặc login xong) thì điều hướng
    useEffect(() => {
        if (user) {
            if (user.role === Role.Admin) navigate('/admin/dashboard'); // 1 = Admin
            else if (user.role === Role.Employer) navigate('/hr/dashboard'); // 2 = HR
            else navigate('/');
        }
    }, [user, navigate]);

    const onFinish = async (values: any) => {
        try {
            // 1. Dispatch action
            await dispatch(loginUser({
                email: values.email,
                password: values.password
            })).unwrap();

            // 2. Không cần truy cập resultAction ở đây nữa
            // Vì useEffect bên trên sẽ tự động chạy khi state.auth.user thay đổi
            // và thực hiện điều hướng.
            message.success('Đăng nhập thành công!');

        } catch (err: any) {
            console.error(err);
            message.error(typeof err === 'string' ? err : 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <Card className="w-96 shadow-lg rounded-xl">
                <Typography.Title level={3} className="text-center !mb-6">Đăng nhập</Typography.Title>

                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={isLoading}
                        className="bg-blue-600"
                    >
                        Đăng nhập
                    </Button>

                    <div className="mt-4 text-center">
                        Chưa có tài khoản? <Link to="/register" className="text-blue-600">Đăng ký ngay</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage