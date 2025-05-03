import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required', success: false },
        { status: 400 }
      );
    }
    
    // Forward the request to the backend
    const response = await fetch('http://localhost:5000/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.error || 'Registration failed', 
          success: false 
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      message: data.message || 'Registration successful',
      email: data.email,
      success: data.success !== undefined ? data.success : true,
      emailSent: data.emailSent
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
} 