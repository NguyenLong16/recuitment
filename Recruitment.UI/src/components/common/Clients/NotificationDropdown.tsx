import { useEffect, useState, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { deleteNotification, fetchNotification, markNotificationAsRead } from '../../../redux/slices/notificationSlice';
import { Notification } from '../../../types/notification';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationDropdown = () => {
    const dispatch = useAppDispatch();
    const { notifications, unreadCount, loading } = useAppSelector(state => state.notifications);
    const [open, setOpen] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchNotification());
    }, [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.isRead) {
            await dispatch(markNotificationAsRead(notif.id));
        }
        setSelectedNotif(notif);
        setDetailModalOpen(true);
        setOpen(false);
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        await dispatch(deleteNotification(id));
    };

    return (
        <>
            {/* Notification Button */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen(!open)}
                    className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <Bell size={22} strokeWidth={2} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-semibold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown Panel */}
                {open && (
                    <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
                        {/* Header */}
                        <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Bell size={20} className="text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
                            </div>
                            {unreadCount > 0 && (
                                <span className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                    {unreadCount} chưa đọc
                                </span>
                            )}
                        </div>

                        {/* Notification List */}
                        <div className="overflow-y-auto max-h-[420px] custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <p className="text-sm text-gray-500">Đang tải...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-6">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <Bell size={28} className="text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">Không có thông báo nào</p>
                                    <p className="text-xs text-gray-400 mt-1">Bạn sẽ nhận được thông báo ở đây</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleNotificationClick(item)}
                                            className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 group ${!item.isRead ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            {/* Unread Indicator */}
                                            <div className="flex-shrink-0 mt-1.5">
                                                {!item.isRead ? (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                                                ) : (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-semibold mb-1 truncate ${!item.isRead ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
                                                    {item.content}
                                                </p>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {dayjs(item.createDate).fromNow()}
                                                </span>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Bell size={20} className="text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Chi tiết thông báo</h3>
                            </div>
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        {selectedNotif && (
                            <div className="px-6 py-6 space-y-5">
                                {/* Title Section */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                                        Tiêu đề
                                    </label>
                                    <h4 className="text-lg font-bold text-gray-900 leading-snug">
                                        {selectedNotif.title}
                                    </h4>
                                </div>

                                {/* Content Section */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                                        Nội dung
                                    </label>
                                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedNotif.content}
                                        </p>
                                    </div>
                                </div>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>📅</span>
                                        <span className="font-medium">
                                            {dayjs(selectedNotif.createDate).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        {selectedNotif.isRead ? (
                                            <>
                                                <Check size={16} className="text-green-600" />
                                                <span className="font-medium text-green-600">Đã đọc</span>
                                            </>
                                        ) : (
                                            <span className="font-medium text-orange-500">Chưa đọc</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setDetailModalOpen(false)}
                                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/20"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
};

export default NotificationDropdown;
