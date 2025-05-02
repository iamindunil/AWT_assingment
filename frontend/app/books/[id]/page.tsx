import { Metadata } from 'next';
import BookDetail from '@/components/books/BookDetail';

interface BookPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  try {
    // Fetch book data to generate dynamic metadata
    const response = await fetch(`http://localhost:5000/books/${params.id}`);
    const book = await response.json();
    
    return {
      title: `${book.title} - Online Book Manager`,
      description: book.description ? 
        `${book.description.substring(0, 160)}...` : 
        'Book details in Online Book Manager',
    };
  } catch (error) {
    console.error('Error fetching book for metadata:', error);
    return {
      title: 'Book Details - Online Book Manager',
      description: 'View book details and purchase books online',
    };
  }
}

export default function BookPage({ params }: BookPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <BookDetail id={params.id} />
    </div>
  );
} 