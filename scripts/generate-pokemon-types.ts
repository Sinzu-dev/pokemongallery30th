import * as fs from 'fs';
import * as path from 'path';

// Pokemon type colors (official-ish colors)
const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

interface PokemonTypeData {
  types: string[];
  colors: string[];
}

// Map variant to PokeAPI suffix
const VARIANT_TO_API: Record<string, string> = {
  // Regional forms
  alolan: '-alola',
  galarian: '-galar',
  hisuian: '-hisui',
  paldean: '-paldea',
  // Necrozma forms
  dawnwings: '-dawn',
  duskmane: '-dusk',
  ultra: '-ultra',
  // Kyurem forms
  black: '-black',
  white: '-white',
  // Urshifu forms
  'rapid-strike': '-rapid-strike',
  'single-strike': '-single-strike',
  // Giratina/Dialga/Palkia origin
  origin: '-origin',
  // Ursaluna
  bloodmoon: '-blood-moon',
  // Ogerpon
  terastal: '-teal-mask',
};

// Special overrides for specific Pokemon+variant combos
const SPECIAL_OVERRIDES: Record<string, { types: string[]; colors: string[] }> = {
  // Tauros Paldean Combat Breed
  '128-paldean': { types: ['fighting'], colors: ['#C03028'] },
  // Tatsugiri (API name issue)
  '978-base': { types: ['dragon', 'water'], colors: ['#7038F8', '#6890F0'] },
  // Dudunsparce (API name issue)
  '982-base': { types: ['normal'], colors: ['#A8A878'] },
};

async function fetchPokemonType(name: string, variant: string): Promise<PokemonTypeData | null> {
  try {
    // Build API endpoint based on variant
    const apiSuffix = VARIANT_TO_API[variant] || '';
    const pokemonName = name.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${pokemonName}${apiSuffix}`;

    const res = await fetch(endpoint);
    if (!res.ok) {
      // Fallback: try base form if regional form not found
      if (apiSuffix) {
        const fallbackRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          const types = data.types.map((t: { type: { name: string } }) => t.type.name);
          return { types, colors: types.map((t: string) => TYPE_COLORS[t] || '#888888') };
        }
      }
      return null;
    }

    const data = await res.json();
    const types = data.types.map((t: { type: { name: string } }) => t.type.name);
    const colors = types.map((t: string) => TYPE_COLORS[t] || '#888888');

    return { types, colors };
  } catch {
    return null;
  }
}

async function main() {
  const manifestPath = path.join(process.cwd(), 'lib', 'logos-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

  // Get unique pokedex-variant combinations
  interface LogoEntry { pokedex: number; name: string; variant: string }
  const uniqueEntries = new Map<string, LogoEntry>();
  for (const logo of manifest.logos as LogoEntry[]) {
    const key = `${logo.pokedex}-${logo.variant}`;
    if (!uniqueEntries.has(key)) {
      uniqueEntries.set(key, logo);
    }
  }

  console.log(`Fetching types for ${uniqueEntries.size} unique Pokemon (including variants)...`);

  const typeData: Record<string, { types: string[]; colors: string[] }> = {};
  let i = 0;

  for (const [key, logo] of uniqueEntries) {
    // Check special overrides first
    if (SPECIAL_OVERRIDES[key]) {
      typeData[key] = SPECIAL_OVERRIDES[key];
      i++;
      continue;
    }

    const data = await fetchPokemonType(logo.name, logo.variant);

    if (data) {
      typeData[key] = { types: data.types, colors: data.colors };
    }

    i++;
    if (i % 50 === 0) {
      console.log(`Progress: ${i}/${uniqueEntries.size}`);
    }

    // Rate limit: 100ms between requests
    await new Promise(r => setTimeout(r, 100));
  }

  // Save type data
  const outputPath = path.join(process.cwd(), 'lib', 'pokemon-types.json');
  fs.writeFileSync(outputPath, JSON.stringify(typeData, null, 2));

  console.log(`\nSaved ${Object.keys(typeData).length} Pokemon types to ${outputPath}`);
  console.log('Type colors:', TYPE_COLORS);
}

main();
