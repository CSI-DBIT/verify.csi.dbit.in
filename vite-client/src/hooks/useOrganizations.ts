import { createOrganizationApi, deleteOrganizationApi, fetchOrganizationsApi, updateOrganizationApi } from '@/api/organizationApi';
import { Organization } from '@/types';
import { useState, useEffect } from 'react';


export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const data = await fetchOrganizationsApi();
      setOrganizations(data);
    } catch (err: any) {
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const createOrganization = async (org: Organization) => {
    try {
      const newOrg = await createOrganizationApi(org);
      setOrganizations((prev) => [...prev, newOrg]);
    } catch (err: any) {
      setError('Failed to create organization');
    }
  };

  const updateOrganization = async (orgId: string, org: Organization) => {
    try {
      const updatedOrg = await updateOrganizationApi(orgId, org);
      setOrganizations((prev) =>
        prev.map((item) => (item.orgId === orgId ? updatedOrg : item))
      );
    } catch (err: any) {
      setError('Failed to update organization');
    }
  };

  const deleteOrganization = async (orgId: string) => {
    try {
      await deleteOrganizationApi(orgId);
      setOrganizations((prev) => prev.filter((item) => item.orgId !== orgId));
    } catch (err: any) {
      setError('Failed to delete organization');
    }
  };

  return {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  };
};
