# Axii Stack

A Next.js starter template built with modern tools, configured for type-safety, and designed to deploy immediately.

## Tech Stack

### Core Framework

- **Next.js 15** - React 19 with Turbopack for blazing-fast development
- **TypeScript** - Type-safe development with full IDE support

### Backend & Database

- **Hono** - Lightweight, ultra-fast type-safe API framework
- **Prisma** - Type-safe PostgreSQL ORM with auto-generated types
- **Better Auth** - Full-featured authentication with email/password + Google OAuth
- **Resend** - Transactional email service for verification and password resets
- **PostgreSQL** - Robust relational database (via Docker)

### Frontend & Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library built on Radix UI
- **next-themes** - Seamless dark mode support
- **Lucide React** - Clean, customizable icon library

### Data Management

- **TanStack Query** - Powerful async state management and data fetching
- **Zod** - Runtime type validation and schema validation

### Developer Experience

- **T3 Env** - Type-safe environment variables with runtime validation
- **Pino** - High-performance structured logging system
- **ESLint + Prettier** - Code linting and automatic formatting
- **Husky + lint-staged** - Git hooks for pre-commit quality checks

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Docker & Docker Compose (for PostgreSQL)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables:

**Server Variables:**

- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for authentication (generate a secure random string)
- `RESEND_API_KEY` - Resend API key for sending emails
- `EMAIL_FROM` - Sender email address (e.g., noreply@yourdomain.com)
- `EMAIL_FROM_NAME` - Display name for sender (e.g., "Your App Name")
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret

**Client Variables:**

- `NEXT_PUBLIC_APP_URL` - Your application URL (default: http://localhost:3000)
- `NEXT_PUBLIC_API_URL` - Your API URL (default: http://localhost:3000)

3. Setup database:

```bash
pnpm db:start && pnpm db:migrate
```

4. Start the development server:

```bash
pnpm dev
```

## Available Scripts

### Development

- `pnpm dev` - Start Next.js development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check code quality

### Database Management

- `pnpm db:start` - Start PostgreSQL container
- `pnpm db:stop` - Stop PostgreSQL container
- `pnpm db:restart` - Restart PostgreSQL container
- `pnpm db:logs` - View PostgreSQL logs
- `pnpm db:clean` - Remove PostgreSQL container and volumes
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:migrate:deploy` - Deploy migrations (production)
- `pnpm db:push` - Push schema changes without migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database
- `pnpm db:reset` - Reset database and run migrations
- `pnpm db:format` - Format Prisma schema

### Utilities

- `pnpm shadcn` - Add shadcn/ui components
  - e.g. `pnpm shadcn add button`

## Project Structure

```
axii-stack/
├── src/
│   ├── app/              # Next.js app directory (pages & routes)
│   │   ├── (auth)/       # Authentication routes
│   │   ├── api/          # API routes (Hono integration)
│   │   └── ...
│   ├── backend/          # Backend logic
│   │   ├── db/           # Prisma schema and database utilities
│   │   ├── routers/      # API route handlers
│   │   └── services/     # Backend services (email, etc.)
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   │    └── config/      # Configuration files
│   │        └── env/     # Environment variable schemas
│   └── styles/           # Global styles
├── .env.example          # Example environment variables
├── docker-compose.yml    # PostgreSQL container configuration
└── package.json          # Project dependencies and scripts
```

## Features

- **Full Authentication** - Email/password with verification + Google OAuth via Better Auth
- **Email Service** - Transactional emails with Resend for verification and password resets
- **Type-Safe API** - End-to-end type safety from database to frontend
- **Database Migrations** - Version-controlled schema changes with Prisma
- **Dark Mode** - Built-in theme switching with persistent preferences
- **Code Quality** - Automated linting, formatting, and pre-commit hooks
- **Docker Support** - Containerized PostgreSQL for consistent development
- **Structured Logging** - Logging with Pino
- **Environment Validation** - Runtime validation of environment variables

## License

This project is open source and available under the MIT License.
