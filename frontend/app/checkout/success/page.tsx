'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import Invoice from '@/components/checkout/Invoice';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { cartItems, totalPrice } = useCart();
  const [processingComplete, setProcessingComplete] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  const orderDate = new Date().toISOString();

  // Default shipping info if not available from context
  const defaultShippingInfo = {
    address: 'Customer Address',
    city: 'Customer City',
    state: 'Customer State',
    postalCode: '12345',
    country: 'Customer Country'
  };

  useEffect(() => {
    // Get saved order items from localStorage
    let savedOrderItems = [];
    if (typeof window !== 'undefined') {
      const savedOrderItemsStr = localStorage.getItem('lastOrderItems');
      if (savedOrderItemsStr) {
        try {
          savedOrderItems = JSON.parse(savedOrderItemsStr);
          // Use either cart items or saved order items (in case cart was cleared)
          setOrderItems(cartItems.length > 0 ? cartItems : savedOrderItems);
        } catch (e) {
          console.error('Error parsing saved order items:', e);
          setOrderItems(cartItems);
        }
      } else {
        setOrderItems(cartItems);
      }
    }

    // Show processing for 2 seconds before showing completed
    const processingTimer = setTimeout(() => {
      setProcessingComplete(true);
    }, 2000);

    // Show success for 1 second before showing invoice
    const invoiceTimer = setTimeout(() => {
      setShowInvoice(true);
    }, 3000);

    return () => {
      clearTimeout(processingTimer);
      clearTimeout(invoiceTimer);
    };
  }, [cartItems]);

  // If we're showing the invoice, render the Invoice component
  if (showInvoice) {    
    return (
      <Invoice
        orderItems={orderItems}
        shippingInfo={defaultShippingInfo}
        totalAmount={totalPrice}
        orderDate={orderDate}
        orderNumber={orderNumber}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          {!processingComplete ? (
            <FaSpinner className="mx-auto animate-spin text-primary-600" size={64} />
          ) : (
            <FaCheckCircle className="mx-auto text-green-500" size={64} />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {!processingComplete ? 'Processing Your Order' : 'Order Completed!'}
        </h1>

        <div className="mt-6">
          {!processingComplete ? (
            <p className="text-gray-600">
              Please wait while we process your payment and create your order...
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Your order has been successfully processed!
              </p>
              <p className="text-sm text-gray-500 animate-pulse">
                Preparing your invoice...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 