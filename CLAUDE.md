# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Next.js 14 application with Supabase integration, featuring complete authentication, real-time database operations, and Material-UI components. It's designed as a template for building modern web applications with AI-first development workflows.

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## High-Level Architecture

### Authentication Flow
- **AuthProvider** (`/auth/AuthProvider.tsx`): Wraps the app with authentication context, manages user state
- **authOperations** (`/auth/authOperations.ts`): Core auth functions (signIn, signUp, OAuth, password reset)
- **Middleware** (`/middleware.ts`): Handles session refresh and protected route enforcement
- **Supabase Auth**: Supports email/password, Google OAuth, anonymous auth

### Data Layer Architecture
- **Supabase Clients**: Three different clients for different contexts:
  - `lib/supabase/client.ts`: Browser client for client-side operations
  - `lib/supabase/server.ts`: Server client for API routes and server components
  - `lib/supabase/middleware.ts`: Middleware client for session management
- **Services** (`/services`): Business logic layer abstracting database operations
- **Types** (`/types`): Generated database types and application models
- **Row Level Security**: All database tables have RLS policies ensuring data isolation

### API Design Pattern
- RESTful endpoints in `/app/api`
- Server-side authentication check using `supabase.auth.getUser()`
- Consistent error handling and response format
- TypeScript interfaces for request/response

### Real-time Subscriptions
Services include subscription methods for real-time updates:
```typescript
subscribeToChanges(userId: string, callback: (payload: any) => void)
```

## Database Schema

### Key Tables
- **profiles**: User profiles linked to auth.users
  - Includes subscription status, display name, metadata
  - Automatically created on user signup via trigger
- **items**: Generic items table for application data
  - Supports CRUD operations with status tracking
  - Linked to user via foreign key

### Important Patterns
- Use UUID for all IDs
- Always include `created_at` and `updated_at` timestamps
- Implement RLS policies for all tables
- Use database triggers for automatic profile creation

## Testing Approach

When adding new features:
1. Test authentication flows manually (signup, signin, OAuth)
2. Verify RLS policies work correctly (users can only see their own data)
3. Check real-time subscriptions if implemented
4. Test API endpoints with different auth states
5. Ensure TypeScript types are correct

## Security Considerations

- Never expose service role key to client
- Always validate user permissions in API routes
- Use RLS policies as primary security layer
- Sanitize user inputs before database operations
- Check user authentication state before sensitive operations

## Common Development Tasks

### Adding a New Database Table
1. Create migration in `supabase/migrations/`
2. Update types in `types/database.ts`
3. Create service in `services/`
4. Add RLS policies in migration
5. Create API routes if needed

### Adding New Authentication Provider
1. Enable provider in Supabase dashboard
2. Add sign-in method to `authOperations.ts`
3. Update UI components to show new provider
4. Handle callback URL properly

### Implementing Real-time Features
1. Use service subscription methods
2. Clean up subscriptions on component unmount
3. Handle connection state changes
4. Implement optimistic updates for better UX