"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface User {
  email: string;
  name: string;
}

interface LoginResult {
  success: boolean;
  needsVerification?: boolean;
  email?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<LoginResult>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_COOKIE_NAME = 'token';
const TOKEN_PATH = '/';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const { data } = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (data && data.email) {
        setUser(data);
        setIsAuthenticated(true);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuthState = useCallback(() => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: TOKEN_PATH });
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleTokenChange = useCallback(() => {
    const newToken = Cookies.get(TOKEN_COOKIE_NAME);
    if (newToken && !isAuthenticated) {
      fetchUser(newToken);
    } else if (!newToken && isAuthenticated) {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [fetchUser, isAuthenticated]);

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }

    // Listen for token changes (like from login/logout in another tab)
    window.addEventListener('storage', handleTokenChange);
    
    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [fetchUser, handleTokenChange]);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      // Save local cart before login
      const localCart = localStorage.getItem('cart');
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.successful) {
        // Set cookie with path and secure settings for persistence
        Cookies.set(TOKEN_COOKIE_NAME, data.token, { 
          expires: remember ? 30 : 1,
          path: TOKEN_PATH,
          sameSite: 'strict',
          secure: location.protocol === 'https:'
        });
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Preserve local cart
        if (localCart) {
          localStorage.setItem('cart', localCart);
        }
        
        toast.success('Logged in successfully');
        return { success: true };
      } else if (data.needsVerification) {
        toast.warning('Email verification required before login');
        return { 
          success: false, 
          needsVerification: true, 
          email: data.email,
          message: data.message
        };
      } else {
        toast.error(data.message || 'Login failed');
        return { 
          success: false, 
          message: data.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      console.error('Login failed:', error);
      toast.error(`Login failed: ${errorMessage}`);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/user/register', { name, email, password });
      
      if (data.success) {
        toast.success(data.message || 'Registration successful! Please verify your email.');
        return true;
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${errorMessage}`);
      return false;
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const { data } = await axios.post('/api/email-verification/verify', { email, code });
      
      if (data.verified) {
        toast.success(data.message || 'Email verified successfully. You can now log in.');
        return true;
      } else {
        toast.error(data.message || 'Email verification failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email verification failed. Please try again.';
      console.error('Email verification failed:', error);
      toast.error(`Verification failed: ${errorMessage}`);
      return false;
    }
  };

  const logout = useCallback(() => {
    clearAuthState();
    toast.success('Logged out successfully');
  }, [clearAuthState]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      verifyEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 