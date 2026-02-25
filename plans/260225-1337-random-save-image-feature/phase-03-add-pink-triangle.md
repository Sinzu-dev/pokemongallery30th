# Phase 3: Add Pink Triangle to Cards

## Overview
- **Priority:** Medium
- **Status:** Pending
- **Effort:** 10min

## Requirements

Add decorative pink triangle to bottom-left corner of each logo card (only for modes 6 and 9).

## Related Files
- `components/logo-card.tsx`
- `app/globals.css` (optional)

## Implementation Steps

### Option A: Prop-based (Recommended)

1. Add `showTriangle` prop to LogoCard:

```typescript
interface LogoCardProps {
  logo: LogoEntry;
  showTriangle?: boolean;
}
```

2. Add triangle element inside card:

```tsx
{showTriangle && (
  <div
    className="absolute bottom-0 left-0 w-0 h-0"
    style={{
      borderStyle: 'solid',
      borderWidth: '0 0 20px 20px',
      borderColor: 'transparent transparent #FF69B4 transparent',
    }}
  />
)}
```

3. Update container to `relative`:

```tsx
<a className="block relative bg-white rounded-xl...">
```

4. In `random/page.tsx`, pass prop for modes 6 and 9:

```tsx
<LogoCard logo={logo} showTriangle={mode === 6 || mode === 9} />
```

## Success Criteria

- [ ] Pink triangle visible on bottom-left of each card
- [ ] Only shows for modes 6 and 9
- [ ] Does not affect other pages using LogoCard
