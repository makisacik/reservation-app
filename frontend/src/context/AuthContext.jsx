import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { usersApi } from '../api/usersApi';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
      // Fetch current user from API
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken) => {
    try {
      if (authToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
        const userData = await usersApi.getCurrentUser();
        setUser(userData);
        setToken(authToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      console.log('Login response:', response); // Debug log
      
      // Handle both camelCase (token) and PascalCase (Token) from backend
      const authToken = response.token || response.Token;
      
      if (authToken) {
        // Temporarily set token in localStorage so axios interceptor can use it
        // This will be cleared if role doesn't match, or kept if it does
        localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
        
        try {
          // Fetch user data first without setting auth state
          const userData = await usersApi.getCurrentUser();
          return { success: true, user: userData, token: authToken };
        } catch (userError) {
          // If fetching user fails, remove the token we just set
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          throw userError;
        }
      }
      return { success: false, error: 'Invalid credentials - no token received' };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data); // Debug log
      // Make sure token is cleared on error
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const setAuthState = (authToken, userData) => {
    if (authToken && userData) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
    setLoading(false);
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 1;

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin,
    loading,
    login,
    setAuthState,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

