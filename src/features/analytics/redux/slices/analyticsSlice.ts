import { createSlice, createAction } from '@reduxjs/toolkit';

export const getAnalyticsDataRequest = createAction('dashboard/getDashboardDataRequest');
export const getAnalyticsDataSuccess = createAction<any>('dashboard/getDashboardDataSuccess');
export const getAnalyticsDataFailure = createAction<Error>('dashboard/getDashboardDataFailure');

interface AnalyticsState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnalyticsDataRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAnalyticsDataSuccess, (state, action) => {
        state.loading = false;
        state.data = action.payload ;
      })
      .addCase(getAnalyticsDataFailure, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export default analyticsSlice.reducer;
