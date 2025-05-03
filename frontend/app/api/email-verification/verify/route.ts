import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;
    
    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { message: 'Email and verification code are required', success: false, verified: false },
        { status: 400 }
      );
    }
    
    // Forward the verification request to the backend
    const response = await fetch('http://localhost:5000/email-verification/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.error || 'Verification failed',
          verified: false
        },
        { status: response.status }
      );
    }
    
    // Return success response
    return NextResponse.json({ 
      message: data.message || 'Email verified successfully',
      verified: data.verified !== undefined ? data.verified : true
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error', verified: false },
      { status: 500 }
    );
  }
} 