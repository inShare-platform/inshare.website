import { all } from 'redux-saga/effects';
import { dashboardSaga } from '../features/dashboard/redux/saga/dashboardSaga';
import { analyticsSaga } from '../features/analytics/redux/sagas/analyticsSaga';

export function* rootSaga() {
  yield all([
    dashboardSaga(),
    analyticsSaga()
  ]);
}
