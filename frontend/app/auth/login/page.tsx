import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Login - Online Book Manager',
  description: 'Login to your account',
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 