import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // Tambahkan import ini
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        authService.setAuthToken(token);
        const userData = await authService.getCurrentUser();
        if (userData) {
          setUser(userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        authService.setAuthToken(response.token);
        setUser(response.user || response);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Tambahkan fungsi logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,  // Pastikan logout dimasukkan ke dalam value
      isAuthenticated: !!user 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;