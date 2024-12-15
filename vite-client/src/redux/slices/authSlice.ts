import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member, Organization } from "@/types";

interface AuthState {
  accessToken: string | null;
  userType: "MEMBER" | "ORGANIZATION" | null;
  userDetails: Member | Organization | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  userType: "MEMBER",
  userDetails: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<Pick<AuthState, "userType" | "userDetails">>
    ) => {
      state.userType = action.payload.userType;
      state.userDetails = action.payload.userDetails;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.userDetails = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserDetails: (
      state,
      action: PayloadAction<Member | Organization | null>
    ) => {
      state.userDetails = action.payload;
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const {
  setCredentials,
  setAccessToken,
  clearCredentials,
  setLoading,
  updateUserDetails,
  refreshToken,
} = authSlice.actions;

export default authSlice.reducer;
