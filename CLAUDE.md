# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

**AI Assistant Context:**
You are a Senior Full-stack Developer and an Expert in TypeScript, Next.js 15, React 19, Hono, Prisma, PostgreSQL, TailwindCSS, and modern UI/UX frameworks like shadcn/ui. You are collaborating with a human developer on a production-ready full-stack application.

## Project Overview

Production-ready Next.js 15 project with integrated backend API using Hono, featuring end-to-end type safety from database to frontend with Better Auth authentication.

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker (for local PostgreSQL)

## Quick Start

```bash
pnpm install          # Install dependencies
cp .env.example .env.local  # Copy environment file
pnpm db:start        # Start PostgreSQL container
pnpm db:migrate      # Run database migrations
pnpm dev             # Start development server (localhost:3000)
```

## Common Commands

### Development

```bash
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Run production build
pnpm lint             # Lint all code
pnpm lint:fix         # Lint and auto-fix
```

### Database

```bash
pnpm db:start         # Start PostgreSQL container
pnpm db:stop          # Stop container
pnpm db:migrate       # Create and run migrations
pnpm db:generate      # Generate Prisma client
pnpm db:studio        # Open Prisma Studio GUI
pnpm db:seed          # Seed database
pnpm db:reset         # Reset database (caution: deletes data)
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript with strict mode
- **Database**: PostgreSQL 17 with Prisma 6.17.1 ORM
- **API**: Hono 4.10.1 (lightweight, type-safe)
- **Auth**: Better Auth 1.3.28 with email/password + Google OAuth
- **Email**: Resend for transactional emails (verification, password resets)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State**: TanStack Query for async state management
- **Validation**: Zod 4.1.12 for runtime type checking
- **Logging**: Pino with structured logging

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/[[...route]]/  # Hono API catch-all
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── backend/               # Backend logic
│   ├── db/
│   │   ├── schema.prisma  # Database schema
│   │   └── index.ts       # Prisma client
│   ├── routers/           # API endpoints
│   ├── services/          # Backend services
│   │   └── email.ts       # Email service (Resend)
│   ├── auth.ts            # Better Auth config
│   ├── index.ts           # Hono app
│   ├── rpc.ts             # Type-safe RPC client
│   └── logger.ts          # Pino logging
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── emails/                # Email templates (React Email)
│   ├── verification-email.tsx
│   └── password-reset-email.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
│   ├── config/env/        # Environment validation
│   ├── auth.ts            # Better Auth client
│   └── utils.ts           # Helper functions
└── styles/
    └── globals.css        # Tailwind styles
```

### Key Patterns

**Server-First**: Default to server components; use `'use client'` only when needed for interactivity.

**Type Safety**: End-to-end type safety using:

- Prisma for database types
- Zod for runtime validation
- Hono RPC client for API type inference
- T3 Env for validated environment variables

**Authentication**: Better Auth handles:

- Email/password authentication with email verification
- Google OAuth
- Password reset flow with email tokens
- Session management with PostgreSQL
- CSRF protection
- Role-based access control (USER, ADMIN, SUPER_ADMIN)

**Email Service**: Resend integration at `src/backend/services/email.ts`:

- Email verification on signup
- Password reset emails
- React Email templates at `src/emails/`
- Type-safe email sending with error handling

**API Architecture**: Hono integrated via Next.js catch-all route at `/api/[[...route]]`:

```typescript
// Backend: src/backend/routers/users.ts
export const usersRouter = new Hono().get('/all', async (c) => {
  const users = await prisma.user.findMany();
  return c.json({ success: true, data: users });
});

// Frontend: Use type-safe RPC client
const { data } = await rpc.api.users.all.$get();
```

**Database**: Prisma with PostgreSQL:

- Schema at `src/backend/db/schema.prisma`
- Auto-generated types and migrations
- Singleton client pattern to prevent connection exhaustion

**Environment Variables**: Type-safe with T3 Env and Zod validation:

- Server-side: `src/lib/config/env/server.ts`
  - `NODE_ENV`, `DATABASE_URL`, `BETTER_AUTH_SECRET`
  - `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Client-side: `src/lib/config/env/client.ts` (must have `NEXT_PUBLIC_` prefix)
  - `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`

## Coding Standards

### Code Style

- TypeScript strict mode enabled
- **Type Definitions**: Prefer `interface` for object shapes, `type` for unions/intersections
- Use descriptive variable names with auxiliary verbs (`isLoading`, `hasError`)
- Favor iteration and modularization over duplication
- **IMPORTANT**: Avoid comments unless absolutely necessary for non-obvious edge cases - code should be self-documenting
- Use functional components with TypeScript interfaces
- Prefer composition over inheritance
- Use async/await everywhere with proper error handling

### Import Aliases

**CRITICAL**: Always use import aliases for local files.

```typescript
// ✅ CORRECT
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

