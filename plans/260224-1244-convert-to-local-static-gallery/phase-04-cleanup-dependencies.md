# Phase 4: Cleanup Dependencies

## Overview

- **Priority**: Low
- **Status**: Pending
- **Effort**: 15 minutes
- **Blocked by**: Phase 3

Remove unused packages and update scripts.

## Dependencies to Remove

```json
// From dependencies:
"@libsql/client": "^0.17.0",      // Turso DB client
"@vercel/blob": "^2.3.0",         // Vercel blob storage
"better-sqlite3": "^12.6.2",      // SQLite

// From devDependencies:
"@types/better-sqlite3": "^7.6.13"
```

## Dependencies to Add

```json
// devDependencies:
"tsx": "^4.x"  // For running TS scripts
```

## Scripts to Update

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run generate-manifest && next build",
    "start": "next start",
    "lint": "eslint",
    "generate-manifest": "npx tsx scripts/generate-logos-manifest.ts"
  }
}
```

## Files to Delete

```
data/pokemon.db        // SQLite database file
local.db               // Local DB copy
```

## Implementation Steps

1. Remove packages:
   ```bash
   npm uninstall @libsql/client @vercel/blob better-sqlite3
   npm uninstall -D @types/better-sqlite3
   ```

2. Add tsx:
   ```bash
   npm install -D tsx
   ```

3. Update package.json scripts (add generate-manifest, update build)

4. Delete database files:
   ```bash
   rm -rf data/
   rm local.db
   ```

5. Run `npm install` to update lock file

6. Verify build:
   ```bash
   npm run build
   ```

## Todo

- [ ] npm uninstall @libsql/client @vercel/blob better-sqlite3
- [ ] npm uninstall -D @types/better-sqlite3
- [ ] npm install -D tsx
- [ ] Update package.json scripts
- [ ] Delete data/ directory
- [ ] Delete local.db
- [ ] npm install
- [ ] npm run build
- [ ] Verify successful build

## Success Criteria

- No unused dependencies in package.json
- `npm run build` succeeds
- Build output is smaller (no SQLite native bindings)
- `npm run generate-manifest` works

## Final package.json

```json
{
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "gh-pages": "^6.3.0",
    "tailwindcss": "^4",
    "tsx": "^4",
    "typescript": "^5"
  }
}
```
