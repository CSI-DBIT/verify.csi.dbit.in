import { Organization } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrgState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrgState = {
  organizations: [] as Organization[],
  loading: false,
  error: null,
};

const orgSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations(state, action: PayloadAction<Organization[]>) {
      state.organizations = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setOrganizations, setLoading, setError } = orgSlice.actions;
export default orgSlice.reducer;
