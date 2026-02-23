import PokemonSlot from '@/components/pokemon-slot';
import logosData from '@/lib/logos-data.json';
import type { Logo } from '@/lib/types';

const TOTAL_POKEMON = 1025;

export default function GalleryPage() {
  // Convert JSON to Map
  const logosMap = new Map<number, Logo[]>();
  Object.entries(logosData).forEach(([key, logos]) => {
    logosMap.set(parseInt(key), logos.map(l => ({
      id: 0,
      pokedex_number: parseInt(key),
      pokemon_name: l.name,
      form_variant: l.variant,
      form_name: (l as { form?: string }).form || null,
      original_url: '',
      local_path: l.path,
      submitter_name: null,
      approved: 1,
      created_at: ''
    })));
  });

  const filledCount = logosMap.size;
  const allPokedex = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2">Pokemon Logo Gallery</h1>
      <p className="text-center text-gray-500 mb-6">
        {filledCount} / {TOTAL_POKEMON} Pokemon collected
      </p>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {allPokedex.map((num) => (
          <PokemonSlot key={num} pokedexNumber={num} logos={logosMap.get(num)} />
        ))}
      </div>
    </div>
  );
}
