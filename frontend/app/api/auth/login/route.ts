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
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: 'Login failed', successful: false },
        { status: response.status }
      );
    }
    
    // If login was successful, format the response for the frontend
    if (data.successful) {
      return NextResponse.json({
        successful: true,
        token: data.accessToken || data.tokens?.accessToken || data.token || 'dummy-token',
        user: data.user || {
          email,
          name: data.user?.name || email.split('@')[0],
        }
      });
    } else if (data.needsVerification) {
      // Pass through the verification needed response
      return NextResponse.json({
        successful: false,
        needsVerification: true,
        email: data.email,
        message: data.message || 'Please verify your email before logging in'
      });
    } else {
      return NextResponse.json({
        successful: false,
        message: data.message || 'Login failed'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error', successful: false },
      { status: 500 }
    );
  }
} 