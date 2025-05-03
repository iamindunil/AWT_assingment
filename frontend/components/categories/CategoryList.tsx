import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CategoryList from '../../components/categories/CategoryList';

interface Book {
  id: string;
  title: string;
  authors: string[];
  price: number;
  description: string;
  thumbnail: string;
  stock: number;
  categories?: string[];
}

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const selectedCategory = typeof category === 'string' ? category : 'All';

  const [books, setBooks] = useState<Book[]>([]);

  const handleCategorySelect = (newCategory: string) => {
    router.push(`/categories/${newCategory}`);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) throw new Error('Failed to fetch books');
        const data: Book[] = await response.json();

        const filtered = selectedCategory === 'All'
          ? data
          : data.filter(book => book.categories?.includes(selectedCategory));
        setBooks(filtered);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    if (router.isReady) fetchBooks();
  }, [selectedCategory, router.isReady]);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-6">
      <CategoryList
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img src={book.thumbnail} alt={book.title} className="w-full h-48 object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.authors.join(', ')}</p>
            <p className="text-sm mt-1 line-clamp-3">{book.description}</p>
            <div className="mt-2 font-bold text-blue-600">${book.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
