'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
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
  
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();

  const updateShippingInfo = (info: ShippingInfo) => {
    setShippingInfo(info);
  };

  const updatePaymentInfo = (info: PaymentInfo) => {
    setPaymentInfo(info);
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
      
      // Simulating API call to create an order
      const orderData = {
        items: cartItems,
        totalAmount: totalPrice,
        shipping: shippingInfo,
        payment: {
          // Omit sensitive data
          cardHolder: paymentInfo.cardHolder,
          // Include only last 4 digits of card
          cardLast4: paymentInfo.cardNumber.slice(-4),
          expiryDate: paymentInfo.expiryDate,
        },
      };
      
      // In a real app, we would make an API call to create the order
      // For now, we'll simulate a successful order after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      router.push('/checkout/success');
      
      return true;
    } catch (error) {
      console.error('Error placing order:', error);
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