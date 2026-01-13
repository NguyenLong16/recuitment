import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification, NotificationState } from "../../types/notification";
import NotificationService from "../../services/notificationService";

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

export const fetchNotification = createAsyncThunk(
    'notification/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const data = await NotificationService.getMyNotifications()
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải thông báo')
        }
    }
)

export const fetchUnreadCount = createAsyncThunk(
    'notification/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const count = await NotificationService.getUnreadCount();
            return count;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi tải thông báo chưa đọc');
        }
    }
)


export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id: number, { rejectWithValue }) => {
        try {
            await NotificationService.markAsRead(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi đánh dấu thông báo đã đọc');
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await NotificationService.deleteNotification(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa thông báo');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotification.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotification.fulfilled, (state, action: PayloadAction<Notification[]>) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotification.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<number>) => {
                state.unreadCount = action.payload;
            })
            // Mark as read
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
                const notif = state.notifications.find(n => n.id === action.payload);
                if (notif && !notif.isRead) {
                    notif.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Delete
            .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<number>) => {
                const notif = state.notifications.find(n => n.id === action.payload);
                if (notif && !notif.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications = state.notifications.filter(n => n.id !== action.payload);
            })

    }
})

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;