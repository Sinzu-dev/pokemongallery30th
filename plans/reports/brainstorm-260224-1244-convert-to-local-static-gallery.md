# Brainstorm: Convert to Local Static Gallery

**Date:** 2026-02-24
**Status:** Agreed

---

## Problem Statement

Current app has submit functionality with SQLite database and admin approval workflow. User wants to:
- Remove submit functionality completely
- Convert to local view mode for testing
- Load logos from `public/logos/` folder directly
- Use existing `pokemon-names.json` for Pokemon names
- Display regional variants as separate cards

---

## Current Architecture

```
Submit Flow (TO DELETE):
/submit → submit-form.tsx → /api/logos POST → SQLite DB → Admin approval

Gallery Flow (TO MODIFY):
/gallery → lib/db.ts (SQLite) → pokemon-slot.tsx
```

**Submit-related files:**
- `app/submit/page.tsx`
- `components/submit-form.tsx`
- `app/api/logos/route.ts`
- `app/api/admin/route.ts`
- `app/admin/page.tsx`
- Header navigation link

**Data:**
- 1112 logo files in `public/logos/`
- Naming: `{pokedex-4-digit}-{variant?}-{sequence}.png`
- Examples: `0001-1.png`, `0019-alolan-1.png`

---

## Evaluated Approaches

### A. Static File System Scan (Build-time) ✅ CHOSEN
| Pros | Cons |
|------|------|
| Zero runtime DB dependency | Rebuild when adding logos |
| Fastest load time | Need build script |
| Works offline | |
| GitHub Pages compatible | |

### B. Runtime API Scan
| Pros | Cons |
|------|------|
| Auto-detect new logos | Requires Node.js server |
| No rebuild needed | Slower |

### C. Keep SQLite Read-only
| Pros | Cons |
|------|------|
| Minimal code changes | Still has DB dependency |
| | More complex setup |

---

## Final Solution: Hybrid Static

```
BUILD TIME:
1. Run scripts/generate-manifest.ts
2. Scan public/logos/*.png
3. Parse filename → {pokedex, variant, seq}
4. Match with pokemon-names.json
5. Generate lib/logos-manifest.json

RUNTIME:
1. Gallery imports logos-manifest.json
2. Render separate cards per variant
3. Images served from /logos/{filename}
```

---

## Implementation Plan

### Phase 1: Create Build Script
- [ ] Create `scripts/generate-manifest.ts`
- [ ] Parse filename pattern: `{pokedex}-{variant?}-{seq}.png`
- [ ] Output `lib/logos-manifest.json`
- [ ] Add npm script: `npm run generate-manifest`

### Phase 2: Update Gallery
- [ ] Create `lib/logos-data.ts` (read manifest)
- [ ] Update `app/gallery/page.tsx` to use manifest
- [ ] Modify `components/pokemon-slot.tsx` for variants as separate cards

### Phase 3: Remove Submit
- [ ] Delete `app/submit/page.tsx`
- [ ] Delete `components/submit-form.tsx`
- [ ] Delete `app/api/logos/route.ts`
- [ ] Delete `app/api/admin/route.ts`
- [ ] Delete `app/admin/page.tsx`
- [ ] Update `components/header.tsx` - remove submit link
- [ ] Remove `lib/db.ts` (or keep if needed elsewhere)

### Phase 4: Cleanup
- [ ] Remove `better-sqlite3` from dependencies
- [ ] Remove unused DB-related types
- [ ] Update `package.json` scripts
- [ ] Test build and local dev

---

## Manifest Structure

```json
{
  "generatedAt": "2026-02-24T12:44:00Z",
  "totalLogos": 1112,
  "logos": [
    {
      "pokedex": 1,
      "name": "Bulbasaur",
      "variant": "base",
      "filename": "0001-1.png",
      "path": "/logos/0001-1.png"
    },
    {
      "pokedex": 19,
      "name": "Rattata",
      "variant": "alolan",
      "filename": "0019-alolan-1.png",
      "path": "/logos/0019-alolan-1.png"
    }
  ]
}
```

---

## Success Criteria

1. Gallery loads logos from `public/logos/` without DB
2. Each variant shows as separate card
3. Pokemon names display correctly
4. No submit-related code remains
5. `npm run dev` works locally
6. Build succeeds for static deployment

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Filename parsing errors | Strict regex + validation |
| Missing names in JSON | Fallback to "Pokemon #{num}" |
| Large manifest file | JSON is small, ~50KB for 1112 items |

---

## Next Steps

1. Create implementation plan with detailed phases
2. Execute Phase 1 first (build script)
3. Test manifest generation
4. Proceed with gallery update
