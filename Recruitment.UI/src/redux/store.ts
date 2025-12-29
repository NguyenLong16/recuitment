import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // service: serviceReducer,
    },
});

// Export types để dùng trong component
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;