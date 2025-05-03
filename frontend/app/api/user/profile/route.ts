import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

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
    
    try {
      // Decode token to get user info
      const tokenData = jwtDecode(token);
      if (tokenData && tokenData.email && tokenData.name) {
        // Return the user data from the token
        return NextResponse.json({
          email: tokenData.email,
          name: tokenData.name,
        });
      }
    } catch (decodeError) {
      console.error('Error decoding token:', decodeError);
    }
    
    // Fallback: Forward the request to the backend
    const response = await fetch('http://localhost:5000/auth/user', {
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
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 