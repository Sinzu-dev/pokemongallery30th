# Phase 3: Remove Submit Code

## Overview

- **Priority**: Medium
- **Status**: Pending
- **Effort**: 20 minutes
- **Blocked by**: Phase 2

Delete all submit-related files and update navigation.

## Files to Delete

```
app/submit/page.tsx
app/admin/page.tsx
app/api/logos/route.ts
app/api/admin/route.ts
app/api/init/route.ts
components/submit-form.tsx
lib/db.ts
lib/db-turso.ts
lib/blob-storage.ts
lib/image-downloader.ts
```

## Files to Modify

### components/header.tsx

Remove submit link from navigation:

```tsx
// BEFORE
const navLinks = [
  { href: '/submit', label: 'Submit' },
  { href: '/gallery', label: 'Gallery' },
];

// AFTER
const navLinks = [
  { href: '/gallery', label: 'Gallery' },
];
```

### lib/types.ts

Remove unused types:

```typescript
// DELETE these:
export interface Logo { ... }
export interface LogoInput { ... }

// KEEP these:
export interface LogoEntry { ... }
export const FORM_VARIANTS = [ ... ]
```

## Implementation Steps

1. Delete submit page: `rm app/submit/page.tsx`
2. Delete admin page: `rm app/admin/page.tsx`
3. Delete API routes: `rm -rf app/api/`
4. Delete submit form: `rm components/submit-form.tsx`
5. Delete DB modules: `rm lib/db.ts lib/db-turso.ts lib/blob-storage.ts lib/image-downloader.ts`
6. Update header.tsx - remove submit link
7. Update types.ts - remove Logo, LogoInput interfaces
8. Run `npm run dev` to verify no import errors

## Todo

- [ ] Delete app/submit/page.tsx
- [ ] Delete app/admin/page.tsx
- [ ] Delete app/api/ directory
- [ ] Delete components/submit-form.tsx
- [ ] Delete lib/db.ts
- [ ] Delete lib/db-turso.ts
- [ ] Delete lib/blob-storage.ts
- [ ] Delete lib/image-downloader.ts
- [ ] Update components/header.tsx
- [ ] Clean lib/types.ts
- [ ] Verify npm run dev works

## Success Criteria

- No submit-related files remain
- Header shows only Gallery link
- No import errors
- App builds successfully

## Risks

| Risk | Mitigation |
|------|------------|
| Missed file reference | Run build to catch errors |
| Breaking homepage | Check app/page.tsx for submit links |
