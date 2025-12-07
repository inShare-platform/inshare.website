// Organization Redux Slice - State management for organizations
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  OrganizationsState, 
  Organization,
  CreateUserRequest,
  UpdateOrganizationRequest,
} from '../../types/organization.types';

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrganization: null,
  isLoading: false,
  error: null,
  createdUser: null,
};

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    // Get all organizations actions
    fetchOrganizationsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrganizationsSuccess: (state, action: PayloadAction<Organization[]>) => {
      state.isLoading = false;
      state.organizations = action.payload;
      state.error = null;
    },
    fetchOrganizationsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Get organization by ID actions
    fetchOrganizationByIdRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrganizationByIdSuccess: (state, action: PayloadAction<Organization>) => {
      state.isLoading = false;
      state.selectedOrganization = action.payload;
      state.error = null;
    },
    fetchOrganizationByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create user with organization actions
    createUserRequest: (state, _action: PayloadAction<CreateUserRequest>) => {
      state.isLoading = true;
      state.error = null;
      state.createdUser = null;
    },
    createUserSuccess: (state, action: PayloadAction<{ user: any; temporaryPassword: string }>) => {
      state.isLoading = false;
      state.createdUser = action.payload;
      state.error = null;
    },
    createUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update organization actions
    updateOrganizationRequest: (
      state,
      _action: PayloadAction<{ id: string; data: UpdateOrganizationRequest }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    updateOrganizationSuccess: (state, action: PayloadAction<Organization>) => {
      state.isLoading = false;
      state.selectedOrganization = action.payload;
      // Update in list if exists
      const index = state.organizations.findIndex((org) => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      state.error = null;
    },
    updateOrganizationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Approve organization actions
    approveOrganizationRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    approveOrganizationSuccess: (state, action: PayloadAction<Organization>) => {
      state.isLoading = false;
      state.selectedOrganization = action.payload;
      const index = state.organizations.findIndex((org) => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      state.error = null;
    },
    approveOrganizationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Enable/Disable organization actions
    toggleOrganizationStatusRequest: (
      state,
      _action: PayloadAction<{ id: string; enable: boolean }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    toggleOrganizationStatusSuccess: (state, action: PayloadAction<Organization>) => {
      state.isLoading = false;
      state.selectedOrganization = action.payload;
      const index = state.organizations.findIndex((org) => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      state.error = null;
    },
    toggleOrganizationStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Delete organization actions
    deleteOrganizationRequest: (state, _action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteOrganizationSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.organizations = state.organizations.filter((org) => org.id !== action.payload);
      if (state.selectedOrganization?.id === action.payload) {
        state.selectedOrganization = null;
      }
      state.error = null;
    },
    deleteOrganizationFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear selected organization
    clearSelectedOrganization: (state) => {
      state.selectedOrganization = null;
    },

    // Clear created user data
    clearCreatedUser: (state) => {
      state.createdUser = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearSelectedOrganization,
  clearCreatedUser,
  clearError,
} = organizationSlice.actions;

export default organizationSlice.reducer;
