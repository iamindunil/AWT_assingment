import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to the backend
    const response = await fetch('http://localhost:5000/books');
    
    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ message: 'Failed to fetch books' }),
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
    console.error('Error fetching books:', error);
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