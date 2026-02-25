# Phase 2: Update Gallery Components

## Overview

- **Priority**: High
- **Status**: Pending
- **Effort**: 45 minutes
- **Blocked by**: Phase 1

Update gallery to use manifest JSON and display each variant as separate card.

## Requirements

**Functional:**
- Import logos from `lib/logos-manifest.json`
- Display each logo entry as separate card (not grouped)
- Search/filter by Pokemon name or number
- Show variant badge on each card

**Non-functional:**
- No database dependency
- Fast page load (static import)
- Maintain existing visual style

## Architecture Change

```
BEFORE:
gallery/page.tsx → lib/db.ts (SQLite) → Logo[] grouped by pokedex

AFTER:
gallery/page.tsx → lib/logos-manifest.json → LogoEntry[] flat list
```

## Related Files

**Modify:**
- `app/gallery/page.tsx` - Use manifest instead of DB
- `components/pokemon-slot.tsx` → Rename to `components/logo-card.tsx`
- `lib/types.ts` - Add LogoEntry interface

**Keep:**
- `lib/pokemon-names.json`
- `components/gallery-filter.tsx`

## Implementation Steps

### 1. Update types.ts

```typescript
// Add new interface
export interface LogoEntry {
  pokedex: number;
  name: string;
  variant: string;
  filename: string;
  path: string;
}

// Keep FORM_VARIANTS for badge colors
```

### 2. Create logo-card.tsx

Replace pokemon-slot.tsx with simpler card component:

```tsx
interface LogoCardProps {
  logo: LogoEntry;
}

export default function LogoCard({ logo }: LogoCardProps) {
  return (
    <a href={logo.path} target="_blank" className="...">
      <img src={logo.path} alt={logo.name} />
      <div>
        <span>#{logo.pokedex.toString().padStart(4, '0')}</span>
        <span className={badgeColor}>{logo.variant}</span>
        <p>{logo.name}</p>
      </div>
    </a>
  );
}
```

### 3. Update gallery/page.tsx

```tsx
import manifest from '@/lib/logos-manifest.json';
import LogoCard from '@/components/logo-card';

export default function GalleryPage({ searchParams }) {
  const search = searchParams.search?.toLowerCase() || '';

  let logos = manifest.logos;
  if (search) {
    logos = logos.filter(l =>
      l.name.toLowerCase().includes(search) ||
      l.pokedex.toString().includes(search)
    );
  }

  return (
    <div className="grid ...">
      {logos.map((logo, i) => (
        <LogoCard key={`${logo.pokedex}-${logo.variant}-${i}`} logo={logo} />
      ))}
    </div>
  );
}
```

### 4. Update gallery-filter.tsx

Keep as-is (already just search input).

## Todo

- [ ] Add LogoEntry interface to types.ts
- [ ] Create components/logo-card.tsx
- [ ] Update app/gallery/page.tsx to use manifest
- [ ] Remove old pokemon-slot.tsx
- [ ] Test search functionality
- [ ] Verify all 1112 logos display

## Success Criteria

- Gallery shows 1112 separate cards
- Each card displays logo image, number, name, variant badge
- Search filters by name and number
- No DB import errors
- Page loads fast

## Visual Reference

```
┌─────────────────┐
│    [IMAGE]      │
├─────────────────┤
│ #0019  [alolan] │
│ Rattata         │
└─────────────────┘
```
