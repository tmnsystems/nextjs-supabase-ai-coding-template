# Development Workflow

## Order of Operations

When implementing any feature, follow this strict sequence:

1. **TYPES** → Define TypeScript interfaces and database types
2. **INTEGRATION TESTS** → Write tests that specify expected behavior
3. **IMPLEMENTATION** → Implement the actual feature code
4. **RUN TESTS** → Verify all tests pass
5. **ADR UPDATE** → Document architectural decisions made

## Command Verbs

Use information-dense, specific verbs when describing actions:

- **create** - Generate new files or entities
- **update** - Modify existing code or data
- **delete** - Remove files, code, or data
- **implement** - Build complete feature functionality
- **validate** - Check correctness and completeness
- **integrate** - Connect components or services
- **migrate** - Update database schema
- **refactor** - Restructure code without changing behavior

## No Broken Windows Policy

- No TODOs left in committed code
- No mock-only tests without real implementations
- No commented-out code blocks
- No console.logs in production code
- All tests must pass before commit
- Type errors must be resolved

## Feature Implementation Checklist

Before starting any feature:
- [ ] Types defined in `/types`
- [ ] Integration tests written in `/tests/integration`
- [ ] Database migration created if needed
- [ ] Service layer planned

After implementation:
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] ADR entry added for significant decisions
- [ ] Code reviewed for broken windows

## Test Requirements

- Integration tests must hit real database (local Supabase or test project)
- No mocking unless explicitly documented and justified
- Test both success and error paths
- Include authentication state tests