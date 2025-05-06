'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface CheckoutContextType {
  step: number;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  updateShippingInfo: (info: ShippingInfo) => void;
  updatePaymentInfo: (info: PaymentInfo) => void;
  nextStep: () => void;
  prevStep: () => void;
  placeOrder: () => Promise<boolean>;
  isSubmitting: boolean;
  savedShippingInfo: boolean;
  savedPaymentInfo: boolean;
  loadSavedShippingInfo: () => Promise<boolean>;
  loadSavedPaymentInfo: () => Promise<boolean>;
  saveShippingInfoToServer: () => Promise<void>;
  savePaymentInfoToServer: () => Promise<void>;
}

const defaultShippingInfo: ShippingInfo = {
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const defaultPaymentInfo: PaymentInfo = {
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(defaultShippingInfo);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(defaultPaymentInfo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedShippingInfo, setSavedShippingInfo] = useState(false);
  const [savedPaymentInfo, setSavedPaymentInfo] = useState(false);
  
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Load saved information on initial mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedShippingInfo();
      loadSavedPaymentInfo();
    }
  }, [isAuthenticated, user]);

  // Add a function to get the backend URL
  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  };

  const loadSavedShippingInfo = async () => {
    if (!isAuthenticated || !user) return false;

    try {
      // Properly encode the email parameter
      const encodedEmail = encodeURIComponent(user.email);
      console.log(`Fetching shipping info for: ${encodedEmail}`);
      
      // Use query parameter for email with proper encoding
      const response = await axios.get(`/api/shipping?email=${encodedEmail}`, { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.data && !response.data.error) {
        console.log('Loading saved shipping info:', response.data);
        // Convert from backend format to our format
        setShippingInfo({
          address: response.data.address?.split('\n')[0] || '',
          city: response.data.address?.split('\n')[1]?.split(',')[0]?.trim() || '',
          state: response.data.address?.split('\n')[1]?.split(',')[1]?.trim() || '',
          postalCode: response.data.postalcode || '',
          country: response.data.country || ''
        });
        setSavedShippingInfo(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load saved shipping info:', error);
      // Don't show error toast to user - just quietly fail
      return false;
    }
  };

  const loadSavedPaymentInfo = async () => {
    if (!isAuthenticated || !user) return false;
    
    try {
      console.log('Fetching payment info');
      
      // Use the payment endpoint without email parameter but with no-cache headers
      const response = await axios.get(`/api/payment`, { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.data && !response.data.message && !response.data.error) {
        console.log('Loading saved payment info:', response.data);
        // Convert from backend format to our format
        setPaymentInfo({
          cardNumber: response.data.card_number || '',
          cardHolder: response.data.email || user.email || '',
          expiryDate: response.data.exp_date || '',
          cvv: '' // Never stored on server
        });
        setSavedPaymentInfo(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load saved payment info:', error);
      // Don't show error toast to user - just quietly fail
      return false;
    }
  };

  const saveShippingInfoToServer = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      // Format address for backend
      const addressLine = `${shippingInfo.city}, ${shippingInfo.state}`;
      const backendUrl = getBackendUrl();
      
      // Use Next.js API route instead of direct backend access
      const response = await axios.post(`/api/shipping`, {
        email: user.email,
        address: `${shippingInfo.address}\n${addressLine}`,
        postalcode: shippingInfo.postalCode,
        country: shippingInfo.country
      }, { withCredentials: true });
      
      console.log('Shipping info saved:', response.data);
      setSavedShippingInfo(true);
      // Remove toast notification since saving is now automatic
    } catch (error) {
      console.error('Failed to save shipping info:', error);
      // Don't show error to user since saving is automatic
    }
  };

  const savePaymentInfoToServer = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const backendUrl = getBackendUrl();
      // Use Next.js API route instead of direct backend access
      const response = await axios.post(`/api/payment`, {
        email: user.email,
        payment_method: 'card',
        card_number: paymentInfo.cardNumber,
        exp_date: paymentInfo.expiryDate
      }, { withCredentials: true });
      
      console.log('Payment info saved:', response.data);
      setSavedPaymentInfo(true);
      // Remove toast notification since saving is now automatic
    } catch (error) {
      console.error('Failed to save payment info:', error);
      // Don't show error to user since saving is automatic
    }
  };

  const updateShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
    setSavedShippingInfo(false); // Mark as not saved since it was updated
  };

  const updatePaymentInfo = (info: PaymentInfo) => {
    setPaymentInfo(info);
    setSavedPaymentInfo(false); // Mark as not saved since it was updated
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const placeOrder = async (): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      if (!isAuthenticated || !user) {
        toast.error('You must be logged in to place an order');
        router.push('/auth/login');
        return false;
      }
      
      // Always save shipping and payment info if user is authenticated
      // Even if we already have saved info, update it with latest values
      if (isAuthenticated) {
        try {
          await saveShippingInfoToServer();
          await savePaymentInfoToServer();
          
          // Don't show toast messages since this is now automatic
          console.log('Shipping and payment info saved automatically');
        } catch (error) {
          console.error('Error saving shipping or payment info:', error);
          // Continue checkout process even if saving fails
        }
      }
      
      // Save order items to localStorage for invoice generation
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastOrderItems', JSON.stringify(cartItems));
      }
      
      console.log('Placing order with items:', cartItems);
      
      // Add checkout history entries to backend
      let savedOrdersCount = 0;
      
      // Track the number of successfully saved orders
      for (const item of cartItems) {
        try {
          console.log(`Processing order for book ${item.id || 'unknown'} to checkout history...`);
          
          // Make sure we have a valid book identifier
          if (!item.id) {
            console.warn('Skipping item with no ID', item);
            continue;
          }
          
          // Extract ISBN from the item ID or use the item ID itself
          // Book IDs might be in different formats depending on your data source
          let book_isbn = item.id;
          
          // If the ID contains ISBN, extract it
          if (typeof book_isbn === 'string' && book_isbn.includes('ISBN:')) {
            book_isbn = book_isbn.split('ISBN:')[1].trim();
          }
          
          // If ID is a number, format it as a string
          if (typeof book_isbn === 'number') {
            book_isbn = String(book_isbn);
          }
          
          // Make sure we have a valid ISBN
          if (!book_isbn) {
            console.warn('Skipping item with no valid ISBN', item);
            continue;
          }
          
          // Prepare data for the API call
          const orderHistoryData = {
            email: user.email,
            book_isbn: book_isbn, // Use the processed ISBN
            total_price: item.price * item.quantity,
            qty: item.quantity,
            checkout_date_and_time: new Date().toISOString(),
          };
          
          console.log('Checkout history data to be sent:', orderHistoryData);
          
          // Send data directly to the backend instead of through our API route
          const backendUrl = getBackendUrl();
          const response = await axios.post(`${backendUrl}/checkout-history/`, orderHistoryData, { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Checkout history response:', response.data);
          savedOrdersCount++;
        } catch (error: any) {
          console.error('Error saving checkout history for item:', item.id);
          console.error('Error details:', error.response?.data || error.message);
          // Continue the checkout process even if history saving fails
        }
      }
      
      // Show a specific message if no orders were saved
      if (cartItems.length > 0 && savedOrdersCount === 0) {
        toast.warning('Order was processed but could not save to history. Your items will still be delivered.');
      } else if (savedOrdersCount > 0) {
        console.log(`Successfully saved ${savedOrdersCount} orders to history`);
      }
      
      // In a real app, we would make an API call to process payment
      // For now, we'll simulate a successful order
      
      // Clear the cart after successful order
      clearCart();
      
      // Redirect to processing/success page
      router.push('/checkout/success');
      
      return true;
    } catch (error: any) {
      console.error('Error placing order:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to place your order. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        shippingInfo,
        paymentInfo,
        updateShippingInfo,
        updatePaymentInfo,
        nextStep,
        prevStep,
        placeOrder,
        isSubmitting,
        savedShippingInfo,
        savedPaymentInfo,
        loadSavedShippingInfo,
        loadSavedPaymentInfo,
        saveShippingInfoToServer,
        savePaymentInfoToServer
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
} 