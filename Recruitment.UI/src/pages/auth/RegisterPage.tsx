import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { RegisterPayload } from "../../types/auth"
import { authService } from "../../services/authService"
import { Button, Card, Form, Input, message, Select, Typography } from "antd"

const { Title, Text } = Typography
const { Option } = Select

const RegisterPage = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onFinish = async (values: any) => {
        setLoading(true)
        try {
            const payload: RegisterPayload = {
                ...values
            }

            await authService.register(payload)

            message.success("Đăng ký thành công! Vui lòng đăng nhập!")

            setTimeout(() => {
                navigate('/login')
            }, 1500)
        } catch (error: any) {
            console.error(error)
            const errorMsg = error.response?.data?.message || 'Đăng ký thất bại! Vui lòng đăng ký lại!'
            message.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div
                className="flex justify-center items-center min-h-screenbg-gray-50 py-10"
            >
                <Card
                    className="w-full max-w-md shadow-xl rounded-xl"
                >
                    <div className="text-center mb-6">
                        <Title level={2} className="mb-2! text-blue-600!">
                            Đăng ký
                        </Title>
                        <Text type="secondary">
                            Tạo tài khoản mới để bắt đầu
                        </Text>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ roleId: 3 }}
                        size="large"
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập vào họ và tên!' }]}
                        >
                            <Input placeholder="Ví dụ: Nguyễn Thành Long" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập vào email!' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                        >
                            <Input placeholder="Ví dụ: long@gmail.com" />
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: 'Vui lòng nhập vào số điện thoại!' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 số' }
                            ]}
                        >
                            <Input placeholder="Ví dụ: 1234567890" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập vào mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
                                    }
                                })
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Bạn là ai"
                            name="roleId"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                        >
                            <Select placeholder="Chọn vai trò">
                                {/* Lưu ý: Value phải khớp với ID trong Database của bạn */}
                                <Option value={3}>Ứng viên (Tìm việc)</Option>
                                <Option value={2}>Nhà tuyển dụng (Đăng tin)</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            className="mt-8"
                        >
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                className="bg-blue-600 hover:bg-blue-500 font-semibold h-12 rounded-lg"
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>

                        <div className="text-center mt-4">
                            <Text>Đã có tài khoản?</Text>
                            <Link
                                to="/login"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>
                    </Form>
                </Card>
            </div>
        </>
    )
}

export default RegisterPage