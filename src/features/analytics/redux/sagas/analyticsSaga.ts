import { call, put, takeLatest } from 'redux-saga/effects';
import { getAnalyticsDataRequest, getAnalyticsDataSuccess, getAnalyticsDataFailure } from '../slices/analyticsSlice';
import { analyticsService } from '../../services/analytics.service';

function* getAnalyticsData(): Generator<any, void, any> {
  try {
    const response = yield call(analyticsService);
    const data = response.data
    console.log('Im from analytics saga' , data);
    
    yield put(getAnalyticsDataSuccess(data));
  } catch (error) {
    yield put(getAnalyticsDataFailure(error as Error));
  }
}

export function* analyticsSaga() {
  yield takeLatest(getAnalyticsDataRequest.type, getAnalyticsData);
}
