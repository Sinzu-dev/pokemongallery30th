# Brainstorm: Random Tab Save Image Feature

**Date:** 2026-02-25
**Status:** Agreed

## Requirements

| Feature | Detail |
|---------|--------|
| Tab 6 layout | 2 cols x 3 rows |
| Tab 9 layout | 3 cols x 3 rows |
| Pink triangle | Bottom-left corner of each logo card |
| Save button | Next to Pick button |
| Export format | PNG |
| Export size | Fixed (TBD) |

## Technical Solution

### 1. Image Capture
- Library: `html2canvas`
- Wrap grid in ref, capture on Save click

### 2. Pink Triangle (CSS)
```css
.logo-card::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  border-style: solid;
  border-width: 0 0 20px 20px;
  border-color: transparent transparent pink transparent;
}
```

### 3. Grid Layout Updates
- Mode 6: `grid-cols-2` (2x3)
- Mode 9: `grid-cols-3` (3x3)

## Files to Modify
- `app/random/page.tsx` - grid layout, save button
- `components/logo-card.tsx` - add pink triangle
- `package.json` - add html2canvas

## Next Steps
- Create detailed implementation plan
