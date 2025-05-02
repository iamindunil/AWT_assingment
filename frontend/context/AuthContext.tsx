"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<boolean>;
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
    const token = Cookies.get('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const { data } = await axios.get('/api/user/profile', config);
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Cookies.remove('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    try {
      // Save local cart before login
      const localCart = localStorage.getItem('cart');
      
      const { data } = await axios.post('/api/auth/login', { email, password });
      Cookies.set('token', data.token, { expires: remember ? 30 : 1 });
      setUser(data.user);
      setIsAuthenticated(true);
      
      // If we have a local cart, we should preserve it or merge it with server cart
      // This is a simplified version - in a real app, you'd want to merge with the server cart
      if (localCart) {
        localStorage.setItem('cart', localCart);
      }
      
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await axios.post('/api/user/register', { name, email, password });
      toast.success('Registration successful! Please verify your email.');
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      await axios.post('/api/email-verification/verify', { email, code });
      toast.success('Email verified successfully. You can now log in.');
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      toast.error('Email verification failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
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