import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the backend URL from environment or use a fallback for development
const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://localhost:5000';
};

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    // In a real app, we would verify that the requesting user can only access their own order history
    // For now, we'll just make the API call to the backend
    
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/checkout-history/${email}`;
    
    console.log(`Fetching order history from backend at: ${endpoint}`);
    
    const response = await axios.get(endpoint, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Received ${response.data.length} orders from backend`);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching order history:', error);
    
    // Log more detailed error information
    if (error.response) {
      console.error('Backend error response:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('No response received from backend. Request:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to fetch order history' 
      },
      { status: error.response?.status || 500 }
    );
  }
} 