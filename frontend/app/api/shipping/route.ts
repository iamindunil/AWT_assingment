import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Get the backend URL from environment or use a fallback for development
const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://localhost:5000';
};

// Get shipping info for a user
export async function GET(request: NextRequest) {
  try {
    // Get the email from query
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/shipping-info/${email}`;
    
    console.log(`Fetching shipping info from: ${endpoint}`);
    
    const response = await axios.get(endpoint);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching shipping info:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to fetch shipping information' 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Create or update shipping info
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, address, postalcode, country } = data;
    
    if (!email || !address || !postalcode || !country) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const backendUrl = getBackendUrl();
    const endpoint = `${backendUrl}/shipping`;
    
    console.log(`Saving shipping info to: ${endpoint}`);
    
    // Try to create first, if it fails with 409 (conflict), then update
    try {
      const response = await axios.post(endpoint, data);
      return NextResponse.json(response.data);
    } catch (createError: any) {
      if (createError.response?.status === 409) {
        // Record already exists, attempt to update
        console.log('Shipping info already exists, updating instead');
        const updateResponse = await axios.put(endpoint, data);
        return NextResponse.json(updateResponse.data);
      }
      throw createError;
    }
  } catch (error: any) {
    console.error('Error saving shipping info:', error);
    
    return NextResponse.json(
      { 
        message: error.response?.data?.error || 'Failed to save shipping information' 
      },
      { status: error.response?.status || 500 }
    );
  }
} 