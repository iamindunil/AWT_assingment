'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const success = await registerUser(data.name, data.email, data.password);
      
      if (success) {
        setVerificationSent(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="text-center py-4">
        <h2 className="text-xl font-semibold mb-2">Verification Email Sent!</h2>
        <p className="mb-4">
          We've sent a verification email to your address. Please check your inbox and verify your account.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="btn-primary w-full"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className="input-field"
          {...register('name')}
        />
        {errors.name && <p className="form-error">{errors.name.message}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="input-field"
          {...register('email')}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input-field"
          {...register('password')}
        />
        {errors.password && <p className="form-error">{errors.password.message}</p>}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="input-field"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
} 