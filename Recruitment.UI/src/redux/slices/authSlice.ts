import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/auth';
import { authService } from '../../services/authService';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

// Helper: Lấy user từ localStorage an toàn (tránh lỗi JSON undefined)
const getUserFromLocalStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== "undefined") {
            return JSON.parse(userStr);
        }
        return null;
    } catch {
        return null;
    }
};

const initialState: AuthState = {
    user: getUserFromLocalStorage(),
    isLoading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(userData);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                // Ưu tiên lấy message từ backend
                return rejectWithValue(error.response.data.message || error.response.data);
            }
            return rejectWithValue('Lỗi kết nối đến server');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: any) => {
                state.isLoading = false;
                console.log("🔥 Payload API trả về:", action.payload);

                // --- XỬ LÝ QUAN TRỌNG ĐỂ KHÔNG BỊ UNDEFINED ---

                // Trường hợp 1: Backend trả về { token: "...", user: { id: 1, ... } }
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
                // Trường hợp 2: Backend trả về { token: "...", fullName: "...", roleId: ... } (Dạng phẳng)
                else {
                    // Tách token ra, phần còn lại chính là User info
                    const { token, ...userData } = action.payload;
                    state.user = userData;
                }

                // Lưu vào LocalStorage
                localStorage.setItem('user', JSON.stringify(state.user));

                if (action.payload.token) {
                    localStorage.setItem('token', action.payload.token);
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                // Ép kiểu về string hoặc stringify object lỗi để không crash UI
                if (typeof action.payload === 'object') {
                    state.error = JSON.stringify(action.payload);
                } else {
                    state.error = action.payload as string;
                }
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;