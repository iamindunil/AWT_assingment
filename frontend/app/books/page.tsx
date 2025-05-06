import { useState } from 'react';
import { Metadata } from 'next';
import BookList from '@/components/books/BookList';
import { BookFilterSidebar } from '@/components/books/BookFilterSidebar';
import { FaTags, FaInfoCircle } from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Books - Online Book Manager',
  description: 'Browse our collection of books with our new competitive pricing',
};

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Browse Books</h1>
            
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white p-4 rounded-lg shadow-sm">
            <BookFilterSidebar />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <BookList />
        </div>
      </div>
    </div>
  );
} 