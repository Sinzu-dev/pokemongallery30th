/**
 * Generate logos manifest from public/logos/ directory
 * Scans PNG files and creates a JSON manifest with Pokemon data
 *
 * Usage: npx tsx scripts/generate-logos-manifest.ts
 */

import fs from 'fs';
import path from 'path';

// Paths
const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');
const NAMES_FILE = path.join(process.cwd(), 'lib', 'pokemon-names.json');
const OUTPUT_FILE = path.join(process.cwd(), 'lib', 'logos-manifest.json');

interface LogoEntry {
  pokedex: number;
  name: string;
  variant: string;
  filename: string;
  path: string;
}

interface LogosManifest {
  generatedAt: string;
  totalLogos: number;
  logos: LogoEntry[];
}

/**
 * Parse filename to extract pokedex, variant, and sequence
 * Patterns:
 * - 0001-1.png → pokedex=1, variant=base
 * - 0019-alolan-1.png → pokedex=19, variant=alolan
 * - 0892-rapid-strike-1.png → pokedex=892, variant=rapid-strike
 */
function parseFilename(filename: string): { pokedex: number; variant: string } | null {
  if (!filename.endsWith('.png')) return null;

  const basename = filename.slice(0, -4); // Remove .png
  const parts = basename.split('-');

  if (parts.length < 2) return null;

  // First part must be 4-digit pokedex
  const pokedexStr = parts[0];
  if (!/^\d{4}$/.test(pokedexStr)) return null;
  const pokedex = parseInt(pokedexStr, 10);

  // Last part must be sequence number
  const lastPart = parts[parts.length - 1];
  if (!/^\d+$/.test(lastPart)) return null;

  // If only 2 parts: {pokedex}-{seq} → base form
  if (parts.length === 2) {
    return { pokedex, variant: 'base' };
  }

  // If 3+ parts: {pokedex}-{variant...}-{seq}
  const variantParts = parts.slice(1, -1);
  const variant = variantParts.join('-');

  return { pokedex, variant };
}

function main() {
  console.log('Generating logos manifest...');

  // Read Pokemon names
  const namesJson = fs.readFileSync(NAMES_FILE, 'utf-8');
  const pokemonNames: Record<string, string> = JSON.parse(namesJson);

  // Scan logos directory
  const files = fs.readdirSync(LOGOS_DIR).filter((f) => f.endsWith('.png'));
  console.log(`Found ${files.length} PNG files`);

  const logos: LogoEntry[] = [];
  let skipped = 0;

  for (const filename of files) {
    const parsed = parseFilename(filename);

    if (!parsed) {
      console.warn(`Skipping invalid filename: ${filename}`);
      skipped++;
      continue;
    }

    const { pokedex, variant } = parsed;
    const name = pokemonNames[pokedex.toString()] || `Pokemon #${pokedex}`;

    logos.push({
      pokedex,
      name,
      variant,
      filename,
      path: `/logos/${filename}`,
    });
  }

  // Sort by pokedex number, then variant priority
  const variantOrder = ['base', 'male', 'female', 'alolan', 'galarian', 'hisuian', 'paldean'];
  logos.sort((a, b) => {
    if (a.pokedex !== b.pokedex) return a.pokedex - b.pokedex;
    const aOrder = variantOrder.indexOf(a.variant);
    const bOrder = variantOrder.indexOf(b.variant);
    return (aOrder === -1 ? 99 : aOrder) - (bOrder === -1 ? 99 : bOrder);
  });

  // Create manifest
  const manifest: LogosManifest = {
    generatedAt: new Date().toISOString(),
    totalLogos: logos.length,
    logos,
  };

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`\nManifest generated successfully!`);
  console.log(`  Total logos: ${logos.length}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Output: ${OUTPUT_FILE}`);
}

main();
