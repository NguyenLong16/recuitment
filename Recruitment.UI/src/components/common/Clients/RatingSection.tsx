import { useState, useEffect } from 'react';
import { Button, Card, Input, message, Rate, Space, Typography, Avatar, List } from 'antd';
import { StarFilled, StarOutlined, UserOutlined } from '@ant-design/icons';
import ReviewService from '../../../services/reviewService';
import { ReviewResponse } from '../../../types/review';
import dayjs from 'dayjs';
const { TextArea } = Input;
const { Title, Text } = Typography;
interface RatingSectionProps {
    jobId: number;
    averageRating: number;
    totalReviews: number;
    onRatingSubmitted?: () => void;
}

const RatingSection = ({ jobId, averageRating, totalReviews, onRatingSubmitted }: RatingSectionProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [avgRating, setAvgRating] = useState(averageRating);
    const [totalCount, setTotalCount] = useState(totalReviews);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        fetchReviews();
    }, [jobId]);

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const res = await ReviewService.getJobReviews(jobId);
            setReviews(res.reviews || []);
            setAvgRating(res.averageRating ?? 0);
            setTotalCount(res.totalReviews ?? 0);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá');
            return;
        }
        setSubmitting(true);
        try {
            await ReviewService.postReview(jobId, {
                rating,
                comment: comment.trim() || undefined
            });
            message.success('Đánh giá thành công!');
            setRating(0);
            setComment('');
            onRatingSubmitted?.();
            fetchReviews();
        } catch (error: any) {
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const ratingDescriptions = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

    return (
        <>
            <Card
                title={
                    <span>
                        <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                        Đánh giá
                    </span>
                }
                style={{ marginBottom: 16, borderRadius: 12 }}
            >
                {/* Average Rating Display */}
                <div
                    style={{
                        textAlign: 'center',
                        padding: '24px 0',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: 24
                    }}
                >
                    <div style={{ marginBottom: 8 }}>
                        <Title level={1} style={{ margin: 0, color: '#faad14' }}>
                            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                        </Title>
                    </div>
                    <Rate
                        disabled
                        allowHalf
                        value={avgRating}
                        style={{ fontSize: 24 }}
                    />
                    <div style={{ marginTop: 8 }}>
                        <Text type="secondary">
                            {totalCount > 0
                                ? `${totalCount} đánh giá`
                                : 'Chưa có đánh giá'}
                        </Text>
                    </div>
                </div>
                {/* Rating Form */}
                {isLoggedIn ? (
                    <div>
                        <Title level={5}>Đánh giá của bạn</Title>
                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div style={{ textAlign: 'center' }}>
                                <Rate
                                    value={rating}
                                    onChange={setRating}
                                    style={{ fontSize: 32 }}
                                    tooltips={ratingDescriptions}
                                />
                                {rating > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <Text type="secondary">
                                            {ratingDescriptions[rating - 1]}
                                        </Text>
                                    </div>
                                )}
                            </div>
                            <TextArea
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Nhận xét của bạn (không bắt buộc)..."
                            />
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={submitting}
                                block
                                size="large"
                                style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                                icon={<StarFilled />}
                            >
                                Gửi đánh giá
                            </Button>
                        </Space>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: 16,
                            background: '#f5f5f5',
                            borderRadius: 8
                        }}
                    >
                        <Text type="secondary">
                            Vui lòng <a href="/login">đăng nhập</a> để đánh giá
                        </Text>
                    </div>
                )}

                {/* Danh sách reviews */}
                {reviews.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <Title level={5}>Đánh giá ({reviews.length})</Title>
                        <List
                            loading={loadingReviews}
                            dataSource={reviews}
                            renderItem={(item: ReviewResponse) => (
                                <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <List.Item.Meta
                                        avatar={
                                            item.userAvatar ? (
                                                <Avatar src={item.userAvatar} />
                                            ) : (
                                                <Avatar icon={<UserOutlined />} />
                                            )
                                        }
                                        title={
                                            <Space>
                                                <Text strong>{item.userName}</Text>
                                                <Rate disabled value={item.rating} style={{ fontSize: 12 }} />
                                            </Space>
                                        }
                                        description={
                                            <div>
                                                {item.comment && <Text>{item.comment}</Text>}
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {dayjs(item.createdDate).format('DD/MM/YYYY HH:mm')}
                                                    </Text>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                )}
            </Card>
        </>
    )
}

export default RatingSection