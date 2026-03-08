import { useEffect, useState } from "react";
import { CommentResponse } from "../../../types/comment";
import commentService from "../../../services/commentService";
import { Avatar, Button, Input, message, Spin, Typography } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import {
    CommentOutlined,
    SendOutlined,
    UserOutlined,
    MessageOutlined,
    CloseOutlined,
    DownOutlined,
    UpOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../../hooks/hook";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { TextArea } = Input;
const { Text } = Typography;

// Số bình luận hiển thị mặc định mỗi cấp
const ROOT_PAGE_SIZE = 3;
const REPLY_PAGE_SIZE = 2;

interface CommentSectionProps {
    jobId: number;
    totalComments: number;
}

/* ─── Item comment (đệ quy, hỗ trợ collapse replies) ─── */
interface CommentItemProps {
    comment: CommentResponse;
    jobId: number;
    isLoggedIn: boolean;
    currentUserId?: number;
    onRefresh: () => void;
    depth?: number;
}

const CommentItem = ({ comment, jobId, isLoggedIn, currentUserId, onRefresh, depth = 0 }: CommentItemProps) => {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    // Số replies hiển thị
    const [visibleReplies, setVisibleReplies] = useState(REPLY_PAGE_SIZE);

    const canReply = isLoggedIn;
    const indentLeft = Math.min(depth, 3) * 28;
    const replies = comment.replies ?? [];
    const hiddenRepliesCount = replies.length - visibleReplies;

    const handleReply = async () => {
        if (!replyContent.trim()) {
            message.warning("Vui lòng nhập nội dung phản hồi");
            return;
        }
        setSubmitting(true);
        try {
            await commentService.postComment(jobId, {
                content: replyContent.trim(),
                parentId: comment.id,
            });
            message.success("Đã gửi phản hồi!");
            setReplyContent("");
            setReplyOpen(false);
            onRefresh();
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const handleShowMoreReplies = () => {
        setVisibleReplies((prev) => prev + REPLY_PAGE_SIZE);
    };

    const handleCollapseReplies = () => {
        setVisibleReplies(REPLY_PAGE_SIZE);
    };

    return (
        <div style={{ marginLeft: indentLeft, marginBottom: 12 }}>
            {/* Bubble bình luận */}
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 14px",
                    background: depth === 0 ? "#fff" : "#f9fafb",
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: depth === 0 ? "#e5e7eb" : "#f0f1f3",
                    boxShadow: depth === 0 ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                }}
            >
                {/* Avatar */}
                <Avatar
                    src={comment.userAvatar}
                    icon={<UserOutlined />}
                    size={depth === 0 ? 38 : 30}
                    style={{ flexShrink: 0, backgroundColor: "#00B14F" }}
                />

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <Text strong style={{ fontSize: depth === 0 ? 14 : 13 }}>
                            {comment.userName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {dayjs(comment.createdDate).fromNow()}
                        </Text>
                    </div>

                    <Text
                        style={{
                            whiteSpace: "pre-wrap",
                            fontSize: depth === 0 ? 14 : 13,
                            color: "#374151",
                        }}
                    >
                        {comment.content}
                    </Text>

                    {/* Nút Trả lời */}
                    {canReply && (
                        <div style={{ marginTop: 6 }}>
                            <Button
                                type="link"
                                size="small"
                                icon={replyOpen ? <CloseOutlined /> : <MessageOutlined />}
                                onClick={() => {
                                    setReplyOpen(!replyOpen);
                                    setReplyContent("");
                                }}
                                style={{
                                    padding: 0,
                                    height: "auto",
                                    color: replyOpen ? "#9ca3af" : "#00B14F",
                                    fontWeight: 500,
                                    fontSize: 12,
                                }}
                            >
                                {replyOpen ? "Hủy" : "Trả lời"}
                            </Button>
                        </div>
                    )}

                    {/* Form reply */}
                    {replyOpen && (
                        <div
                            style={{
                                marginTop: 10,
                                padding: "10px 12px",
                                background: "#f0fdf4",
                                borderRadius: 8,
                                border: "1px solid #bbf7d0",
                            }}
                        >
                            <div style={{ marginBottom: 4, fontSize: 12, color: "#6b7280" }}>
                                Trả lời{" "}
                                <Text strong style={{ color: "#00B14F", fontSize: 12 }}>
                                    @{comment.userName}
                                </Text>
                            </div>
                            <TextArea
                                rows={2}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Trả lời ${comment.userName}...`}
                                style={{ marginBottom: 8, borderColor: "#86efac" }}
                                onPressEnter={(e) => {
                                    if (!e.shiftKey) {
                                        e.preventDefault();
                                        handleReply();
                                    }
                                }}
                                autoFocus
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                <Button
                                    size="small"
                                    onClick={() => { setReplyOpen(false); setReplyContent(""); }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<SendOutlined />}
                                    onClick={handleReply}
                                    loading={submitting}
                                    style={{ backgroundColor: "#00B14F", borderColor: "#00B14F" }}
                                >
                                    Gửi
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Replies lồng nhau ── */}
            {replies.length > 0 && (
                <div style={{ marginTop: 6 }}>
                    {replies.slice(0, visibleReplies).map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            jobId={jobId}
                            isLoggedIn={isLoggedIn}
                            currentUserId={currentUserId}
                            onRefresh={onRefresh}
                            depth={depth + 1}
                        />
                    ))}

                    {/* Nút Xem thêm phản hồi */}
                    {hiddenRepliesCount > 0 && (
                        <button
                            onClick={handleShowMoreReplies}
                            style={{
                                marginLeft: 8,
                                marginTop: 4,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#00B14F",
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "2px 6px",
                                borderRadius: 6,
                            }}
                        >
                            <DownOutlined style={{ fontSize: 10 }} />
                            Xem thêm {hiddenRepliesCount} phản hồi
                        </button>
                    )}

                    {/* Nút Thu gọn replies – hiện ngay khi đã expand */}
                    {visibleReplies > REPLY_PAGE_SIZE && (
                        <button
                            onClick={handleCollapseReplies}
                            style={{
                                marginLeft: 8,
                                marginTop: 4,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#6b7280",
                                fontSize: 12,
                                fontWeight: 500,
                                padding: "2px 6px",
                                borderRadius: 6,
                            }}
                        >
                            <UpOutlined style={{ fontSize: 10 }} />
                            Ẩn bớt
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Component chính ─── */
const CommentSection = ({ jobId, totalComments }: CommentSectionProps) => {
    const user = useAppSelector((state) => state.auth.user);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState("");
    // Phân trang bình luận gốc
    const [visibleRoots, setVisibleRoots] = useState(ROOT_PAGE_SIZE);

    useEffect(() => {
        fetchComments();
    }, [jobId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await commentService.getJobComment(jobId);
            setComments(buildTree(data));
            // Reset về trang đầu khi reload
            setVisibleRoots(ROOT_PAGE_SIZE);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Build cây comment từ flat list
     * - Comment gốc: parentId === null/undefined
     * - Reply: parentId !== null
     */
    const buildTree = (flat: CommentResponse[]): CommentResponse[] => {
        const map = new Map<number, CommentResponse>();
        const roots: CommentResponse[] = [];

        flat.forEach((c) => map.set(c.id, { ...c, replies: [] }));

        map.forEach((c) => {
            if (c.parentId) {
                const parent = map.get(c.parentId);
                if (parent) {
                    parent.replies = parent.replies || [];
                    parent.replies.push(c);
                } else {
                    roots.push(c);
                }
            } else {
                roots.push(c);
            }
        });

        return roots;
    };

    const handleSubmit = async () => {
        if (!content.trim()) {
            message.warning("Vui lòng nhập nội dung bình luận");
            return;
        }
        setSubmitting(true);
        try {
            await commentService.postComment(jobId, { content: content.trim() });
            message.success("Đăng bình luận thành công!");
            setContent("");
            fetchComments();
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const hiddenRootsCount = comments.length - visibleRoots;

    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                marginBottom: 16,
                overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#fafafa",
                }}
            >
                <CommentOutlined style={{ color: "#00B14F", fontSize: 18 }} />
                <Text strong style={{ fontSize: 15 }}>
                    Bình luận
                </Text>
                <span
                    style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "1px 8px",
                        borderRadius: 99,
                    }}
                >
                    {totalComments}
                </span>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Comment Form */}
                {user ? (
                    <div
                        style={{
                            marginBottom: 24,
                            padding: 14,
                            background: "#f9fafb",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <Avatar
                                src={user.avatarUrl}
                                icon={<UserOutlined />}
                                size={38}
                                style={{ flexShrink: 0, backgroundColor: "#00B14F" }}
                            />
                            <div style={{ flex: 1 }}>
                                <TextArea
                                    rows={2}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Viết bình luận của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
                                    style={{ marginBottom: 10, resize: "none" }}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleSubmit}
                                        loading={submitting}
                                        style={{ backgroundColor: "#00B14F", borderColor: "#00B14F" }}
                                    >
                                        Gửi bình luận
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 16,
                            background: "#f5f5f5",
                            borderRadius: 8,
                            marginBottom: 24,
                        }}
                    >
                        <Text type="secondary">
                            Vui lòng <a href="/login">đăng nhập</a> để bình luận
                        </Text>
                    </div>
                )}

                {/* Comment List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: 32 }}>
                        <Spin tip="Đang tải bình luận..." />
                    </div>
                ) : comments.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: 32,
                            color: "#9ca3af",
                            fontSize: 14,
                        }}
                    >
                        <CommentOutlined style={{ fontSize: 32, marginBottom: 8, display: "block" }} />
                        Chưa có bình luận nào. Hãy là người đầu tiên!
                    </div>
                ) : (
                    <div>
                        {comments.slice(0, visibleRoots).map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                jobId={jobId}
                                isLoggedIn={!!user}
                                currentUserId={user?.id}
                                onRefresh={fetchComments}
                                depth={0}
                            />
                        ))}

                        {/* ── Nút Xem thêm bình luận gốc ── */}
                        {hiddenRootsCount > 0 && (
                            <button
                                onClick={() => setVisibleRoots((v) => v + ROOT_PAGE_SIZE)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    width: "100%",
                                    marginTop: 12,
                                    padding: "9px 0",
                                    background: "#f0fdf4",
                                    border: "1px dashed #86efac",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    color: "#00B14F",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#dcfce7")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#f0fdf4")}
                            >
                                <DownOutlined style={{ fontSize: 11 }} />
                                Xem thêm {hiddenRootsCount} bình luận
                            </button>
                        )}

                        {/* ── Nút Ẩn bớt bình luận gốc – hiện ngay khi đã expand ── */}
                        {visibleRoots > ROOT_PAGE_SIZE && (
                            <button
                                onClick={() => setVisibleRoots(ROOT_PAGE_SIZE)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    width: "100%",
                                    marginTop: 8,
                                    padding: "9px 0",
                                    background: "#f9fafb",
                                    border: "1px dashed #d1d5db",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#f9fafb")}
                            >
                                <UpOutlined style={{ fontSize: 11 }} />
                                Ẩn bớt
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;