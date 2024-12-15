import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from '../api/authApi';
import { RootState } from '@/redux/store';
import { clearCredentials, setAccessToken } from '@/redux/slices/authSlice';
import { useEffect } from 'react';

const useAuth = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  useEffect(() => {
    if (!accessToken) {
      dispatch(clearCredentials());
    }
  }, [accessToken, dispatch]);
  const validateToken = async () => {
    try {
      // Attempt a protected call to check token validity
    } catch (error) {
      // Refresh token if needed
      const newAccessToken = await refreshToken();
      dispatch(setAccessToken(newAccessToken));
    }
  };

  return { accessToken, validateToken };
};

export default useAuth;
