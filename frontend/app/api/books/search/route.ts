import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json([]);
    }
    
    // Forward the request to the backend
    const response = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ message: 'Failed to search books' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const books = await response.json();
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 