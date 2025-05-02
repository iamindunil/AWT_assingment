import { Metadata } from 'next';
import CartDetails from '@/components/cart/CartDetails';

export const metadata: Metadata = {
  title: 'Shopping Cart - Online Book Manager',
  description: 'View and manage your shopping cart',
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <CartDetails />
    </div>
  );
} 