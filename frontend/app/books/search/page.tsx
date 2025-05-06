'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookList from '@/components/books/BookList';
import { BookFilterSidebar } from '@/components/books/BookFilterSidebar';
import Link from 'next/link';
import { FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/books" className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-4">
          <FaArrowLeft className="mr-2" />
          Back to Books
        </Link>
        <div className="bg-gradient-to-r from-primary-600/10 to-transparent p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FaSearch className="text-primary-600 text-2xl mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Search Results for <span className="text-primary-600">"{query}"</span>
            </h1>
          </div>
          <p className="text-gray-600 ml-9">Find your next favorite book from our collection</p>
        </div>
      </div>
      
      {/* Mobile filter toggle */}
      <button 
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="lg:hidden flex items-center justify-center bg-primary-600 text-white px-4 py-2 rounded-lg mb-4 w-full"
      >
        <FaFilter className="mr-2" />
        {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block lg:col-span-1`}>
          <div className="sticky top-4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaFilter className="mr-2 text-primary-600" /> 
              Refine Results
            </h2>
            <BookFilterSidebar />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <BookList searchQuery={query} />
        </div>
      </div>
    </div>
  );
} 