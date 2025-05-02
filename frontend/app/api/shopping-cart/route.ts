import { NextResponse } from 'next/server';

// Mock cart storage - in a real app, you'd use a database
const userCarts = new Map<string, any[]>();

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // In a real implementation, you would verify the token
    // and extract the user ID from it
    const token = authHeader.split(' ')[1];
    const userId = 'mock-user-id'; // Mock user ID for demonstration
    
    // Return the user's cart or an empty array if not found
    const cart = userCarts.get(userId) || [];
    return NextResponse.json(cart);
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // In a real implementation, you would verify the token
    // and extract the user ID from it
    const token = authHeader.split(' ')[1];
    const userId = 'mock-user-id'; // Mock user ID for demonstration
    
    // Get the cart data from the request body
    const cartItems = await request.json();
    
    // Validate that cartItems is an array
    if (!Array.isArray(cartItems)) {
      return NextResponse.json(
        { message: 'Invalid cart data, expected an array' },
        { status: 400 }
      );
    }
    
    // Store the cart for the user
    userCarts.set(userId, cartItems);
    
    return NextResponse.json({ message: 'Cart updated successfully' });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 