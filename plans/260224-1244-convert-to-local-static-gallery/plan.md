---
title: Convert to Local Static Gallery
status: pending
created: 2026-02-24
priority: high
---

# Convert to Local Static Gallery

## Overview

Remove submit functionality and convert app to read logos directly from `public/logos/` folder. Display each variant as separate card.

## Context

- **Brainstorm**: `../reports/brainstorm-260224-1244-convert-to-local-static-gallery.md`
- **Current**: SQLite DB with submit/approval workflow
- **Target**: Static file-based gallery, no DB dependency

## Key Data

- **Logos**: 1112 files in `public/logos/`
- **Naming**: `{pokedex-4-digit}-{variant?}-{seq}.png`
- **Names**: `lib/pokemon-names.json` (1-1025 mapping)

## Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|--------|
| 1 | Create manifest generator script | pending | 30min |
| 2 | Update gallery to use manifest | pending | 45min |
| 3 | Remove submit-related code | pending | 20min |
| 4 | Cleanup dependencies | pending | 15min |

## Phase Files

- [Phase 1: Create Manifest Generator](./phase-01-create-manifest-generator.md)
- [Phase 2: Update Gallery Components](./phase-02-update-gallery-components.md)
- [Phase 3: Remove Submit Code](./phase-03-remove-submit-code.md)
- [Phase 4: Cleanup Dependencies](./phase-04-cleanup-dependencies.md)

## Success Criteria

1. `npm run generate-manifest` creates valid manifest JSON
2. Gallery displays all 1112 logos from `public/logos/`
3. Each variant shown as separate card
4. No submit-related routes or components
5. `npm run dev` and `npm run build` succeed
6. No SQLite or unused dependencies

## Architecture

```
BUILD TIME:
scripts/generate-manifest.ts → lib/logos-manifest.json

RUNTIME:
app/gallery/page.tsx
  └─ imports lib/logos-manifest.json
  └─ renders LogoCard for each entry
  └─ images from /logos/{filename}
```
