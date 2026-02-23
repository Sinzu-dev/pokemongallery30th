// TypeScript interfaces for Pokemon Logo Gallery

export interface Logo {
  id: number;
  pokedex_number: number;
  pokemon_name: string | null;
  form_variant: string;
  form_name: string | null;
  original_url: string;
  local_path: string;
  submitter_name: string | null;
  approved: number; // 0 = pending, 1 = approved
  created_at: string;
}

export interface LogoInput {
  pokedex_number: number;
  pokemon_name?: string;
  form_variant: string;
  form_name?: string;
  original_url: string;
  local_path: string;
  submitter_name?: string;
}

export const FORM_VARIANTS = [
  { value: 'base', label: 'Base' },
  { value: 'alolan', label: 'Alolan' },
  { value: 'galarian', label: 'Galarian' },
  { value: 'hisuian', label: 'Hisuian' },
  { value: 'paldean', label: 'Paldean' },
  { value: 'other', label: 'Other' },
] as const;

export type FormVariant = typeof FORM_VARIANTS[number]['value'];
