import { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { User, LoginResponse } from '@/types/auth';
import { toast } from 'sonner';

const API_URL = 'http://kahoot.nos-apps.com';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          navigate('/dashboard');
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/api/login`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode<User>(token);
      localStorage.setItem('user', JSON.stringify(decoded));
      setUser(decoded);
      
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return { login, logout, isLoading, user };
};