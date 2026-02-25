# Phase 1: Create Manifest Generator

## Overview

- **Priority**: High
- **Status**: Pending
- **Effort**: 30 minutes

Create build script to scan `public/logos/` and generate JSON manifest.

## Requirements

**Functional:**
- Scan all `.png` files in `public/logos/`
- Parse filename pattern: `{pokedex}-{variant?}-{seq}.png`
- Match pokedex number with `pokemon-names.json`
- Output `lib/logos-manifest.json`

**Non-functional:**
- Script runs via npm script
- TypeScript with ts-node or tsx
- Idempotent (safe to run multiple times)

## Filename Patterns

```
Base:     0001-1.png           → pokedex=1, variant=base
Regional: 0019-alolan-1.png    → pokedex=19, variant=alolan
Multiple: 0001-2.png           → pokedex=1, variant=base (2nd image)
```

**Regex**: `/^(\d{4})-(?:([a-z]+)-)?(\d+)\.png$/`

## Output Structure

```typescript
interface LogoEntry {
  pokedex: number;
  name: string;           // from pokemon-names.json
  variant: string;        // base, alolan, galarian, etc.
  filename: string;       // 0001-1.png
  path: string;           // /logos/0001-1.png
}

interface LogosManifest {
  generatedAt: string;
  totalLogos: number;
  logos: LogoEntry[];
}
```

## Related Files

**Create:**
- `scripts/generate-logos-manifest.ts`
- `lib/logos-manifest.json` (generated)

**Read:**
- `lib/pokemon-names.json`
- `public/logos/*.png`

## Implementation Steps

1. Create `scripts/` directory if not exists
2. Create `scripts/generate-logos-manifest.ts`:
   - Import `fs` and `path`
   - Read `pokemon-names.json`
   - Scan `public/logos/` for `.png` files
   - Parse each filename with regex
   - Build manifest array sorted by pokedex, then variant
   - Write to `lib/logos-manifest.json`
3. Add npm script to `package.json`:
   ```json
   "generate-manifest": "npx tsx scripts/generate-logos-manifest.ts"
   ```
4. Add `tsx` to devDependencies
5. Run and verify output

## Code Snippet

```typescript
// scripts/generate-logos-manifest.ts
import fs from 'fs';
import path from 'path';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');
const NAMES_FILE = path.join(process.cwd(), 'lib', 'pokemon-names.json');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'logos-manifest.json');

const FILENAME_REGEX = /^(\d{4})-(?:([a-z]+)-)?(\d+)\.png$/;

// ... implementation
```

## Todo

- [ ] Create scripts directory
- [ ] Write generate-logos-manifest.ts
- [ ] Add tsx to devDependencies
- [ ] Add npm script
- [ ] Run and verify 1112 entries generated
- [ ] Commit manifest to repo

## Success Criteria

- `npm run generate-manifest` exits without error
- `lib/logos-manifest.json` contains 1112 entries
- All entries have valid pokedex, name, variant, path
- Sorted by pokedex number

## Risks

| Risk | Mitigation |
|------|------------|
| Unexpected filename format | Log warnings, skip invalid files |
| Missing pokemon name | Fallback to "Pokemon #{num}" |
