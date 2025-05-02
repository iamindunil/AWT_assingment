import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Forward the request to the backend
    const response = await fetch(`http://localhost:5000/books/${params.id}`);
    
    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({ message: 'Failed to fetch book details' }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const book = await response.json();
    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
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