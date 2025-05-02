'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from 'react-icons/fa';
import Loader from '@/components/ui/Loader';

export default function CartDetails() {
  const { 
    cartItems, 
    totalItems, 
    totalPrice, 
    updateQuantity, 
    removeFromCart,
    clearCart,
    isLoading 
  } = useCart();
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const handleProceedToCheckout = () => {
    if (isAuthenticated) {
      router.push('/checkout');
    } else {
      router.push('/auth/login?redirect=checkout');
    }
  };
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any books to your cart yet.
        </p>
        <Link href="/books" className="btn-primary inline-block">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Cart Items ({totalItems})
            </h2>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center">
                <div className="flex-shrink-0 mr-4 mb-4 sm:mb-0">
                  <div className="relative w-20 h-28 bg-gray-200 rounded">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow mb-4 sm:mb-0">
                  <Link href={`/books/${item.id}`} className="font-medium hover:text-primary-600">
                    {item.title}
                  </Link>
                  <div className="text-primary-600 font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:w-32 sm:justify-end">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                
                <div className="sm:w-24 sm:text-right mt-4 sm:mt-0">
                  <div className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 flex items-center sm:justify-end mt-2"
                    aria-label="Remove item"
                  >
                    <FaTrash size={14} className="mr-1" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="p-6 border-t flex justify-between">
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear Cart
            </button>
            <Link href="/books" className="text-primary-600 hover:text-primary-800 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">$0.00</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            className="btn-primary w-full mt-6 flex items-center justify-center"
          >
            <span>Proceed to Checkout</span>
            <FaArrowRight className="ml-2" />
          </button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-600 mt-4">
              You'll need to log in before completing your purchase.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 