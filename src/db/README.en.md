# Database Module

This module encapsulates all database operations based on Dexie (IndexedDB).

## Architecture

```
src/db/
├── database.ts     # Database instance definition (private, internal use only)
├── operations.ts   # Database operation functions
├── index.ts        # Public API entry point (re-exports all operations)
├── README.md       # Documentation (Chinese)
└── README.en.md    # Documentation (English)
```

### File Responsibilities

- **database.ts**: Defines Dexie database instance and table schemas, **external import prohibited**
- **operations.ts**: Implements all CRUD operation functions
- **index.ts**: Serves as the module's public entry point, re-exports all functions from operations

## Usage Guidelines

### ✅ Correct Usage

```typescript
// Import functions from @/db
import { createSoup, getSoupById, updateSoup } from "@/db";

// Use functions to operate on the database
const soup = await getSoupById("123");
await updateSoup("123", { title: "New Title" });
```

### ❌ Incorrect Usage

```typescript
// ❌ DO NOT directly import database.ts
import db from "@/db/database";

// ❌ DO NOT directly operate on database tables
await db.soups.add({ ... });
```

> **Note**: ESLint is configured to throw errors when directly importing `@/db/database`.

## Design Principles

1. **Encapsulation**: The `db` instance is only used within `operations.ts`, inaccessible to external modules
2. **Single Entry Point**: All database operations go through functions exposed in `operations.ts`
3. **Type Safety**: All functions have complete TypeScript type definitions
4. **Runtime Validation**: All create and update operations use Zod runtime validation to prevent invalid data
5. **Maintainability**: Database logic is centrally managed, easy to modify and test

## Available Operations

### Soup Operations
- `createSoup(soup)` - Create a soup puzzle
- `createSoups(soups)` - Bulk create
- `getSoupById(id)` - Query single soup
- `getAllSoups()` - Query all soups
- `updateSoup(id, changes)` - Update soup
- `deleteSoup(id)` - Delete soup
- `deleteAllSoups()` - Clear all soups

### Try Operations
- `createTry(tryRecord)` - Create a try record
- `createTries(tries)` - Bulk create
- `getTryById(id)` - Query single try
- `getAllTries()` - Query all tries
- `getTriesByDateRange(start, end)` - Query by date range
- `updateTry(id, changes)` - Update try
- `deleteTry(id)` - Delete try
- `deleteTries(ids)` - Bulk delete
- `deleteAllTries()` - Clear all tries

### Relational Operations
- `getSoupWithTries(soupId)` - Get soup with all its tries
- `addTryToSoup(soupId, tryRecord)` - Add a try to soup
- `removeTryFromSoup(soupId, tryId)` - Remove a try from soup

## Extension Guide

When adding new database operations:

1. Add new function in `operations.ts`
2. Add complete JSDoc comments
3. Ensure function has proper type definitions
4. Export function for external use

```typescript
/**
 * Search soups by title
 */
export async function searchSoupsByTitle(keyword: string): Promise<DbSoup[]> {
	return await db.soups
		.filter((soup) => soup.title.includes(keyword))
		.toArray();
}
```

## Runtime Validation

All create and update operations include Zod runtime validation:

```typescript
// Creating a soup - automatically validated
await createSoup({
	id: "123",
	title: "Test Soup",
	surface: "A man dies",
	truth: "He was murdered",
	tryIds: []
});
// ✅ If data is invalid, throws ZodError with detailed error message

// Updating a soup - automatically validated (partial)
await updateSoup("123", {
	title: "Updated Title"
});
// ✅ Only validates the provided fields
```

**Benefits:**
- Prevents invalid data from entering the database
- Catches type errors at runtime that TypeScript might miss (e.g., from external APIs)
- Provides detailed error messages for debugging
- Works even when TypeScript type checking is bypassed (e.g., using `any` or `@ts-ignore`)
