import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer,
        // service: serviceReducer,
    },
});

// Export types để dùng trong component
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;