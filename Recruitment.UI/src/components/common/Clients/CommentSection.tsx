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

const ROOT_PAGE_SIZE = 3;
const REPLY_PAGE_SIZE = 2;

interface CommentSectionProps {
    jobId: number;
    totalComments: number;
}

interface CommentItemProps {
    comment: CommentResponse;
    jobId: number;
    isLoggedIn: boolean;
    onRefresh: () => void;
    depth?: number;
}

/* ─── CommentItem (đệ quy) ───────────────────────────────────────────────────── */
const CommentItem = ({ comment, jobId, isLoggedIn, onRefresh, depth = 0 }: CommentItemProps) => {
    const [replyOpen, setReplyOpen] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [visibleReplies, setVisibleReplies] = useState(REPLY_PAGE_SIZE);

    const replies = comment.replies ?? [];
    const hiddenRepliesCount = replies.length - visibleReplies;

    // Indent: sm nhỏ hơn, md/lg bình thường
    const indentClass =
        depth === 0 ? "" :
        depth === 1 ? "ml-6 sm:ml-8 md:ml-10" :
        depth === 2 ? "ml-10 sm:ml-14 md:ml-16" :
                      "ml-12 sm:ml-16 md:ml-20";

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

    return (
        <div className={`${indentClass} mb-2.5`}>
            {/* ── Bubble ── */}
            <div
                className={`flex gap-2 sm:gap-2.5 p-2.5 sm:p-3 md:p-3.5 rounded-xl border
                    ${depth === 0
                        ? "bg-white border-gray-200 shadow-sm"
                        : "bg-gray-50 border-gray-100"
                    }`}
            >
                {/* Avatar — nhỏ hơn trên sm */}
                <Avatar
                    src={comment.userAvatar}
                    icon={<UserOutlined />}
                    size={depth === 0 ? 34 : 28}
                    className="flex-shrink-0 bg-emerald-500 sm:w-9 sm:h-9"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name + time */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                        <Text strong className={`${depth === 0 ? "text-sm" : "text-xs sm:text-sm"}`}>
                            {comment.userName}
                        </Text>
                        <Text type="secondary" className="text-[11px]">
                            {dayjs(comment.createdDate).fromNow()}
                        </Text>
                    </div>

                    {/* Body */}
                    <Text
                        className={`whitespace-pre-wrap text-gray-700
                            ${depth === 0 ? "text-sm" : "text-xs sm:text-sm"}`}
                    >
                        {comment.content}
                    </Text>

                    {/* Reply button */}
                    {isLoggedIn && (
                        <div className="mt-1.5">
                            <Button
                                type="link"
                                size="small"
                                icon={replyOpen ? <CloseOutlined /> : <MessageOutlined />}
                                onClick={() => { setReplyOpen(!replyOpen); setReplyContent(""); }}
                                className="p-0 h-auto font-medium text-xs"
                                style={{ color: replyOpen ? "#9ca3af" : "#00B14F" }}
                            >
                                {replyOpen ? "Hủy" : "Trả lời"}
                            </Button>
                        </div>
                    )}

                    {/* Reply form */}
                    {replyOpen && (
                        <div className="mt-2.5 p-2.5 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="mb-1.5 text-xs text-gray-500">
                                Trả lời{" "}
                                <Text strong className="text-emerald-600 text-xs">
                                    @{comment.userName}
                                </Text>
                            </div>
                            <TextArea
                                rows={2}
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Trả lời ${comment.userName}...`}
                                className="mb-2 text-sm"
                                style={{ borderColor: "#86efac", resize: "none" }}
                                onPressEnter={(e) => {
                                    if (!e.shiftKey) { e.preventDefault(); handleReply(); }
                                }}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="small" onClick={() => { setReplyOpen(false); setReplyContent(""); }}>
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

            {/* ── Nested replies ── */}
            {replies.length > 0 && (
                <div className="mt-1.5">
                    {replies.slice(0, visibleReplies).map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            jobId={jobId}
                            isLoggedIn={isLoggedIn}
                            onRefresh={onRefresh}
                            depth={depth + 1}
                        />
                    ))}

                    {/* Xem thêm replies */}
                    {hiddenRepliesCount > 0 && (
                        <button
                            onClick={() => setVisibleReplies((p) => p + REPLY_PAGE_SIZE)}
                            className="ml-2 mt-1 inline-flex items-center gap-1 text-emerald-600
                                       text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-green-50 transition-colors"
                        >
                            <DownOutlined className="text-[10px]" />
                            Xem thêm {hiddenRepliesCount} phản hồi
                        </button>
                    )}

                    {/* Thu gọn replies */}
                    {visibleReplies > REPLY_PAGE_SIZE && (
                        <button
                            onClick={() => setVisibleReplies(REPLY_PAGE_SIZE)}
                            className="ml-2 mt-1 inline-flex items-center gap-1 text-gray-400
                                       text-xs font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors"
                        >
                            <UpOutlined className="text-[10px]" />
                            Ẩn bớt
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── CommentSection chính ───────────────────────────────────────────────────── */
const CommentSection = ({ jobId, totalComments }: CommentSectionProps) => {
    const user = useAppSelector((state) => state.auth.user);

    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [visibleRoots, setVisibleRoots] = useState(ROOT_PAGE_SIZE);

    useEffect(() => { fetchComments(); }, [jobId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await commentService.getJobComment(jobId);
            setComments(buildTree(data));
            setVisibleRoots(ROOT_PAGE_SIZE);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const buildTree = (flat: CommentResponse[]): CommentResponse[] => {
        const map = new Map<number, CommentResponse>();
        const roots: CommentResponse[] = [];
        flat.forEach((c) => map.set(c.id, { ...c, replies: [] }));
        map.forEach((c) => {
            if (c.parentId) {
                const parent = map.get(c.parentId);
                if (parent) { parent.replies = parent.replies || []; parent.replies.push(c); }
                else roots.push(c);
            } else roots.push(c);
        });
        return roots;
    };

    const handleSubmit = async () => {
        if (!content.trim()) { message.warning("Vui lòng nhập nội dung bình luận"); return; }
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
        <div className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">

            {/* ── Header ── */}
            <div className="flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5 md:px-5
                            border-b border-gray-100 bg-gray-50">
                <CommentOutlined className="text-emerald-500 text-base sm:text-lg" />
                <Text strong className="text-sm sm:text-[15px]">Bình luận</Text>
                <span className="bg-green-100 text-green-700 text-xs font-semibold
                                 px-2 py-0.5 rounded-full">
                    {totalComments}
                </span>
            </div>

            {/* ── Body ── */}
            <div className="p-3 sm:p-4 md:p-5">

                {/* Comment Form */}
                {user ? (
                    <div className="mb-4 sm:mb-5 p-3 sm:p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex gap-2 sm:gap-2.5 items-start">
                            {/* Avatar: ẩn trên màn rất nhỏ */}
                            <Avatar
                                icon={<UserOutlined />}
                                size={34}
                                className="flex-shrink-0 bg-emerald-500 hidden xs:flex sm:flex"
                            />
                            <div className="flex-1">
                                <TextArea
                                    rows={2}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Viết bình luận... (Enter để gửi, Shift+Enter xuống dòng)"
                                    className="mb-2 text-sm"
                                    style={{ resize: "none" }}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) { e.preventDefault(); handleSubmit(); }
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    {/* Hint: chỉ hiện md trở lên */}
                                    <span className="hidden md:block text-xs text-gray-400">
                                        Enter để gửi · Shift+Enter xuống dòng
                                    </span>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleSubmit}
                                        loading={submitting}
                                        size="middle"
                                        style={{ backgroundColor: "#00B14F", borderColor: "#00B14F" }}
                                        className="ml-auto"
                                    >
                                        {/* Label: ẩn trên sm */}
                                        <span className="hidden sm:inline">Gửi bình luận</span>
                                        <span className="sm:hidden">Gửi</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-3 px-4 bg-gray-50 rounded-lg mb-4 text-sm text-gray-500">
                        Vui lòng <a href="/login" className="text-emerald-600 font-medium">đăng nhập</a> để bình luận
                    </div>
                )}

                {/* Comment List */}
                {loading ? (
                    <div className="text-center py-8">
                        <Spin tip="Đang tải bình luận..." />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <CommentOutlined className="text-3xl sm:text-4xl block mb-2" />
                        <span className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</span>
                    </div>
                ) : (
                    <div>
                        {comments.slice(0, visibleRoots).map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                jobId={jobId}
                                isLoggedIn={!!user}
                                onRefresh={fetchComments}
                                depth={0}
                            />
                        ))}

                        {/* Xem thêm comments gốc */}
                        {hiddenRootsCount > 0 && (
                            <button
                                onClick={() => setVisibleRoots((v) => v + ROOT_PAGE_SIZE)}
                                className="flex items-center justify-center gap-1.5 w-full mt-3
                                           py-2 sm:py-2.5
                                           bg-green-50 hover:bg-green-100
                                           border border-dashed border-green-300
                                           rounded-lg text-emerald-600 text-xs sm:text-sm font-semibold
                                           transition-colors"
                            >
                                <DownOutlined className="text-[11px]" />
                                Xem thêm {hiddenRootsCount} bình luận
                            </button>
                        )}

                        {/* Thu gọn */}
                        {visibleRoots > ROOT_PAGE_SIZE && (
                            <button
                                onClick={() => setVisibleRoots(ROOT_PAGE_SIZE)}
                                className="flex items-center justify-center gap-1.5 w-full mt-2
                                           py-2 sm:py-2.5
                                           bg-gray-50 hover:bg-gray-100
                                           border border-dashed border-gray-300
                                           rounded-lg text-gray-500 text-xs sm:text-sm font-medium
                                           transition-colors"
                            >
                                <UpOutlined className="text-[11px]" />
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