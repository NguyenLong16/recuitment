import { useEffect, useState } from "react";
import { CommentResponse } from "../../../types/comment";
import commentService from "../../../services/commentService";
import { Avatar, Button, Card, Input, List, message, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/vi';
import { CommentOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../hooks/hook";

dayjs.extend(relativeTime);
dayjs.locale('vi');
const { TextArea } = Input;
const { Text } = Typography;
interface CommentSectionProps {
    jobId: number;
    totalComments: number;
}
const CommentSection = ({ jobId, totalComments }: CommentSectionProps) => {
    // Lấy user từ Redux store
    const user = useAppSelector(state => state.auth.user);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [jobId]);
    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await commentService.getJobComment(jobId);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            message.warning('Vui lòng nhập nội dung bình luận');
            return;
        }
        setSubmitting(true);
        try {
            await commentService.postComment(jobId, { content: content.trim() });
            message.success('Đăng bình luận thành công!');
            setContent('');
            fetchComments(); // Reload comments
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <>
            <Card
                title={
                    <span>
                        <CommentOutlined style={{ marginRight: 8 }} />
                        Bình luận ({totalComments})
                    </span>
                }
                style={{ marginBottom: 16, borderRadius: 12 }}
            >
                {/* Comment Form */}
                {user ? (
                    <div style={{ marginBottom: 24 }}>
                        <TextArea
                            rows={3}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Viết bình luận của bạn..."
                            style={{ marginBottom: 12 }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            loading={submitting}
                            style={{ backgroundColor: '#00B14F', borderColor: '#00B14F' }}
                        >
                            Gửi bình luận
                        </Button>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: 16,
                            background: '#f5f5f5',
                            borderRadius: 8,
                            marginBottom: 24
                        }}
                    >
                        <Text type="secondary">
                            Vui lòng <a href="/login">đăng nhập</a> để bình luận
                        </Text>
                    </div>
                )}
                {/* Comment List */}
                <List
                    loading={loading}
                    dataSource={comments}
                    locale={{ emptyText: 'Chưa có bình luận nào' }}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.userAvatar}
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#00B14F' }}
                                    />
                                }
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Text strong>{item.userName}</Text>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {dayjs(item.createdDate).fromNow()}
                                        </Text>
                                    </div>
                                }
                                description={
                                    <Text style={{ whiteSpace: 'pre-wrap' }}>
                                        {item.content}
                                    </Text>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </>
    )
}

export default CommentSection