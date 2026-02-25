# Phase 2: Update Grid Layouts

## Overview
- **Priority:** High
- **Status:** Pending
- **Effort:** 10min

## Requirements

| Mode | Current Layout | New Layout |
|------|---------------|------------|
| 6 | 3 cols mobile, 6 cols desktop | 2 cols x 3 rows (fixed) |
| 9 | 3 cols (fixed) | 3 cols x 3 rows (fixed) |

## Related Files
- `app/random/page.tsx`

## Implementation Steps

1. Update `getGridCols()` function:

```typescript
const getGridCols = () => {
  if (mode === 1) return 'grid-cols-1 max-w-xs mx-auto';
  if (mode === 6) return 'grid-cols-2 max-w-md mx-auto'; // 2x3
  if (mode === 9) return 'grid-cols-3 max-w-xl mx-auto'; // 3x3
  return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-10 max-w-6xl mx-auto';
};
```

## Success Criteria

- [ ] Mode 6: displays 2 columns x 3 rows
- [ ] Mode 9: displays 3 columns x 3 rows
- [ ] Cards centered and not cropped
