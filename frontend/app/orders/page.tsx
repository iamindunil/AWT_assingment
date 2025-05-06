'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaBook, FaCalendarAlt, FaDollarSign, FaSpinner, FaShoppingCart } from 'react-icons/fa';

interface OrderHistoryItem {
  email: string;
  book_isbn: string;
  total_price: number | string;
  qty: number;
  checkout_date_and_time: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      try {
        setIsLoading(true);
        console.log(`Fetching order history for: ${user.email}`);
        
        // Use the Next.js API route with query parameter
        const encodedEmail = encodeURIComponent(user.email);
        const { data } = await axios.get(`/api/checkout-history?email=${encodedEmail}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        console.log('Order history data:', data);
        
        // Ensure total_price is a number in each order
        const processedOrders = data.map((order: any) => ({
          ...order,
          total_price: typeof order.total_price === 'string' 
            ? parseFloat(order.total_price) 
            : order.total_price,
          qty: typeof order.qty === 'string' ? parseInt(order.qty, 10) : order.qty
        }));
        
        setOrders(processedOrders);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, [isAuthenticated, user, router]);

  // Format price safely
  const formatPrice = (price: number | string) => {
    if (price === null || price === undefined) return '0.00';
    
    // Parse string to float if it's a string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    if (isNaN(numPrice)) return '0.00';
    
    // Format with 2 decimal places
    return numPrice.toFixed(2);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Order History</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-primary-600 mr-2" size={24} />
          <span>Loading your orders...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't made any purchases yet. Start shopping to see your order history.
          </p>
          <button 
            onClick={() => router.push('/books')}
            className="btn-primary px-6"
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaBook className="text-primary-600 mr-2" />
                  Order #{index + 1}
                </h3>
                <span className="text-sm text-gray-500 flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {new Date(order.checkout_date_and_time).toLocaleDateString()}
                </span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium">{order.book_isbn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{order.qty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-medium flex items-center">
                      <FaDollarSign className="text-green-600" size={14} />
                      {formatPrice(order.total_price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 