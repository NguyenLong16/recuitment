import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import savedJobService from '../../services/savedJobService';

interface SavedJobState {
    ids: number[];
    loaded: boolean;
}

const initialState: SavedJobState = {
    ids: [],
    loaded: false,
};

export const fetchSavedJobIds = createAsyncThunk(
    'savedJobs/fetchIds',
    async (_, { rejectWithValue }) => {
        try {
            const response = await savedJobService.getSavedJobs();
            const data: { jobId: number }[] = response.data || [];
            return data.map((item) => item.jobId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const savedJobSlice = createSlice({
    name: 'savedJobs',
    initialState,
    reducers: {
        addSavedId(state, action: { payload: number }) {
            if (!state.ids.includes(action.payload)) {
                state.ids.push(action.payload);
            }
        },
        removeSavedId(state, action: { payload: number }) {
            state.ids = state.ids.filter((id) => id !== action.payload);
        },
        clearSavedIds(state) {
            state.ids = [];
            state.loaded = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSavedJobIds.fulfilled, (state, action) => {
            state.ids = action.payload as number[];
            state.loaded = true;
        });
    },
});

export const { addSavedId, removeSavedId, clearSavedIds } = savedJobSlice.actions;
export default savedJobSlice.reducer;
