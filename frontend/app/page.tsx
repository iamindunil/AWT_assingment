'use client';

import Link from 'next/link';
import BookList from '@/components/books/BookList';
import { useAuth } from '@/context/AuthContext';
import { FaBook, FaShoppingCart, FaTags } from 'react-icons/fa';

export default function Home() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white rounded-lg p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Online Book Manager</h1>
        <p className="text-xl mb-6 max-w-3xl mx-auto">Discover, browse, and purchase books online with our updated collection and new pricing!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/books" className="btn-primary">
            Browse Books
          </Link>
          {!isAuthenticated && (
            <Link href="/auth/register" className="bg-white text-primary-700 font-medium py-2 px-4 rounded hover:bg-gray-100 transition-colors">
              Sign Up
            </Link>
          )}
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaTags className="text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold">Featured Books</h2>
          </div>
          <Link href="/books" className="text-primary-600 hover:underline flex items-center">
            View All <span className="ml-1">→</span>
          </Link>
        </div>
        <BookList featured={true} limit={4} />
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3 text-primary-600">
            <FaBook className="text-xl mr-2" />
            <h3 className="text-xl font-semibold">Wide Selection</h3>
          </div>
          <p className="text-gray-600">Browse our extensive collection of books across all genres.</p>
        </div>
        <div className="card bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3 text-primary-600">
            <FaShoppingCart className="text-xl mr-2" />
            <h3 className="text-xl font-semibold">Easy Checkout</h3>
          </div>
          <p className="text-gray-600">Simple and secure checkout process for a seamless experience.</p>
        </div>
        <div className="card bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-3 text-primary-600">
            <FaTags className="text-xl mr-2" />
            <h3 className="text-xl font-semibold">Competitive Pricing</h3>
          </div>
          <p className="text-gray-600">Our books are now priced between $10 and $100 for better affordability.</p>
        </div>
      </section>
    </div>
  );
} 