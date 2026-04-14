import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types/auth';
import { authService } from '../../services/authService';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

// Helper: Lấy user từ localStorage an toàn
const getUserFromLocalStorage = (): User | null => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr && userStr !== 'undefined') {
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

// ─── Thunk: Đăng nhập ─────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authService.login(userData);
            return response.data; // AuthResponse: { accessToken, refreshToken, fullName, role }
        } catch (error: any) {
            if (error.response?.data) {
                return rejectWithValue(error.response.data.message || error.response.data);
            }
            return rejectWithValue('Lỗi kết nối đến server');
        }
    }
);

// ─── Thunk: Đăng xuất ─────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                // Gọi API để backend thu hồi refreshToken
                await authService.logout({ refreshToken });
            }
        } catch (error: any) {
            // Dù API lỗi vẫn tiến hành xóa local state
            return rejectWithValue(error.response?.data?.message || 'Logout thất bại');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Logout nhanh phía client (không gọi API), dùng khi refreshToken hết hạn
        clearAuth: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ── Login ──────────────────────────────────────────────────────────
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const { accessToken, refreshToken, fullName, role } = action.payload;

                // Lưu user vào state
                state.user = { fullName, role };

                // Lưu tokens vào LocalStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify({ fullName, role }));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error =
                    typeof action.payload === 'object'
                        ? JSON.stringify(action.payload)
                        : (action.payload as string);
            })

            // ── Logout ─────────────────────────────────────────────────────────
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            })
            .addCase(logoutUser.rejected, (state) => {
                // Dù API lỗi vẫn xóa local state
                state.isLoading = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            });
    },
});

export const { clearAuth, clearError } = authSlice.actions;
// Giữ alias 'logout' để không break import cũ
export const logout = clearAuth;
export default authSlice.reducer;