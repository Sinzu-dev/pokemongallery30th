# Phase 4: Implement Save Button

## Overview
- **Priority:** High
- **Status:** Pending
- **Effort:** 15min

## Requirements

- Save button next to Pick button
- Only visible when picked.length > 0 AND mode is 6 or 9
- Export as PNG

## Related Files
- `app/random/page.tsx`

## Implementation Steps

1. Import html2canvas and useRef:

```typescript
import html2canvas from 'html2canvas';
import { useState, useCallback, useRef } from 'react';
```

2. Add ref for grid container:

```typescript
const gridRef = useRef<HTMLDivElement>(null);
```

3. Add save handler:

```typescript
const handleSave = useCallback(async () => {
  if (!gridRef.current) return;

  const canvas = await html2canvas(gridRef.current, {
    backgroundColor: '#ffffff',
    scale: 2, // Higher quality
  });

  const link = document.createElement('a');
  link.download = `pokemon-team-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}, []);
```

4. Wrap grid with ref:

```tsx
<div ref={gridRef} className={`grid gap-3 ${getGridCols()}`}>
  {/* ... cards */}
</div>
```

5. Add Save button next to Pick button:

```tsx
<div className="text-center mb-8 flex justify-center gap-4">
  <button onClick={handlePick} ...>
    {/* Pick button */}
  </button>

  {picked.length > 0 && (mode === 6 || mode === 9) && (
    <button
      onClick={handleSave}
      className="px-6 py-4 bg-[#4A90D9] text-white font-bold text-xl rounded-xl hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
    >
      Save Image
    </button>
  )}
</div>
```

## Success Criteria

- [ ] Save button appears after picking (modes 6, 9 only)
- [ ] Click downloads PNG file
- [ ] Image includes all cards with pink triangles
- [ ] Image quality is good (scale: 2)
