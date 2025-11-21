'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggler } from '@/components/ui/theme-toggler';
import { useUser } from '@/hooks/use-user';
import { signOut } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import { ArrowRight, GithubIcon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { user, isPending } = useUser();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const features = [
    {
      name: 'End-to-End Type Safety',
      detail: 'Full type inference from database to UI',
    },
    {
      name: 'Built-in Authentication',
      detail: 'Email, OAuth & session management',
    },
    {
      name: 'Type-safe API',
      detail: 'Auto-generated typed API client',
    },
    {
      name: 'Database Ready',
      detail: 'Prisma ORM with type generation',
    },
    {
      name: 'Modern UI Components',
      detail: 'shadcn/ui with Tailwind v4 & dark mode',
    },
    {
      name: 'Production Ready',
      detail: 'Docker, env validation & logging',
    },
    {
      name: 'Developer Experience',
      detail: 'Fast compiler with quality checks',
    },
    {
      name: 'AI-Assisted Development',
      detail: 'Built-in context for AI collaboration',
    },
  ];

  const stack = [
    { name: 'Next.js 15', detail: 'React 19 with Turbopack' },
    { name: 'Better Auth', detail: 'Full-featured auth library' },
    { name: 'Prisma', detail: 'Type-safe PostgreSQL ORM' },
    { name: 'Hono', detail: 'Lightweight type-safe API' },
    { name: 'TanStack Query', detail: 'Async state management' },
    {
      name: 'Tailwind v4 + shadcn',
      detail: 'Modern UI components with dark mode',
    },
    { name: 'Zod + T3 Env', detail: 'Runtime validation library' },
    { name: 'Pino', detail: 'Structured logging system' },
    { name: 'ESLint + Prettier', detail: 'Linting and formatting' },
    { name: 'Husky + lint-staged', detail: 'Pre-commit quality checks' },
  ];

  const commands = [
    {
      id: 'install',
      label: 'Install dependencies',
      command: 'pnpm install',
    },
    {
      id: 'env',
      label: 'Configure environment',
      command: 'cp .env.example .env.local',
    },
    {
      id: 'db',
      label: 'Setup database',
      command: 'pnpm db:start && pnpm db:migrate',
    },
    {
      id: 'dev',
      label: 'Start development',
      command: 'pnpm dev',
    },
  ];

  const demoRoutes = [
    {
      href: '/sign-in',
      label: 'Sign In Page',
    },
    {
      href: '/sign-up',
      label: 'Sign Up Page',
    },
    {
      href: '/not-found',
      label: 'Not Found Page',
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-12 md:px-12 md:py-20">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-light tracking-tight">
            Axii Stack
          </h1>
          <div className="text-muted-foreground mt-1 font-mono text-sm">
            v1.0.0
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/axiidotsh/axii-stack"
            target="_blank"
            className="border-border hover:border-foreground hover:text-foreground text-muted-foreground inline-flex items-center gap-1.5 border-b pb-0.5 text-sm transition-colors"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
          <ThemeToggler />
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback className="border text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={async () => {
                    await signOut();
                  }}
                >
                  <LogOutIcon />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-20 md:mt-32">
        {/* Intro */}
        <div className="border-border border-l pl-6 md:pl-8">
          <p className="text-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
            A production-ready Next.js starter. Built with modern tools,
            configured for type-safety, and designed to deploy immediately.
          </p>
        </div>

        {/* Features */}
        <div className="mt-16 space-y-8 md:mt-24">
          <h2 className="text-foreground border-border border-l pl-6 text-lg font-medium md:pl-8">
            Features
          </h2>

          <div className="border-border border-t">
            {features.map((item, index) => (
              <div
                key={index}
                className="border-border group hover:bg-muted/30 flex items-baseline justify-between gap-2 border-b px-4 py-4 transition-colors md:px-6 md:py-5"
              >
                <div className="flex items-baseline gap-3 md:gap-4">
                  <span className="text-muted-foreground font-mono text-xs">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-foreground text-left font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="text-muted-foreground text-right text-sm">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stack List */}
        <div className="mt-16 space-y-8 md:mt-24">
          <h2 className="text-foreground border-border border-l pl-6 text-lg font-medium md:pl-8">
            Tech Stack
          </h2>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stack.map((item, index) => (
              <div
                key={index}
                className="border-border hover:border-foreground/20 dark:hover:border-foreground/20 hover:bg-muted/20 group border px-5 py-4 transition-all"
              >
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {item.name}
                  </span>
                  <span className="text-muted-foreground font-mono text-xs opacity-60">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-muted-foreground block text-xs leading-relaxed">
                  {item.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Pages */}
        <div className="mt-20 space-y-8 md:mt-32">
          <h2 className="text-foreground border-border border-l pl-6 text-lg font-medium md:pl-8">
            Demo Pages
          </h2>

          <div className="flex flex-col gap-3">
            {demoRoutes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                className="border-border hover:border-foreground dark:hover:border-border hover:bg-card group inline-flex items-center gap-3 border px-6 py-3 transition-all"
              >
                <span className="text-muted-foreground font-mono text-xs">
                  {route.href}
                </span>
                <span className="text-foreground text-sm font-medium">
                  {route.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-20 space-y-8 md:mt-32">
          <h2 className="text-foreground border-border border-l pl-6 text-lg font-medium md:pl-8">
            Getting Started
          </h2>

          <div className="space-y-6">
            {commands.map((cmd) => (
              <div key={cmd.id} className="group">
                <div className="text-muted-foreground mb-2 font-mono text-xs">
                  {cmd.label}
                </div>
                <div className="border-border bg-card relative border">
                  <code className="text-foreground block overflow-x-auto px-4 py-3 font-mono text-sm">
                    {cmd.command}
                  </code>
                  <button
                    onClick={() => copyToClipboard(cmd.command, cmd.id)}
                    className="hover:text-foreground text-muted-foreground absolute top-2 right-2 font-mono text-xs opacity-0 transition-all group-hover:opacity-100"
                    aria-label="Copy command"
                  >
                    {copied === cmd.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Step */}
          <div className="border-l pl-6 md:pl-8">
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <ArrowRight className="h-4 w-4" />
              <span>Open http://localhost:3000 to see your application</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground mt-32 pb-12 text-center font-mono text-xs">
        Production-ready Next.js starter
      </footer>
    </div>
  );
}
