import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    // Forward the request to the backend
    const response = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.error || 'Registration failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      message: 'Registration successful',
      user: {
        email: data.user.email,
        name: data.user.name,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 