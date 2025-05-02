'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCheckout } from './CheckoutContext';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCreditCard } from 'react-icons/fa';

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^\d{16}$/, 'Card number must be 16 digits'),
  cardHolder: z.string().min(1, 'Cardholder name is required'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentForm() {
  const { paymentInfo, updatePaymentInfo } = useCheckout();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentInfo,
  });

  const cardNumber = watch('cardNumber', '');
  
  const onSubmit = (data: PaymentFormValues) => {
    updatePaymentInfo(data);
  };

  // Function to determine card type based on first digits
  const getCardType = (number: string) => {
    const firstDigit = number.charAt(0);
    const firstTwoDigits = number.substring(0, 2);
    
    if (firstDigit === '4') return <FaCcVisa className="text-blue-600" size={24} />;
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return <FaCcMastercard className="text-orange-600" size={24} />;
    if (firstDigit === '3') return <FaCcAmex className="text-blue-500" size={24} />;
    if (firstDigit === '6') return <FaCcDiscover className="text-orange-500" size={24} />;
    
    return <FaCreditCard className="text-gray-400" size={24} />;
  };

  // Format card number with spaces for display
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
  };

  return (
    <form onChange={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      
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