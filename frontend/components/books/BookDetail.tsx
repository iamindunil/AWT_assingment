'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
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

interface BookDetailProps {
  id: string;
}

export default function BookDetail({ id }: BookDetailProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        console.log(`Fetching book with ID: ${id}`);
        const response = await axios.get(`/api/books/${id}`);
        console.log('Book data:', response.data);
        setBook(response.data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book) return;
    
    // Add the book to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price,
        thumbnail: book.thumbnail,
      });
    }
    
    // Redirect to cart page
    router.push('/cart');
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (book && newQuantity >= 1 && newQuantity <= book.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !book) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Book not found'}</p>
        <button 
          onClick={() => router.push('/books')}
          className="mt-4 btn-primary"
        >
          Back to Books
        </button>
      </div>
    );
  }

  // Format the price with 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(book.price);

  return (
    <div>
      <button 
        onClick={() => router.back()}
        className="flex items-center text-primary-600 hover:text-primary-800 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden">
          {book.thumbnail ? (
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          
          <p className="text-gray-600 text-lg mb-4">
            {book.authors?.length > 0
              ? book.authors.join(', ')
              : 'Unknown Author'}
          </p>
          
          <div className="text-2xl font-bold text-gray-800 mb-4">
            {formattedPrice}
          </div>
          
          <div className="mb-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-1">Availability:</p>
              {book.stock > 0 ? (
                <p className="text-green-600">
                  In Stock ({book.stock} available)
                </p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
            
            {book.stock > 0 && (
              <div className="flex items-center mb-6">
                <span className="mr-4">Quantity:</span>
                <div className="flex">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="bg-gray-200 px-3 py-1 rounded-l-md disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="bg-gray-100 px-4 py-1 flex items-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= book.stock}
                    className="bg-gray-200 px-3 py-1 rounded-r-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <button
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              className="w-full flex items-center justify-center btn-primary py-3"
            >
              <FaShoppingCart className="mr-2" />
              {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {book.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 