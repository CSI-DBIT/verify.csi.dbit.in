import { useDispatch, useSelector } from 'react-redux';
import { refreshToken } from '../api/auth';
import { RootState } from '@/redux/store';
import { setAccessToken } from '@/redux/features/authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

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
