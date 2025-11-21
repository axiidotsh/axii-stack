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
import { resetPassword } from '@/lib/auth';
import { resetPasswordRedirect } from '@/lib/config/redirects.config';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    try {
      setIsPending(true);
      await resetPassword({
        newPassword: data.password,
        token,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Password reset successfully. Please sign in.');
            router.push(resetPasswordRedirect);
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message ||
                'Failed to reset password. The link may have expired.'
            );
          },
        },
      });
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsPending(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-light tracking-tight md:text-3xl">
            Invalid reset link
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button size="lg" className="w-full rounded-none">
            Request new link
          </Button>
        </Link>
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
          Set new password
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Enter a new password for your account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">New password</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Create a new password (min. 8 characters)"
              disabled={isPending}
              {...register('password')}
            />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <FieldContent>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              disabled={isPending}
              {...register('confirmPassword')}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </FieldContent>
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-none"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Reset password
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
