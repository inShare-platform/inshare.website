import { createSlice, createAction } from '@reduxjs/toolkit';

// Action creators
export const getDashboardDataRequest = createAction('dashboard/getDashboardDataRequest');
export const getDashboardDataSuccess = createAction<any>('dashboard/getDashboardDataSuccess');
export const getDashboardDataFailure = createAction<Error>('dashboard/getDashboardDataFailure');

interface DashboardState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardDataRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardDataSuccess, (state, action) => {
        state.loading = false;
        state.data = action.payload ;
      })
      .addCase(getDashboardDataFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default dashboardSlice.reducer;
