'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFilter } from 'react-icons/fa';

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
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="all"
                checked={priceRange === 'all'}
                onChange={() => setPriceRange('all')}
                className="mr-2"
              />
              <span>All Prices</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="under-500"
                checked={priceRange === 'under-500'}
                onChange={() => setPriceRange('under-500')}
                className="mr-2"
              />
              <span>Under $500</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="500-750"
                checked={priceRange === '500-750'}
                onChange={() => setPriceRange('500-750')}
                className="mr-2"
              />
              <span>$500 - $750</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="over-750"
                checked={priceRange === 'over-750'}
                onChange={() => setPriceRange('over-750')}
                className="mr-2"
              />
              <span>Over $750</span>
            </label>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={applyFilters}
            className="btn-primary"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
} 