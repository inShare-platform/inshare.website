// Organization Service - Handles all organization API calls
import { createApiClient } from '../../../client/client';
import type {
  Organization,
  CreateUserRequest,
  CreateUserResponse,
  UpdateOrganizationRequest,
  ApiResponse,
} from '../types/organization.types';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'https://api.inshare.in/api/v1/auth';

class OrganizationService {
  private client: AxiosInstance;

  constructor() {
    this.client = createApiClient(API_BASE_URL);
    // Bind methods to preserve 'this' context
    this.getAllOrganizations = this.getAllOrganizations.bind(this);
    this.getOrganizationById = this.getOrganizationById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateOrganization = this.updateOrganization.bind(this);
    this.approveOrganization = this.approveOrganization.bind(this);
    this.enableOrganization = this.enableOrganization.bind(this);
    this.disableOrganization = this.disableOrganization.bind(this);
    this.deleteOrganization = this.deleteOrganization.bind(this);
  }

  /**
   * Get all organizations (Super Admin only)
   */
  async getAllOrganizations(): Promise<ApiResponse<Organization[]>> {
    const response = await this.client.get<ApiResponse<Organization[]>>('/organizations');
    return response.data;
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    const response = await this.client.get<ApiResponse<Organization>>(`/organizations/${id}`);
    return response.data;
  }

  /**
   * Create new user with organization (Super Admin only)
   */
  async createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
    const response = await this.client.post<CreateUserResponse>('/users', data);
    return response.data;
  }

  /**
   * Update organization details (Super Admin only)
   */
  async updateOrganization(
    id: string,
    data: UpdateOrganizationRequest
  ): Promise<ApiResponse<Organization>> {
    const response = await this.client.put<ApiResponse<Organization>>(
      `/organizations/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Approve organization (Super Admin only)
   */
  async approveOrganization(id: string): Promise<ApiResponse<Organization>> {
    const response = await this.client.put<ApiResponse<Organization>>(
      `/organizations/${id}/approve`
    );
    return response.data;
  }

  /**
   * Enable organization (Super Admin only)
   */
  async enableOrganization(id: string): Promise<ApiResponse<Organization>> {
    const response = await this.client.put<ApiResponse<Organization>>(
      `/organizations/${id}/enable`
    );
    return response.data;
  }

  /**
   * Disable organization (Super Admin only)
   */
  async disableOrganization(id: string): Promise<ApiResponse<Organization>> {
    const response = await this.client.put<ApiResponse<Organization>>(
      `/organizations/${id}/disable`
    );
    return response.data;
  }

  /**
   * Delete organization (Super Admin only)
   */
  async deleteOrganization(id: string): Promise<ApiResponse<null>> {
    const response = await this.client.delete<ApiResponse<null>>(`/organizations/${id}`);
    return response.data;
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();
