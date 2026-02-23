import Database from 'better-sqlite3';
import path from 'path';
import type { Logo, LogoInput } from './types';

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'pokemon.db');
const db = new Database(dbPath);

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS logos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pokedex_number INTEGER NOT NULL,
    pokemon_name TEXT,
    form_variant TEXT DEFAULT 'base',
    original_url TEXT NOT NULL,
    local_path TEXT NOT NULL UNIQUE,
    submitter_name TEXT,
    approved INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_pokedex ON logos(pokedex_number);
  CREATE INDEX IF NOT EXISTS idx_form ON logos(form_variant);
  CREATE INDEX IF NOT EXISTS idx_approved ON logos(approved);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_original_url ON logos(original_url);
`);

// Prepared statements
const insertStmt = db.prepare(`
  INSERT INTO logos (pokedex_number, pokemon_name, form_variant, form_name, original_url, local_path, submitter_name, approved)
  VALUES (@pokedex_number, @pokemon_name, @form_variant, @form_name, @original_url, @local_path, @submitter_name, 0)
`);

const checkDuplicateStmt = db.prepare(`
  SELECT id FROM logos WHERE original_url = ?
`);

// Database functions
export function insertLogo(input: LogoInput): Logo {
  const result = insertStmt.run({
    pokedex_number: input.pokedex_number,
    pokemon_name: input.pokemon_name || null,
    form_variant: input.form_variant,
    form_name: input.form_name || null,
    original_url: input.original_url,
    local_path: input.local_path,
    submitter_name: input.submitter_name || null,
  });

  return db.prepare('SELECT * FROM logos WHERE id = ?').get(result.lastInsertRowid) as Logo;
}

export function isDuplicate(originalUrl: string): boolean {
  return checkDuplicateStmt.get(originalUrl) !== undefined;
}

export function updateLogoPath(id: number, newPath: string): void {
  db.prepare('UPDATE logos SET local_path = ? WHERE id = ?').run(newPath, id);
}

// Get approved logos grouped by pokedex number
export function getApprovedLogosMap(): Map<number, Logo[]> {
  const logos = db.prepare(`
    SELECT * FROM logos WHERE approved = 1
    ORDER BY pokedex_number ASC,
      CASE form_variant
        WHEN 'base' THEN 0
        WHEN 'alolan' THEN 1
        WHEN 'galarian' THEN 2
        WHEN 'hisuian' THEN 3
        WHEN 'paldean' THEN 4
        ELSE 5
      END
  `).all() as Logo[];

  const map = new Map<number, Logo[]>();
  for (const logo of logos) {
    const existing = map.get(logo.pokedex_number) || [];
    existing.push(logo);
    map.set(logo.pokedex_number, existing);
  }
  return map;
}

// Get pending logos for admin review
export function getPendingLogos(): Logo[] {
  return db.prepare(`
    SELECT * FROM logos WHERE approved = 0
    ORDER BY created_at DESC
  `).all() as Logo[];
}

// Approve a logo
export function approveLogo(id: number): void {
  db.prepare('UPDATE logos SET approved = 1 WHERE id = ?').run(id);
}

// Reject/delete a logo
export function rejectLogo(id: number): Logo | undefined {
  const logo = db.prepare('SELECT * FROM logos WHERE id = ?').get(id) as Logo | undefined;
  db.prepare('DELETE FROM logos WHERE id = ?').run(id);
  return logo;
}

// Get logo by id
export function getLogoById(id: number): Logo | undefined {
  return db.prepare('SELECT * FROM logos WHERE id = ?').get(id) as Logo | undefined;
}

// Count variants for a pokedex number (for filename sequencing)
export function countVariants(pokedexNumber: number): number {
  const result = db.prepare('SELECT COUNT(*) as count FROM logos WHERE pokedex_number = ?').get(pokedexNumber) as { count: number };
  return result.count;
}

export default db;
