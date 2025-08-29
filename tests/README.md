# Testing Guide

## Environment Setup

### Required Environment Variables

For running tests, you need the following environment variables:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for server-side tests)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Local Supabase Setup

For local testing, you can use Supabase CLI:

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Start local Supabase
supabase start

# Get local credentials
supabase status
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests only
npm run test:integration
```

## Test Policy

### Integration Tests
- **Must hit real database** (local Supabase or test project)
- No mocking unless explicitly documented with justification
- Test both success and error paths
- Include authentication state validation

### Test Structure
```
tests/
├── integration/    # Integration tests hitting real database
├── unit/          # Unit tests (if needed)
└── fixtures/      # Test data and utilities
```

## Writing Tests

### Example Integration Test

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@/lib/supabase/client'

describe('Items API', () => {
  let supabase

  beforeAll(() => {
    supabase = createClient()
  })

  it('should create an item', async () => {
    // Test implementation
  })
})
```

## Test Database

Use a separate Supabase project for testing or local Supabase instance. Never run tests against production database.