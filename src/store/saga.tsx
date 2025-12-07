import { all } from 'redux-saga/effects';
import { authSaga } from '../features/auth/redux/sagas/authSaga';
import { organizationSaga } from '../features/organizations/redux/sagas/organizationSaga';

export function* rootSaga() {
  yield all([
    authSaga(),
    organizationSaga(),
  ]);
}
