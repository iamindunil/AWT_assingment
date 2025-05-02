import Link from 'next/link';
import BookList from '@/components/books/BookList';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="bg-primary-700 text-white rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Online Book Manager</h1>
        <p className="text-xl mb-6">Discover, browse, and purchase books online</p>
        <div className="flex justify-center gap-4">
          <Link href="/books" className="btn-primary">
            Browse Books
          </Link>
          <Link href="/auth/register" className="bg-white text-primary-700 font-medium py-2 px-4 rounded hover:bg-gray-100 transition-colors">
            Sign Up
          </Link>
        </div>
      </section>
      
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Books</h2>
          <Link href="/books" className="text-primary-600 hover:underline">
            View All
          </Link>
        </div>
        <BookList featured={true} limit={4} />
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">Browse our extensive collection of books across all genres.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
          <p className="text-gray-600">Simple and secure checkout process for a seamless experience.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Get your favorite books delivered to your doorstep quickly.</p>
        </div>
      </section>
    </div>
  );
} 