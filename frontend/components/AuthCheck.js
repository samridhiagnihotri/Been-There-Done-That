import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setToken } from '../redux/slices/authSlice';

const AuthCheck = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!user && storedUser && storedToken) {
      dispatch(setUser(JSON.parse(storedUser)));
      dispatch(setToken(storedToken));
    }

    if (!storedUser || !storedToken) {
      router.push('/login');
    }
  }, []);

  return children;
};

export default AuthCheck; 