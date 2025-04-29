import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getToken, validateToken, removeToken } from './auth';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          navigate('/signin');
          return;
        }

        const isValid = await validateToken();
        if (!isValid) {
          removeToken();
          navigate('/signin');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        removeToken();
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;