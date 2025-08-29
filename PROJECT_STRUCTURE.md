# Project Structure

## Current Structure

```
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication callback routes
│   ├── dashboard/      # Protected dashboard page
│   ├── signin/         # Sign in page
│   ├── signup/         # Sign up page
│   └── layout.tsx      # Root layout with providers
├── auth/               # Authentication logic
│   ├── AuthProvider.tsx
│   ├── authOperations.ts
│   └── useAuth.ts
├── components/         # Reusable React components
│   └── ThemeProvider.tsx
├── lib/                # Library configurations
│   └── supabase/       # Supabase client setup
├── services/           # Business logic layer
│   ├── itemService.ts
│   └── profileService.ts
├── types/              # TypeScript type definitions
│   ├── database.ts     # Generated database types
│   └── models.ts       # Application models
└── supabase/          # Supabase configuration
    └── migrations/     # Database migrations
```

## When Adding a New Domain

When implementing a new feature domain, create the following structure:

### Required Files and Directories

1. **Types** (`types/[domain].ts`)
   - Define TypeScript interfaces and types
   - Export model types matching database schema

2. **Service Layer** (`services/[domain]Service.ts`)
   - Business logic and database operations
   - Real-time subscription methods
   - Error handling

3. **API Routes** (`app/api/[domain]/route.ts`)
   - RESTful endpoints
   - Authentication checks
   - Request/response validation

4. **UI Components** (`app/[domain]/`)
   - Page components
   - Client-side forms
   - Data fetching hooks

5. **Database Migration** (`supabase/migrations/XXX_[domain].sql`)
   - Table creation
   - RLS policies
   - Indexes and triggers

6. **Integration Tests** (`tests/integration/[domain].test.ts`)
   - API endpoint tests
   - Service layer tests
   - Database operation tests

### Example for a "Projects" Domain

```
├── types/
│   └── projects.ts         # Project interfaces and types
├── services/
│   └── projectService.ts   # Project business logic
├── app/
│   ├── api/
│   │   └── projects/       # Project API routes
│   │       └── route.ts
│   └── projects/           # Project UI pages
│       ├── page.tsx
│       └── [id]/
│           └── page.tsx
├── supabase/
│   └── migrations/
│       └── 002_projects.sql
└── tests/
    └── integration/
        └── projects.test.ts
```