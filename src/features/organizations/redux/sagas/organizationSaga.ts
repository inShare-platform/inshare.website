// Organization Redux Saga - Handle async organization operations
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { organizationService } from '../../services/organization.service';
import {
  fetchOrganizationsRequest,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  fetchOrganizationByIdRequest,
  fetchOrganizationByIdSuccess,
  fetchOrganizationByIdFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
  updateOrganizationRequest,
  updateOrganizationSuccess,
  updateOrganizationFailure,
  approveOrganizationRequest,
  approveOrganizationSuccess,
  approveOrganizationFailure,
  toggleOrganizationStatusRequest,
  toggleOrganizationStatusSuccess,
  toggleOrganizationStatusFailure,
  deleteOrganizationRequest,
  deleteOrganizationSuccess,
  deleteOrganizationFailure,
} from '../slices/organizationSlice';
import type {
  ApiResponse,
  Organization,
  CreateUserRequest,
  CreateUserResponse,
  UpdateOrganizationRequest,
} from '../../types/organization.types';

/**
 * Fetch all organizations saga
 */
function* handleFetchOrganizations(): Generator<any, void, ApiResponse<Organization[]>> {
  try {
    const response: ApiResponse<Organization[]> = yield call(
      organizationService.getAllOrganizations
    );

    if (response.success && response.data) {
      yield put(fetchOrganizationsSuccess(response.data));
    } else {
      yield put(fetchOrganizationsFailure('Failed to fetch organizations'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while fetching organizations';
    yield put(fetchOrganizationsFailure(errorMessage));
  }
}

/**
 * Fetch organization by ID saga
 */
function* handleFetchOrganizationById(
  action: PayloadAction<string>
): Generator<any, void, ApiResponse<Organization>> {
  try {
    const response: ApiResponse<Organization> = yield call(
      organizationService.getOrganizationById,
      action.payload
    );

    if (response.success && response.data) {
      yield put(fetchOrganizationByIdSuccess(response.data));
    } else {
      yield put(fetchOrganizationByIdFailure('Failed to fetch organization'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while fetching organization';
    yield put(fetchOrganizationByIdFailure(errorMessage));
  }
}

/**
 * Create user with organization saga
 */
function* handleCreateUser(
  action: PayloadAction<CreateUserRequest>
): Generator<any, void, CreateUserResponse> {
  try {
    const response: CreateUserResponse = yield call(
      organizationService.createUser,
      action.payload
    );

    if (response.success && response.data) {
      yield put(createUserSuccess(response.data));
      // Refresh organizations list
      yield put(fetchOrganizationsRequest());
    } else {
      yield put(createUserFailure('Failed to create user'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while creating user';
    yield put(createUserFailure(errorMessage));
  }
}

/**
 * Update organization saga
 */
function* handleUpdateOrganization(
  action: PayloadAction<{ id: string; data: UpdateOrganizationRequest }>
): Generator<any, void, ApiResponse<Organization>> {
  try {
    const { id, data } = action.payload;
    const response: ApiResponse<Organization> = yield call(
      organizationService.updateOrganization,
      id,
      data
    );

    if (response.success && response.data) {
      yield put(updateOrganizationSuccess(response.data));
    } else {
      yield put(updateOrganizationFailure('Failed to update organization'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while updating organization';
    yield put(updateOrganizationFailure(errorMessage));
  }
}

/**
 * Approve organization saga
 */
function* handleApproveOrganization(
  action: PayloadAction<string>
): Generator<any, void, ApiResponse<Organization>> {
  try {
    const response: ApiResponse<Organization> = yield call(
      organizationService.approveOrganization,
      action.payload
    );

    if (response.success && response.data) {
      yield put(approveOrganizationSuccess(response.data));
    } else {
      yield put(approveOrganizationFailure('Failed to approve organization'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while approving organization';
    yield put(approveOrganizationFailure(errorMessage));
  }
}

/**
 * Toggle organization status (enable/disable) saga
 */
function* handleToggleOrganizationStatus(
  action: PayloadAction<{ id: string; enable: boolean }>
): Generator<any, void, ApiResponse<Organization>> {
  try {
    const { id, enable } = action.payload;
    const response: ApiResponse<Organization> = yield call(
      enable ? organizationService.enableOrganization : organizationService.disableOrganization,
      id
    );

    if (response.success && response.data) {
      yield put(toggleOrganizationStatusSuccess(response.data));
    } else {
      yield put(
        toggleOrganizationStatusFailure(
          `Failed to ${enable ? 'enable' : 'disable'} organization`
        )
      );
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error ||
      error.message ||
      'An error occurred while updating organization status';
    yield put(toggleOrganizationStatusFailure(errorMessage));
  }
}

/**
 * Delete organization saga
 */
function* handleDeleteOrganization(
  action: PayloadAction<string>
): Generator<any, void, ApiResponse<null>> {
  try {
    const response: ApiResponse<null> = yield call(
      organizationService.deleteOrganization,
      action.payload
    );

    if (response.success) {
      yield put(deleteOrganizationSuccess(action.payload));
    } else {
      yield put(deleteOrganizationFailure('Failed to delete organization'));
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error || error.message || 'An error occurred while deleting organization';
    yield put(deleteOrganizationFailure(errorMessage));
  }
}

/**
 * Root organization saga - Watch for actions
 */
export function* organizationSaga() {
  yield takeLatest(fetchOrganizationsRequest.type, handleFetchOrganizations);
  yield takeLatest(fetchOrganizationByIdRequest.type, handleFetchOrganizationById);
  yield takeLatest(createUserRequest.type, handleCreateUser);
  yield takeLatest(updateOrganizationRequest.type, handleUpdateOrganization);
  yield takeLatest(approveOrganizationRequest.type, handleApproveOrganization);
  yield takeLatest(toggleOrganizationStatusRequest.type, handleToggleOrganizationStatus);
  yield takeLatest(deleteOrganizationRequest.type, handleDeleteOrganization);
}
