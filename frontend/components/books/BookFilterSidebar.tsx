'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter, FaDollarSign, FaUndo } from 'react-icons/fa';

export function BookFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const currentPrice = searchParams.get('price') || 'all';
  
  // Initialize filter state
  const [priceRange, setPriceRange] = useState(currentPrice);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Handle filter changes
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Add price filter if not 'all'
    if (priceRange !== 'all') {
      params.set('price', priceRange);
    }
    
    // Add any search query if it exists
    const query = searchParams.get('q');
    if (query) {
      params.set('q', query);
    }
    
    // Construct the new URL
    const newUrl = `/books${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
    
    // Close mobile filters if open
    setShowMobileFilters(false);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setPriceRange('all');
    
    // Keep search query if it exists
    const query = searchParams.get('q');
    if (query) {
      router.push(`/books?q=${query}`);
    } else {
      router.push('/books');
    }
    
    // Close mobile filters if open
    setShowMobileFilters(false);
  };
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Mobile filter toggle */}
      <button
        className="w-full flex items-center justify-between lg:hidden mb-4 text-gray-700 font-medium"
        onClick={toggleMobileFilters}
      >
        <span className="flex items-center">
          <FaFilter className="mr-2" /> Filters
        </span>
        <span>{showMobileFilters ? '−' : '+'}</span>
      </button>
      
      {/* Filter content - hidden on mobile unless toggled */}
      <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
        <h2 className="text-lg font-semibold mb-4 hidden lg:block">Filters</h2>
        
        <div className="mb-6">
          <h3 className="font-medium mb-2 flex items-center">
            <FaDollarSign className="text-primary-600 mr-1" /> 
            Price Range
          </h3>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer hover:text-primary-600">
              <input
                type="radio"
                name="price"
                value="all"
                checked={priceRange === 'all'}
                onChange={() => setPriceRange('all')}
                className="mr-2 accent-primary-600"
              />
              <span>All Prices</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-primary-600">
              <input
                type="radio"
                name="price"
                value="under-25"
                checked={priceRange === 'under-25'}
                onChange={() => setPriceRange('under-25')}
                className="mr-2 accent-primary-600"
              />
              <span>Under $25</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-primary-600">
              <input
                type="radio"
                name="price"
                value="25-50"
                checked={priceRange === '25-50'}
                onChange={() => setPriceRange('25-50')}
                className="mr-2 accent-primary-600"
              />
              <span>$25 - $50</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-primary-600">
              <input
                type="radio"
                name="price"
                value="50-75"
                checked={priceRange === '50-75'}
                onChange={() => setPriceRange('50-75')}
                className="mr-2 accent-primary-600"
              />
              <span>$50 - $75</span>
            </label>
            <label className="flex items-center cursor-pointer hover:text-primary-600">
              <input
                type="radio"
                name="price"
                value="over-75"
                checked={priceRange === 'over-75'}
                onChange={() => setPriceRange('over-75')}
                className="mr-2 accent-primary-600"
              />
              <span>$75 - $100</span>
            </label>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={applyFilters}
            className="bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors flex justify-center items-center"
          >
            <FaFilter className="mr-2" /> Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 transition-colors flex justify-center items-center"
          >
            <FaUndo className="mr-2" /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
} 