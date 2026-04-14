// src/services/axiosClient.ts
import axios, { InternalAxiosRequestConfig } from 'axios';

// ⚠️ Đổi URL này khớp với backend của bạn
export const BASE_URL = 'http://localhost:5087/api';

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Decode JWT để đọc thời gian hết hạn ──────────────────────────────────────
const decodeJwt = (token: string): { exp?: number;[key: string]: any } | null => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

const logTokenExpiry = (label: string, token: string) => {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) {
        console.log(`[Auth] ${label}: không phải JWT (refreshToken chỉ là random string)`);
        return;
    }
    const expiresAt = new Date(decoded.exp * 1000);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const isExpired = diffMs <= 0;

    console.log(
        `%c[Auth] ${label}`,
        `color: ${isExpired ? '#ef4444' : '#22c55e'}; font-weight: bold`,
        '\n  hết hạn lúc        :', expiresAt.toLocaleString('vi-VN'),
        '\n  thời điểm hiện tại :', now.toLocaleString('vi-VN'),
        isExpired
            ? `\n  ĐÃ HẾT HẠN ${Math.abs(diffSec)} giây trước`
            : `\n  còn hiệu lực: ${diffSec} giây nữa`
    );
};

// ─── Helpers localStorage ──────────────────────────────────────────────────────
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const saveTokens = (accessToken: string, refreshToken: string, fullName: string, role: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify({ fullName, role }));
};

const clearSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

// ─── Request Interceptor: gắn accessToken + LOG MỌI REQUEST ───────────────────
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Log mỗi request để biết token đang được gắn
            logTokenExpiry(`📡 REQUEST ${config.method?.toUpperCase()} ${config.url}`, token);
        } else {
            console.log(`[Auth] 📡 REQUEST ${config.method?.toUpperCase()} ${config.url} (KHÔNG CÓ TOKEN)`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor: tự động refresh khi 401 ────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

/** Giải phóng tất cả request đang chờ */
const flushQueue = (error: unknown, newToken: string | null) => {
    pendingQueue.forEach(({ resolve, reject }) => {
        if (error || !newToken) reject(error);
        else resolve(newToken);
    });
    pendingQueue = [];
};

/** Gọi logout API (không kèm Authorization) rồi redirect về /login */
const forceLogout = async () => {
    const refreshToken = getRefreshToken();
    clearSession();

    if (refreshToken) {
        try {
            // Gọi thẳng axios (không qua interceptor) để tránh vòng lặp
            await axios.post(`${BASE_URL}/Auth/logout`, { refreshToken });
            console.log('[Auth] ✅ Logout API thành công - refreshToken đã bị thu hồi');
        } catch (e: any) {
            console.warn('[Auth] ⚠️ Logout API thất bại:', e?.response?.data || e?.message);
        }
    }

    window.location.href = '/login';
};

axiosClient.interceptors.response.use(
    (response) => {
        console.log(`[Auth] ✅ RESPONSE ${response.status} ${response.config.url}`);
        return response;
    },

    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = originalRequest?.url || 'unknown';

        console.error(`[Auth] ❌ RESPONSE ${status} ${url}`, error.response?.data);

        // ── Chỉ xử lý 401, bỏ qua nếu chính /refresh-token hoặc /logout bị lỗi ──
        const isAuthEndpoint =
            url.includes('/Auth/refresh-token') ||
            url.includes('/Auth/logout') ||
            url.includes('/Auth/login');

        if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            console.log('[Auth] ═══════════════════════════════════════════');
            console.log('[Auth] 🔔 Nhận 401 → bắt đầu quy trình refresh');
            console.log('[Auth] ═══════════════════════════════════════════');

            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            // Log trạng thái accessToken
            if (accessToken) {
                logTokenExpiry('accessToken (ĐÃ HẾT HẠN)', accessToken);
            } else {
                console.warn('[Auth] ⛔ accessToken: không tìm thấy trong localStorage');
            }

            // Không có refreshToken → logout ngay
            if (!refreshToken) {
                console.error('[Auth] ⛔ Không có refreshToken → buộc logout');
                await forceLogout();
                return Promise.reject(error);
            }

            // Log refreshToken (note: refreshToken là random string, không decode được)
            console.log('[Auth] 🔑 refreshToken tìm thấy:', refreshToken.substring(0, 20) + '...');

            // Đang refresh → đưa vào queue chờ
            if (isRefreshing) {
                console.log('[Auth] ⏳ Đang refresh, thêm request vào hàng chờ...');
                return new Promise<string>((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                }).then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosClient(originalRequest);
                });
            }

            // Bắt đầu refresh
            originalRequest._retry = true;
            isRefreshing = true;
            console.log('[Auth] 🔄 Đang gọi POST /Auth/refresh-token...');

            try {
                // Gọi thẳng axios (KHÔNG qua interceptor) để tránh vòng lặp vô hạn
                const res = await axios.post(`${BASE_URL}/Auth/refresh-token`, { refreshToken });
                const { accessToken: newAccessToken, refreshToken: newRefreshToken, fullName, role } = res.data;

                console.log('[Auth] ✅ Refresh thành công!');
                logTokenExpiry('accessToken MỚI', newAccessToken);

                saveTokens(newAccessToken, newRefreshToken, fullName, role);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                flushQueue(null, newAccessToken);

                // Retry request gốc với token mới
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log(`[Auth] 🔁 Retry request gốc: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`);
                return axiosClient(originalRequest);

            } catch (refreshError: any) {
                const msg = refreshError?.response?.data || refreshError?.message || 'unknown';
                console.error('[Auth] ══════════════════════════════════════');
                console.error('[Auth] ⛔ REFRESH THẤT BẠI!');
                console.error('[Auth]    → Backend trả về:', msg);
                console.error('[Auth]    → HTTP status:', refreshError?.response?.status);
                console.error('[Auth] ══════════════════════════════════════');

                console.log('[Auth] 🚪 Đang gọi logout API và redirect về /login...');
                flushQueue(refreshError, null);
                await forceLogout();
                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;