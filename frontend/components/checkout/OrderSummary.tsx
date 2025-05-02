'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FaBox } from 'react-icons/fa';

export default function OrderSummary() {
  const { cartItems, totalItems, totalPrice } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Items ({totalItems})</span>
          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">$0.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">$0.00</span>
        </div>
      </div>
      
      <div className="flex justify-between mb-6">
        <span className="font-bold">Total</span>
        <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Items in Order</h3>
        {cartItems.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center">
                <div className="h-14 w-10 bg-gray-200 rounded mr-2 relative flex-shrink-0">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaBox className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${item.price.toFixed(2)} × {item.quantity}</span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No items in cart</p>
        )}
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
        <p className="text-xs text-gray-600">
          By completing your purchase, you agree to our{' '}
          <a href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
} 