"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const token = Cookies.get('token');
        
        // If we have a token, try to fetch user data
        if (token) {
          fetchUser(token);
        } else {
          // No token found, reset state
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Listen for token changes (like from login/logout in another tab)
    const handleTokenChange = () => {
      const newToken = Cookies.get('token');
      if (newToken && !isAuthenticated) {
        fetchUser(newToken);
      } else if (!newToken && isAuthenticated) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleTokenChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, [isAuthenticated]);

  const fetchUser = async (token: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data } = await axios.get('/api/user/profile', config);
      
      if (data && data.email) {
        setUser(data);
        setIsAuthenticated(true);
      } else {
        console.error('Invalid user data returned from profile API');
        Cookies.remove('token', { path: '/' });
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Cookies.remove('token', { path: '/' });
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      // Save local cart before login
      const localCart = localStorage.getItem('cart');
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.successful) {
        // Set cookie with path and secure settings for persistence
        Cookies.set('token', data.token, { 
          expires: remember ? 30 : 1,
          path: '/',
          sameSite: 'strict',
          secure: location.protocol === 'https:'
        });
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        // If we have a local cart, we should preserve it or merge it with server cart
        // This is a simplified version - in a real app, you'd want to merge with the server cart
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
        toast.error(data.message || 'Login failed. Please check your credentials.');
        return { 
          success: false, 
          message: data.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Login failed: ${error.response.data.message}`);
        return { success: false, message: error.response.data.message };
      } else {
        toast.error('Login failed. Please check your credentials.');
        return { success: false, message: 'Login failed. Please check your credentials.' };
      }
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
      console.error('Registration failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Registration failed: ${error.response.data.message}`);
      } else {
        toast.error('Registration failed. Please try again.');
      }
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
      console.error('Email verification failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Verification failed: ${error.response.data.message}`);
      } else {
        toast.error('Email verification failed. Please try again.');
      }
      return false;
    }
  };

  const logout = () => {
    // Remove token with the same path
    Cookies.remove('token', { path: '/' });
    // Fallback removal in case the path is different
    Cookies.remove('token');
    
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, verifyEmail }}>
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