// ❌ WRONG - Never use relative paths
import { Button } from '../../../components/ui/button';
```

### Naming Conventions

- **Directories**: kebab-case (`user-profile/`, `api-client/`)
- **Components**: kebab-case (`user-profile.tsx`)
- **Variables/Functions**: camelCase (`getUserData`, `isLoading`)
- **Custom Hooks**: Prefix with `use` (`useUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Booleans**: Prefix with `is`, `has`, `should` (`isLoading`, `hasError`)
- **NEVER create `index.ts` barrel files** - Always use direct imports with explicit paths

### Type Safety

- Always define types - never use `any`
- Use Zod schemas first, then infer types: `type User = z.infer<typeof UserSchema>`
- Validate all user input at runtime with Zod
- Use Prisma's generated types for database operations

### API Patterns

**Standard Response Format**:

```typescript
{
  success: boolean;
  data: T | null;
  message: string;
  errors?: unknown;
}
```

**Router Pattern**:

```typescript
export const postsRouter = new Hono()
  .get('/', async (c) => {
    const posts = await prisma.post.findMany();
    return c.json({ success: true, data: posts });
  })
  .post('/', async (c) => {
    const body = await c.req.json();
    const result = PostSchema.safeParse(body);
    if (!result.success) {
      return c.json({ success: false, errors: result.error }, 400);
    }
    const post = await prisma.post.create({ data: result.data });
    return c.json({ success: true, data: post }, 201);
  });
```

### Component Patterns

**Server Component** (default):

```typescript
export default async function Page() {
  const data = await prisma.user.findMany();
  return <div>{/* render */}</div>;
}
```

**Client Component** (when interactivity needed):

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**State Management**:

- TanStack Query for server state (API calls)
- React hooks for local UI state
- Extract complex logic into custom hooks

**Forms**: React Hook Form with Zod validation

```typescript
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});
```

### Authentication Patterns

**Check Auth in Server Component**:

```typescript
import { auth } from '@/backend/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');
  return <div>Welcome {session.user.name}</div>;
}
```

**Use in Client Component**:

```typescript
'use client';

import { useUser } from '@/hooks/use-user';

export function UserProfile() {
  const { user, isPending } = useUser();
  if (isPending) return <Spinner />;
  if (!user) return <div>Not logged in</div>;
  return <div>{user.name}</div>;
}
```

**Sign In/Out**:

```typescript
import { signIn, signOut } from '@/lib/auth';

await signIn.email({ email, password, callbackURL: '/' });
await signOut();
```

### UI Components

- Use shadcn/ui components: `pnpm shadcn add button`
- Tailwind CSS for all styling with theme variables
- Use Lucide React for icons
- Prefer `Skeleton` for loading states
- Support light/dark mode with `next-themes`
- Use `cn()` helper for conditional classes

### Database Best Practices

- Always use Prisma client - never raw SQL
- Use `select` to fetch only needed fields
- Handle not found cases explicitly
- Use transactions for multi-step operations
- Validate input with Zod before database calls
- Never expose sensitive data (passwords, tokens)

### Security

- Never expose secrets in code or responses
- Always validate user input with Zod
- Use proper HTTP status codes
- Implement proper error handling
- Check authentication and authorization server-side
- Use HTTPS in production

## Common Workflows

### Add New Page

```bash
mkdir -p src/app/settings
# Create src/app/settings/page.tsx with component
```

### Add New API Endpoint

```bash
# 1. Create router: src/backend/routers/posts.ts
# 2. Register in src/backend/index.ts: app.route('/posts', postsRouter)
# 3. Use via RPC: await rpc.api.posts.all.$get()
```

### Add New Database Model

```bash
# 1. Edit src/backend/db/schema.prisma
# 2. pnpm db:format
# 3. pnpm db:migrate (name: "add_posts_model")
# 4. Create API router and frontend components
```

### Add OAuth Provider

```bash
# 1. Update src/backend/auth.ts socialProviders config
# 2. Add env vars (CLIENT_ID, CLIENT_SECRET)
# 3. Update src/lib/config/env/server.ts validation
# 4. Create sign-in button component
```

## Troubleshooting

### Database Connection Error

```bash
docker ps                  # Check Docker running
pnpm db:start             # Start container
pnpm db:logs              # Check logs
```

### Prisma Client Out of Sync

```bash
pnpm db:generate          # Regenerate client
pnpm db:migrate           # Run migrations
# Restart dev server
```

### Environment Variables Not Found

- Check `.env.local` exists and has all required vars
- Restart dev server (required for env changes)
- Verify T3 Env validation in `src/lib/config/env/`

### TypeScript Errors After Schema Change

```bash
pnpm db:generate          # Update Prisma types
# Restart TypeScript server in IDE
```

### Clear Caches

```bash
rm -rf .next              # Clear Next.js cache
rm -rf node_modules && pnpm install  # Reinstall deps
pnpm db:generate          # Regenerate Prisma
```

## Important Notes

- **Ask for clarification** if unsure about requirements
- **Prefer commands** for setup tasks instead of manual file creation
- **Plan medium to major tasks** and wait for user confirmation before coding
- **Be unbiased** - if you disagree with the user, communicate clearly
- **Suggest alternatives** when appropriate
- **Never lie** to the user
- **Never create markdown files** unless explicitly requested
- **Always provide brief, compact summaries** of changes made
