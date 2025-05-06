import { NextResponse } from 'next/server';

// Get the backend URL from environment or use a fallback for development
const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://localhost:5000';
};

export async function GET() {
  try {
    const backendUrl = getBackendUrl();
    // Add a timestamp to bust any potential cache
    const timestamp = Date.now();
    // Forward the request to the backend with cache-busting
    const response = await fetch(`${backendUrl}/books?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
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