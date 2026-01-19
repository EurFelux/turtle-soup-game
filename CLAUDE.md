# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based "Turtle Soup" puzzle game with AI-powered gameplay assistance. The application uses Dexie (IndexedDB) for local data persistence and supports multiple AI providers (Anthropic, OpenAI, Gemini) for interactive gameplay.

## Development Commands

### Build & Development
```bash
pnpm dev              # Start development server with Vite HMR
pnpm build            # TypeScript compilation + production build
pnpm preview          # Preview production build locally
```

### Code Quality
```bash
pnpm lint             # Run both Biome and ESLint
pnpm lint:fix         # Auto-fix linting issues
pnpm format           # Format code with Biome (tab indents, double quotes)
```

### Internationalization
```bash
pnpm i18n:extract     # Extract translation keys from source
pnpm i18n:status      # Check translation coverage status
```

### Type Checking
```bash
npx tsc --noEmit      # Run TypeScript type checking without emitting files
```

## Architecture

### Database Module (`src/db/`)

**Critical**: The database layer is strictly encapsulated to prevent direct access to the Dexie instance.

- **`database.ts`**: Private Dexie instance definition - **DO NOT import directly**
- **`operations.ts`**: All CRUD operations with Zod runtime validation
- **`index.ts`**: Public API entry point

**Usage Pattern:**
```typescript
// ✅ Correct
import { createSoup, getSoupById } from "@/db";

// ❌ Wrong - will trigger ESLint error
import db from "@/db/database";
```

**Key Features:**
- All create/update operations include automatic Zod validation at runtime
- ESLint rule enforces the encapsulation pattern
- See `src/db/README.en.md` for complete API documentation

**Database Schema:**
- `soups`: Soup puzzle entries (DbSoup type)
- `tries`: User attempt records (Try type - discriminated union with "valid"/"invalid" status)

### Type System (`src/types/`)

All types are defined using Zod schemas with TypeScript type inference:

- **`game.ts`**: Core game entities (DbSoup, Try with discriminated union)
- **`ai.ts`**: AI provider settings and UI message types
- **`theme.ts`**: Theme system types
- **`locale.ts`**: Internationalization types
- **`index.ts`**: Central export point for all types

Import pattern: `import { DbSoup, Try } from "@/types"`

### State Management

- **Theme**: Context-based (`ThemeProvider` + `ThemeProviderContext`)
- **Locale**: Context-based (`LocaleProvider` + `LocaleProviderContext`)
- **AI Settings**: Local state with localStorage persistence
- **Settings Persistence**: Centralized keys in `src/config/storage.ts`

All settings use Zod validation for runtime type safety when loading from localStorage.

### Internationalization (i18n)

- Framework: `react-i18next` + `i18next`
- Translation files: `src/assets/locales/{locale}/translation.json`
- Supported locales: `en-US`, `zh-CN`
- Initialized in `App.tsx` before component mount

### UI Components

- Base components: Radix UI primitives (`@radix-ui/*`)
- Styling: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Component variants: `class-variance-authority`
- Utility: `tailwind-merge` for className merging
- Structure: `src/components/ui/` (base components), `src/components/` (composed components)

## Code Style & Conventions

### Formatting (enforced by Biome)
- Indentation: Tabs
- Quotes: Double quotes
- Tailwind classes: Auto-sorted via `useSortedClasses` rule

### Linting
- Dual linters: Biome (formatter + basic linting) and ESLint (React-specific rules)
- ESLint config: Flat config format (`eslint.config.js`)
- Key rules:
  - `unused-imports/no-unused-imports`: Error on unused imports
  - `no-restricted-imports`: Prevents direct database instance imports

### Import Aliases
- `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.json`)

## Special Considerations

### Vite Configuration
- Using `rolldown-vite@7.2.5` as Vite replacement (pnpm override)
- React plugin: `@vitejs/plugin-react-swc` (SWC for fast refresh)
- Note: React Compiler is not compatible with SWC

### Runtime Validation Strategy
All data entering the database or loading from localStorage must pass through Zod schema validation. This prevents type errors that TypeScript cannot catch at runtime (e.g., data from external APIs, localStorage corruption, or type casting bypasses).

### Provider Context Pattern
When creating new providers:
1. Define context in `src/context/`
2. Create provider component in `src/components/provider/`
3. Use localStorage for persistence with keys from `src/config/storage.ts`
4. Apply Zod validation when reading from storage
