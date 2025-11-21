import { call, put, takeLatest } from 'redux-saga/effects';
import { getDashboardDataRequest, getDashboardDataSuccess, getDashboardDataFailure } from '../slice/dashboardSlice';
import { dashboardService } from '../../services/dashboard.service';

function* getDashboardData(): Generator<any, void, any> {
  try {
    const response = yield call(dashboardService);
    const data = response.data
    yield put(getDashboardDataSuccess(data));
  } catch (error) {
    yield put(getDashboardDataFailure(error as Error));
  }
}

export function* dashboardSaga() {
  yield takeLatest(getDashboardDataRequest.type, getDashboardData);
}
