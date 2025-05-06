'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckout } from './CheckoutContext';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCreditCard, FaHistory } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// Define more flexible schemas that allow for input formatting
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .refine((val) => /^\d{16}$/.test(val.replace(/\s/g, '')), 'Card number must be 16 digits'),
  cardHolder: z.string().min(1, 'Cardholder name is required'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), 'Expiry date must be in MM/YY format'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .refine((val) => /^\d{3,4}$/.test(val), 'CVV must be 3 or 4 digits'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentForm() {
  const { 
    paymentInfo, 
    updatePaymentInfo, 
    savedPaymentInfo, 
    loadSavedPaymentInfo
  } = useCheckout();
  const { isAuthenticated, user } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentInfo,
    mode: 'onBlur', // Only validate on blur, not while typing
  });

  const cardNumber = watch('cardNumber', '');
  
  // Load saved payment info when component mounts
  useEffect(() => {
    const autoLoadSavedInfo = async () => {
      if (isAuthenticated && user && !dataLoaded) {
        try {
          await loadSavedPaymentInfo();
          setDataLoaded(true);
        } catch (error) {
          console.error('Failed to auto-load payment info:', error);
        }
      }
    };

    autoLoadSavedInfo();
  }, [isAuthenticated, user, loadSavedPaymentInfo, dataLoaded]);

  // Reset form when payment info changes (e.g., when saved info is loaded)
  useEffect(() => {
    reset(paymentInfo);
  }, [paymentInfo, reset]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const formattedValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    return formattedValue.substring(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length >= 3) {
      return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
    } else if (digitsOnly.length === 2) {
      return `${digitsOnly}/`;
    }
    return digitsOnly;
  };

  // Save form data whenever values change
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        // Use timeout to avoid calling too frequently during typing
        const timeoutId = setTimeout(() => {
          updatePaymentInfo(getValues() as PaymentFormValues);
        }, 500);
        
        return () => clearTimeout(timeoutId);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [watch, updatePaymentInfo, getValues]);

  // Function to determine card type based on first digits
  const getCardType = (number: string) => {
    const firstDigit = number.replace(/\D/g, '').charAt(0);
    const firstTwoDigits = number.replace(/\D/g, '').substring(0, 2);
    
    if (firstDigit === '4') return <FaCcVisa className="text-blue-600" size={24} />;
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return <FaCcMastercard className="text-orange-600" size={24} />;
    if (firstDigit === '3') return <FaCcAmex className="text-blue-500" size={24} />;
    if (firstDigit === '6') return <FaCcDiscover className="text-orange-500" size={24} />;
    
    return <FaCreditCard className="text-gray-400" size={24} />;
  };

  const handleLoadSavedInfo = async () => {
    await loadSavedPaymentInfo();
  };

  return (
    <form className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Payment Information</h2>
        {isAuthenticated && savedPaymentInfo && (
          <button 
            type="button"
            onClick={handleLoadSavedInfo}
            className="text-primary-600 flex items-center text-sm"
          >
            <FaHistory className="mr-1" /> Load Saved
          </button>
        )}
      </div>
      
      <div>
        <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            className="input-field pr-12"
            {...register('cardNumber')}
            onChange={(e) => {
              const formattedValue = formatCardNumber(e.target.value);
              e.target.value = formattedValue;
              setValue('cardNumber', formattedValue, { shouldValidate: false });
            }}
            maxLength={19}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getCardType(cardNumber)}
          </div>
        </div>
        {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
      </div>
      
      <div>
        <label htmlFor="cardHolder" className="block text-gray-700 font-medium mb-1">
          Cardholder Name
        </label>
        <input
          id="cardHolder"
          type="text"
          placeholder="John Doe"
          className="input-field"
          {...register('cardHolder')}
        />
        {errors.cardHolder && <p className="form-error">{errors.cardHolder.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-1">
            Expiry Date (MM/YY)
          </label>
          <input
            id="expiryDate"
            type="text"
            placeholder="01/25"
            className="input-field"
            {...register('expiryDate')}
            onChange={(e) => {
              const formattedValue = formatExpiryDate(e.target.value);
              e.target.value = formattedValue;
              setValue('expiryDate', formattedValue, { shouldValidate: false });
            }}
            maxLength={5}
          />
          {errors.expiryDate && <p className="form-error">{errors.expiryDate.message}</p>}
        </div>
        
        <div>
          <label htmlFor="cvv" className="block text-gray-700 font-medium mb-1">
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            placeholder="123"
            className="input-field"
            {...register('cvv')}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, '');
              e.target.value = digitsOnly.substring(0, 4);
              setValue('cvv', e.target.value, { shouldValidate: false });
            }}
            maxLength={4}
          />
          {errors.cvv && <p className="form-error">{errors.cvv.message}</p>}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-2 text-gray-400">
            <FaCreditCard size={20} />
          </div>
          <p className="text-sm text-gray-600">
            This is a secure payment. Your card details are encrypted and secure.
            We do not store your full card number.
          </p>
        </div>
      </div>
    </form>
  );
} 