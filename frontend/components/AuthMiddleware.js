import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const AuthMiddleware = ({ children, requiredRole = null }) => {
  const router = useRouter();
  const { user } = useSelector(state => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (requiredRole && (!user || user.role !== requiredRole)) {
      router.push('/');
    }
  }, [user, requiredRole]);

  return children;
};

export default AuthMiddleware; 