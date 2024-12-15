import apiClient from "@/services/apiClient";
import { Organization } from "@/types";

export const fetchOrganizationsApi = async (): Promise<Organization[]> => {
  const response = await apiClient.get('/organizations');
  return response.data;
};

export const createOrganizationApi = async (org: Organization): Promise<Organization> => {
  const response = await apiClient.post('/organizations', org);
  return response.data;
};

export const updateOrganizationApi = async (orgId: string, org: Organization): Promise<Organization> => {
  const response = await apiClient.put(`/organizations/${orgId}`, org);
  return response.data;
};

export const deleteOrganizationApi = async (orgId: string): Promise<void> => {
  await apiClient.delete(`/organizations/${orgId}`);
};
