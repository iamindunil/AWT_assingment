import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Online Book Manager',
  description: 'Create a new account to start shopping for books',
};

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <RegisterForm />
      </div>
    </div>
  );
} 