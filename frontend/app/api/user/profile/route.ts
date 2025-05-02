import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization token' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // For now, return mock user data since we don't have a working backend endpoint
    // In a real application, you'd verify the token with the backend
    return NextResponse.json({
      email: 'user@example.com',
      name: 'Example User',
    });
    
    // When your backend is ready, uncomment this code:
    /*
    const response = await fetch('http://localhost:5000/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch user profile' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 