// Organization Types and Interfaces

export interface Organization {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  websiteUrl?: string;
  numberOfPeople?: number;
  plan: string;
  approved: boolean;
  isEnabled: boolean;
  features?: OrganizationFeature[];
  comments?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: OrganizationUser;
}

export interface OrganizationUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isFirstLogin: boolean;
}

export interface OrganizationFeature {
  name: string;
  enabled: boolean;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  organization: CreateOrganizationData;
}

export interface CreateOrganizationData {
  name: string;
  email: string;
  phoneNumber?: string;
  websiteUrl?: string;
  numberOfPeople?: number;
  plan: string;
  features?: OrganizationFeature[];
  comments?: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: OrganizationUser & { organization: Organization };
    temporaryPassword: string;
  };
}

export interface UpdateOrganizationRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  numberOfPeople?: number;
  plan?: string;
  approved?: boolean;
  isEnabled?: boolean;
  features?: OrganizationFeature[];
  comments?: string;
}

export interface OrganizationsState {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  createdUser: {
    user: any;
    temporaryPassword: string;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface OnboardingFormData {
  // Step 1: Organization Details
  organizationName: string;
  organizationEmail: string;
  phoneNumber: string;
  websiteUrl: string;
  numberOfPeople: number;
  
  // Step 2: User Details
  adminFullName: string;
  adminEmail: string;
  
  // Step 3: Plan & Features
  plan: PlanType;
  features: OrganizationFeature[];
  
  // Step 4: Comments
  comments: string;
}
