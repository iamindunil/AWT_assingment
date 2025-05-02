import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Forward the request to the backend
    const response = await fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Login failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // If login was successful, format the response for the frontend
    if (data.successful) {
      return NextResponse.json({
        token: data.accessToken || 'dummy-token',
        user: {
          email,
          name: data.name || 'User',
        }
      });
    } else {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 