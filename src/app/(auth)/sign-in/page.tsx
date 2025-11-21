'use client';

import { SocialSignIn } from '@/app/(auth)/_components/social-sign-in';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { isLastUsedLoginMethod, signIn } from '@/lib/auth';
import { signInRedirect } from '@/lib/config/redirects.config';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [isPending, setIsPending] = useState(false);
  const isLastUsed = isLastUsedLoginMethod('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsPending(true);
      await signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: signInRedirect,
        fetchOptions: {
          onSuccess: () => {
            toast.success('Successfully signed in!');
          },
          onError: (ctx) => {
            toast.error(
              ctx.error.message || 'Failed to sign in. Please try again.'
            );
          },
        },
      });
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-light tracking-tight md:text-3xl">
          Welcome back
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sign in to your account to continue
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field data-invalid={!!errors.email}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            {isLastUsed && (
              <Badge
                variant="secondary"
                className="border-primary/10 rounded-none border"
              >
                Last used
              </Badge>
            )}
          </div>
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
        <Field data-invalid={!!errors.password}>
          <div className="flex items-center justify-between gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              disabled={isPending}
              {...register('password')}
            />
            <FieldError errors={[errors.password]} />
          </FieldContent>
        </Field>
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-none"
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Sign in
        </Button>
      </form>
      <SocialSignIn />
      <p className="text-muted-foreground text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link
          href="/sign-up"
          className="text-foreground font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
