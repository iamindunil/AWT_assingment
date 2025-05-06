'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from './BookCard';
import Loader from '@/components/ui/Loader';
import { roundPrice } from '@/utils/formatters';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const priceFilter = searchParams.get('price') || 'all';

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let endpoint = '/api/books';
        
        if (searchQuery) {
          endpoint = `/api/books/search?q=${encodeURIComponent(searchQuery)}`;
        }
        
        // Add cache-busting timestamp
        const timestamp = Date.now();
        endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}_t=${timestamp}`;
        
        const { data } = await axios.get(endpoint, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        // Ensure all book prices are rounded consistently
        let processedBooks = data.map((book: Book) => ({
          ...book,
          price: roundPrice(book.price)
        }));
        
        // Apply price filtering
        if (priceFilter !== 'all') {
          processedBooks = processedBooks.filter((book: Book) => {
            const price = book.price;
            switch (priceFilter) {
              case 'under-25':
                return price < 25;
              case '25-50':
                return price >= 25 && price <= 50;
              case '50-75':
                return price > 50 && price <= 75;
              case 'over-75':
                return price > 75;
              default:
                return true;
            }
          });
        }
        
        // If featured is true, sort by some criteria (e.g., highest stock)
        if (featured) {
          processedBooks = processedBooks.sort((a: Book, b: Book) => b.stock - a.stock);
        }
        
        // Apply limit if provided
        if (limit && limit > 0) {
          processedBooks = processedBooks.slice(0, limit);
        }
        
        setBooks(processedBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [featured, limit, searchQuery, priceFilter]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg p-6">
        <p className="text-gray-500 mb-2">No books found matching your criteria.</p>
        <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">Showing {books.length} book{books.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
} 