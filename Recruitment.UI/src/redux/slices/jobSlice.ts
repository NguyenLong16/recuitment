import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { JobState } from "../../types/job";
import JobService from "../../services/jobService";

const initialState: JobState = {
    jobs: [],
    loading: false,
    error: null
}

export const fetchMyJobs = createAsyncThunk(
    'jobs/fetchMyJobs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await JobService.getMyJobs()
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export const toggleJobStatus = createAsyncThunk(
    'jobs/toggleStatus',
    async (id: number, { rejectWithValue }) => {
        try {
            await JobService.toggleStatus(id);
            return id; // Trả về ID để cập nhật state
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteJob = createAsyncThunk(
    'jobs/deleteJob',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await JobService.deleteJob(id)
            return response.data
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyJobs.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchMyJobs.fulfilled, (state, action) => {
                state.loading = false
                state.jobs = action.payload
            })
            .addCase(fetchMyJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(toggleJobStatus.fulfilled, (state, action) => {
                const job = state.jobs.find(j => j.id === action.payload);
                if (job) {
                    // Đảo ngược trạng thái hiển thị trên UI tạm thời
                    job.status = job.status === 'Active' ? 'Inactive' : 'Active';
                }
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter(job => job.id !== action.payload);
            });
    },
});

export default jobSlice.reducer;