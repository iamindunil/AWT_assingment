import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the backend URL from environment or use a fallback for development
const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://localhost:5000';
};

// Get billing/payment info from cookie
export async function GET() {
  try {
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/payments/`;
    
    console.log(`Fetching payment info from: ${endpoint}`);
    
    // The backend will check cookies and return appropriate data
    const response = await axios.get(endpoint, { withCredentials: true });
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching payment info:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to fetch payment information' 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Save billing/payment info to cookie
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, payment_method, card_number, exp_date } = data;
    
    if (!email || !payment_method || !card_number || !exp_date) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/payments`;
    
    console.log(`Saving payment info to: ${endpoint}`);
    
    const response = await axios.post(endpoint, data, { withCredentials: true });
    
    // Pass back the Set-Cookie header from the backend response
    const headers = new Headers();
    if (response.headers['set-cookie'] && Array.isArray(response.headers['set-cookie'])) {
      // Join multiple cookies if there are any
      headers.set('Set-Cookie', response.headers['set-cookie'].join('; '));
    } else if (response.headers['set-cookie']) {
      headers.set('Set-Cookie', response.headers['set-cookie'] as string);
    }
    
    return NextResponse.json(response.data, { headers });
  } catch (error: any) {
    console.error('Error saving payment info:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to save payment information' 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Delete billing/payment info from cookie
export async function DELETE() {
  try {
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/payment`;
    
    console.log(`Deleting payment info from: ${endpoint}`);
    
    const response = await axios.delete(endpoint, { withCredentials: true });
    
    // Pass back the Set-Cookie header from the backend response to clear the cookie
    const headers = new Headers();
    if (response.headers['set-cookie'] && Array.isArray(response.headers['set-cookie'])) {
      // Join multiple cookies if there are any
      headers.set('Set-Cookie', response.headers['set-cookie'].join('; '));
    } else if (response.headers['set-cookie']) {
      headers.set('Set-Cookie', response.headers['set-cookie'] as string);
    }
    
    return NextResponse.json(response.data, { headers });
  } catch (error: any) {
    console.error('Error deleting payment info:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to delete payment information' 
      },
      { status: error.response?.status || 500 }
    );
  }
} 