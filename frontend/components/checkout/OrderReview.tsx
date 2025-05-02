'use client';

import { useCheckout } from './CheckoutContext';
import { useCart } from '@/context/CartContext';
import { FaEdit, FaCreditCard, FaShippingFast } from 'react-icons/fa';
import Link from 'next/link';

interface OrderReviewProps {
  onPlaceOrder: () => Promise<boolean>;
  onPrevStep: () => void;
  isSubmitting: boolean;
}

export default function OrderReview({ onPlaceOrder, onPrevStep, isSubmitting }: OrderReviewProps) {
  const { shippingInfo, paymentInfo } = useCheckout();
  const { cartItems, totalItems, totalPrice } = useCart();

  const handlePlaceOrder = async () => {
    await onPlaceOrder();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>

      {/* Shipping Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <FaShippingFast className="text-primary-600 mr-2" size={18} />
            <h3 className="font-semibold">Shipping Information</h3>
          </div>
          <button
            onClick={onPrevStep}
            className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
          >
            <FaEdit className="mr-1" size={14} />
            Edit
          </button>
        </div>
        <div className="ml-6 text-gray-700">
          <p>{shippingInfo.address}</p>
          <p>
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
          </p>
          <p>{shippingInfo.country}</p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <FaCreditCard className="text-primary-600 mr-2" size={18} />
            <h3 className="font-semibold">Payment Information</h3>
          </div>
          <button
            onClick={onPrevStep}
            className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
          >
            <FaEdit className="mr-1" size={14} />
            Edit
          </button>
        </div>
        <div className="ml-6 text-gray-700">
          <p>
            Card ending in {paymentInfo.cardNumber.slice(-4)}
          </p>
          <p>
            {paymentInfo.cardHolder}
          </p>
          <p>
            Expires {paymentInfo.expiryDate}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                <span className="font-medium">{item.title}</span>
                <span className="text-gray-600 ml-2">× {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total ({totalItems} items)</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="text-sm text-gray-600">
        <p>
          By clicking "Place Order", you agree to our{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isSubmitting}
        className="btn-primary w-full py-3 mt-6"
      >
        {isSubmitting ? 'Processing Order...' : 'Place Order'}
      </button>
    </div>
  );
} 