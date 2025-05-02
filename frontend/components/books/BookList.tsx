'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import Loader from '@/components/ui/Loader';

interface Book {
  id: string;
  title: string;
  authors: string[];
  price: number;
  description: string;
  thumbnail: string;
  stock: number;
}

interface BookListProps {
  featured?: boolean;
  limit?: number;
  searchQuery?: string;
}

export default function BookList({ featured = false, limit, searchQuery }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/books';
        
        if (searchQuery) {
          endpoint = `/api/books/search?q=${encodeURIComponent(searchQuery)}`;
        }
        
        const { data } = await axios.get(endpoint);
        let filteredBooks = data;
        
        // If featured is true, sort by some criteria (e.g., highest stock)
        if (featured) {
          filteredBooks = data.sort((a: Book, b: Book) => b.stock - a.stock);
        }
        
        // Apply limit if provided
        if (limit && limit > 0) {
          filteredBooks = filteredBooks.slice(0, limit);
        }
        
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [featured, limit, searchQuery]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No books found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
} 