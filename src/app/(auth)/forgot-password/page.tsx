'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { forgetPassword } from '@/lib/auth';
import { forgotPasswordRedirect } from '@/lib/config/redirects.config';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsPending(true);
      await forgetPassword({
        email: data.email,
        redirectTo: forgotPasswordRedirect,
        fetchOptions: {
          onSuccess: () => {
            setIsSubmitted(true);
            toast.success('Password reset link sent to your email.');
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                'Failed to send reset link. Please try again.'
            );
          },
        },
      });
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-light tracking-tight md:text-3xl">
            Check your email
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions to reset your password.
          </p>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          Remember your password?{' '}
          <Link
            href="/sign-in"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-light tracking-tight md:text-3xl">
          Reset your password
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isPending}
              {...register('email')}
            />
            <FieldError errors={[errors.email]} />
          </FieldContent>
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-none"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Send reset link
        </Button>
      </form>
      <p className="text-muted-foreground text-center text-sm">
        Remember your password?{' '}
        <Link
          href="/sign-in"
          className="text-foreground font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
