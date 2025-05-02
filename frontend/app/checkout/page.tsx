import { Metadata } from 'next';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { CheckoutProvider } from '@/components/checkout/CheckoutContext';

export const metadata: Metadata = {
  title: 'Checkout - Online Book Manager',
  description: 'Complete your purchase',
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutProvider>
        <CheckoutForm />
      </CheckoutProvider>
    </div>
  );
} 