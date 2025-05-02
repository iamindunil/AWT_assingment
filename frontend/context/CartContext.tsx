'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Calculate totals - ensure cartItems is an array before using reduce
  const totalItems = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + item.quantity, 0) 
    : 0;
    
  const totalPrice = Array.isArray(cartItems) 
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0) 
    : 0;

  // Load cart from API or local storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated && user) {
          // Get cart from API if user is logged in
          const { data } = await axios.get('/api/shopping-cart');
          // Ensure data is an array before setting
          setCartItems(Array.isArray(data) ? data : []);
        } else {
          // Get cart from local storage if user is not logged in
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            try {
              const parsedCart = JSON.parse(storedCart);
              setCartItems(Array.isArray(parsedCart) ? parsedCart : []);
            } catch (e) {
              console.error('Failed to parse cart from localStorage:', e);
              setCartItems([]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        toast.error('Failed to load your shopping cart');
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save cart to API or local storage when it changes
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Save to API
        const saveCart = async () => {
          try {
            // Ensure cartItems is an array before sending
            await axios.put('/api/shopping-cart', Array.isArray(cartItems) ? cartItems : []);
          } catch (error) {
            console.error('Failed to save cart:', error);
          }
        };
        saveCart();
      } else {
        // Save to local storage
        localStorage.setItem('cart', JSON.stringify(Array.isArray(cartItems) ? cartItems : []));
      }
    }
  }, [cartItems, isAuthenticated, user, isLoading]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If item doesn't exist, add to cart with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast.success('Item added to cart');
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      totalItems, 
      totalPrice, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 