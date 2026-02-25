// TypeScript interfaces for Pokemon Logo Gallery

// Logo entry from manifest (static file-based)
export interface LogoEntry {
  pokedex: number;
  name: string;
  variant: string;
  filename: string;
  path: string;
}

// Manifest structure
export interface LogosManifest {
  generatedAt: string;
  totalLogos: number;
  logos: LogoEntry[];
}

// Form variants for badge colors
export const FORM_VARIANTS = [
  { value: 'base', label: 'Base' },
  { value: 'alolan', label: 'Alolan' },
  { value: 'galarian', label: 'Galarian' },
  { value: 'hisuian', label: 'Hisuian' },
  { value: 'paldean', label: 'Paldean' },
  { value: 'other', label: 'Other' },
] as const;

export type FormVariant = (typeof FORM_VARIANTS)[number]['value'];
