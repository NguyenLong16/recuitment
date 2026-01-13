import { Notification } from "../types/notification";
import axiosClient from "./axiosClient";

const NotificationService = {
    getMyNotifications: async (): Promise<Notification[]> => {
        const response = await axiosClient.get('/Notification')
        return response.data
    },
    getUnreadCount: async (): Promise<number> => {
        const response = await axiosClient.get('/Notification/unread-count')
        return response.data
    },
    markAsRead: async (id: number): Promise<void> => {
        await axiosClient.patch(`/Notification/${id}/read`)
    },
    deleteNotification: async (id: number): Promise<void> => {
        await axiosClient.delete(`/Notification/${id}`);
    }
}

export default NotificationService