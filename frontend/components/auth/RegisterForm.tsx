'use client';

import { useState, useCallback } from 'react';
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

const verificationSchema = z.object({
  code: z.string().min(6, 'Please enter the 6-digit verification code'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;
type VerificationFormValues = z.infer<typeof verificationSchema>;

export function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { register: registerUser, verifyEmail } = useAuth();
  
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

  const {
    register: registerVerification,
    handleSubmit: handleVerificationSubmit,
    formState: { errors: verificationErrors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = useCallback(async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setError('');
      const success = await registerUser(data.name, data.email, data.password);
      
      if (success) {
        setRegisteredEmail(data.email);
        setVerificationSent(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [registerUser]);

  const onVerificationSubmit = useCallback(async (data: VerificationFormValues) => {
    try {
      setIsSubmitting(true);
      setError('');
      const success = await verifyEmail(registeredEmail, data.code);
      
      if (success) {
        router.push('/auth/login');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [verifyEmail, registeredEmail, router]);

  const resendVerificationCode = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setError('');
      const response = await fetch('/api/email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: registeredEmail }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setError('Verification code resent. Please check your email.');
      } else {
        setError(data.message || 'Failed to resend verification code.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('An error occurred while resending the code.');
    } finally {
      setIsSubmitting(false);
    }
  }, [registeredEmail]);

  if (verificationSent) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <h2 className="text-xl font-semibold mb-2">Verification Code Sent!</h2>
          <p className="mb-4">
            We've sent a verification code to {registeredEmail}. Please enter the code below to verify your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 p-3 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleVerificationSubmit(onVerificationSubmit)} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-gray-700 font-medium mb-1">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              className="input-field"
              placeholder="Enter the 6-digit code"
              {...registerVerification('code')}
            />
            {verificationErrors.code && <p className="form-error">{verificationErrors.code.message}</p>}
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={resendVerificationCode}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              disabled={isSubmitting}
            >
              Didn't receive a code? Resend
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-400 p-3 rounded text-red-800 text-sm">
          {error}
        </div>
      )}
      
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