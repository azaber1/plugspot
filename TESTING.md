# Testing Guide for Wattspot

## Test Suite Overview

Wattspot includes a comprehensive test suite using Vitest and React Testing Library.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Unit Tests
- **Components**: `src/components/__tests__/`
  - `Navbar.test.tsx` - Navigation component tests
  - `ToastContext.test.tsx` - Toast notification system tests

- **Hooks**: `src/hooks/__tests__/`
  - `useFavorites.test.ts` - Favorites functionality with localStorage

- **Utils**: `src/utils/__tests__/`
  - `calculations.test.ts` - Booking cost calculation logic

### Integration Tests
- **Pages**: `src/pages/__tests__/`
  - `BrowsePage.test.tsx` - Search, filtering, and charger listing
  - `ChargerDetailPage.test.tsx` - Booking flow and cost calculations

## Test Coverage

The test suite covers:
- ✅ Component rendering
- ✅ User interactions (clicks, form inputs)
- ✅ State management (favorites, filters)
- ✅ Routing and navigation
- ✅ Cost calculations
- ✅ Toast notifications
- ✅ Error handling
- ✅ localStorage persistence

## Writing New Tests

When adding new features, follow these patterns:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Mocking

- Use `vi.mock()` for external dependencies
- Mock hooks when testing components that depend on them
- Use `localStorageMock` for localStorage-dependent tests
