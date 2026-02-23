import { getApprovedLogosMap } from '@/lib/db';
import PokemonSlot from '@/components/pokemon-slot';

const TOTAL_POKEMON = 1025;

export default function GalleryPage() {
  const logosMap = getApprovedLogosMap();
  const filledCount = logosMap.size;

  // Generate array of all pokedex numbers 1-1025
  const allPokedex = Array.from({ length: TOTAL_POKEMON }, (_, i) => i + 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2">Pokemon Logo Gallery</h1>
      <p className="text-center text-gray-500 mb-6">
        {filledCount} / {TOTAL_POKEMON} Pokemon collected
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {allPokedex.map((num) => (
          <PokemonSlot
            key={num}
            pokedexNumber={num}
            logos={logosMap.get(num)}
          />
        ))}
      </div>
    </div>
  );
}
