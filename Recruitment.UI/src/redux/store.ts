import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import notificationReducer from './slices/notificationSlice';
import savedJobReducer from './slices/savedJobSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        jobs: jobReducer,
        notifications: notificationReducer,
        savedJobs: savedJobReducer,
    },
});

// Export types để dùng trong component
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;