import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('lib/logos-manifest.json', 'utf-8'));
const types = JSON.parse(fs.readFileSync('lib/pokemon-types.json', 'utf-8'));

const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
  ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
  rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
  steel: '#B8B8D0', fairy: '#EE99AC'
};

const missing = [];
for (const logo of manifest.logos) {
  const key = `${logo.pokedex}-${logo.variant}`;
  if (!types[key]) {
    missing.push({ pokedex: logo.pokedex, name: logo.name, variant: logo.variant, key });
  }
}

async function fetchType(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    const t = data.types.map(x => x.type.name);
    return { types: t, colors: t.map(x => TYPE_COLORS[x] || '#888888') };
  } catch { return null; }
}

let added = 0;
for (const m of missing) {
  const data = await fetchType(m.pokedex);
  if (data) {
    types[m.key] = data;
    added++;
    console.log('Added', m.key, data.types.join('/'));
  } else {
    console.log('Failed', m.key);
  }
  await new Promise(r => setTimeout(r, 50));
}

fs.writeFileSync('lib/pokemon-types.json', JSON.stringify(types, null, 2));
console.log('Total added:', added);
