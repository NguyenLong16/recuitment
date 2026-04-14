import { useState, useEffect } from 'react';
import { Button, Input, message, Rate, Typography, Avatar, Spin } from 'antd';
import { StarFilled, StarOutlined, UserOutlined } from '@ant-design/icons';
import ReviewService from '../../../services/reviewService';
import { ReviewResponse } from '../../../types/review';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface RatingSectionProps {
    jobId: number;
    averageRating: number;
    totalReviews: number;
    onRatingSubmitted?: () => void;
}

const ratingLabels = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];
const ratingColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#00B14F'];

const RatingSection = ({ jobId, averageRating, totalReviews, onRatingSubmitted }: RatingSectionProps) => {
    const [rating, setRating]           = useState(0);
    const [comment, setComment]         = useState('');
    const [submitting, setSubmitting]   = useState(false);
    const [reviews, setReviews]         = useState<ReviewResponse[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [avgRating, setAvgRating]     = useState(averageRating);
    const [totalCount, setTotalCount]   = useState(totalReviews);
    const isLoggedIn = !!localStorage.getItem('accessToken');

    useEffect(() => { fetchReviews(); }, [jobId]);

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
        if (rating === 0) { message.warning('Vui lòng chọn số sao đánh giá'); return; }
        setSubmitting(true);
        try {
            await ReviewService.postReview(jobId, {
                rating,
                comment: comment.trim() || undefined,
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

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4 overflow-hidden">

            {/* ── Card Header ── */}
            <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5
                            border-b border-gray-100 bg-gray-50">
                <StarOutlined className="text-amber-400 text-base sm:text-lg" />
                <Text strong className="text-sm sm:text-[15px]">Đánh giá</Text>
                {totalCount > 0 && (
                    <span className="bg-amber-50 text-amber-600 text-xs font-semibold
                                     px-2 py-0.5 rounded-full">
                        {totalCount}
                    </span>
                )}
            </div>

            <div className="p-3 sm:p-4 md:p-5">

                {/* ── Average Rating Display ─────────────────────────────────────
                    sm : score + sao nhỏ (font size nhỏ hơn)
                    md : score + sao + label số đánh giá
                    lg : đầy đủ
                ─────────────────────────────────────────────────────────────── */}
                <div className="text-center pb-4 sm:pb-5 mb-4 sm:mb-5 border-b border-gray-100">
                    {/* Score number */}
                    <div className="text-4xl sm:text-5xl font-bold text-amber-400 mb-1.5 leading-none">
                        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                    </div>

                    {/* Stars */}
                    <Rate
                        disabled
                        allowHalf
                        value={avgRating}
                        className="text-lg sm:text-xl md:text-2xl"
                    />

                    {/* Total count */}
                    <div className="mt-1.5 text-xs sm:text-sm text-gray-400">
                        {totalCount > 0 ? `${totalCount} đánh giá` : 'Chưa có đánh giá nào'}
                    </div>
                </div>

                {/* ── Rating Form ──────────────────────────────────────────────── */}
                {isLoggedIn ? (
                    <div className="space-y-3 sm:space-y-4">
                        <Title level={5} className="!m-0 !text-sm sm:!text-base">
                            Đánh giá của bạn
                        </Title>

                        {/* Star picker — nhỏ hơn trên sm */}
                        <div className="flex flex-col items-center gap-1.5 sm:gap-2
                                        py-3 sm:py-4 bg-amber-50 rounded-xl">
                            <Rate
                                value={rating}
                                onChange={setRating}
                                tooltips={ratingLabels}
                                className="text-2xl sm:text-3xl md:text-4xl"
                            />
                            {/* Label + màu tương ứng */}
                            <div className="h-5 flex items-center">
                                {rating > 0 && (
                                    <span
                                        className="text-xs sm:text-sm font-semibold transition-all"
                                        style={{ color: ratingColors[rating - 1] }}
                                    >
                                        {ratingLabels[rating - 1]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Textarea nhận xét */}
                        <TextArea
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Nhận xét của bạn (không bắt buộc)..."
                            className="text-sm"
                            style={{ resize: 'none' }}
                        />

                        {/* Submit button */}
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={submitting}
                            block
                            size="middle"
                            icon={<StarFilled />}
                            style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                            className="!font-semibold"
                        >
                            Gửi đánh giá
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-3 px-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                        Vui lòng{' '}
                        <a href="/login" className="text-amber-500 font-medium hover:text-amber-600">
                            đăng nhập
                        </a>{' '}
                        để đánh giá
                    </div>
                )}

                {/* ── Review List ──────────────────────────────────────────────── */}
                {reviews.length > 0 && (
                    <div className="mt-4 sm:mt-5">
                        <Text strong className="text-xs sm:text-sm text-gray-600 block mb-2 sm:mb-3">
                            Đánh giá ({reviews.length})
                        </Text>

                        {loadingReviews ? (
                            <div className="text-center py-6">
                                <Spin size="small" />
                            </div>
                        ) : (
                            <div className="space-y-2.5 sm:space-y-3">
                                {reviews.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-2 sm:gap-3 pb-2.5 sm:pb-3
                                                   border-b border-gray-100 last:border-0"
                                    >
                                        {/* Avatar — nhỏ hơn trên sm */}
                                        <Avatar
                                            src={item.userAvatar}
                                            icon={<UserOutlined />}
                                            size={30}
                                            className="flex-shrink-0 sm:w-8 sm:h-8 bg-amber-100 text-amber-600"
                                        />

                                        <div className="flex-1 min-w-0">
                                            {/* Name + stars */}
                                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-0.5">
                                                <Text strong className="text-xs sm:text-sm">
                                                    {item.userName}
                                                </Text>
                                                <Rate
                                                    disabled
                                                    value={item.rating}
                                                    className="text-[10px] sm:text-xs"
                                                    style={{ fontSize: 11 }}
                                                />
                                            </div>

                                            {/* Comment */}
                                            {item.comment && (
                                                <Text className="text-xs sm:text-sm text-gray-700 block mb-0.5">
                                                    {item.comment}
                                                </Text>
                                            )}

                                            {/* Date */}
                                            <Text type="secondary" className="text-[10px] sm:text-xs">
                                                {dayjs(item.createdDate).format('DD/MM/YYYY HH:mm')}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingSection;