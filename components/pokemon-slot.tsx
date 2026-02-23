'use client';
import type { Logo } from '@/lib/types';
import pokemonNames from '@/lib/pokemon-names.json';

interface PokemonSlotProps {
  pokedexNumber: number;
  logos?: Logo[];
}

function formatPokedex(num: number): string {
  return `#${num.toString().padStart(4, '0')}`;
}

function getBadgeColor(form: string): string {
  const colors: Record<string, string> = {
    base: 'bg-gray-200 text-gray-700',
    alolan: 'bg-cyan-200 text-cyan-700',
    galarian: 'bg-pink-200 text-pink-700',
    hisuian: 'bg-amber-200 text-amber-700',
    paldean: 'bg-orange-200 text-orange-700',
    other: 'bg-purple-200 text-purple-700',
  };
  return colors[form] || colors.other;
}

export default function PokemonSlot({ pokedexNumber, logos }: PokemonSlotProps) {
  const hasLogos = logos && logos.length > 0;
  const pokemonName = (pokemonNames as Record<string, string>)[pokedexNumber.toString()] || `Pokemon ${pokedexNumber}`;

  // Empty slot - just display (no submit on static site)
  if (!hasLogos) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300">
        <div className="aspect-square bg-gray-50 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-300">
            {pokedexNumber}
          </span>
        </div>
        <div className="p-2 text-center">
          <span className="text-xs text-gray-400">{formatPokedex(pokedexNumber)}</span>
          <p className="text-xs font-medium text-gray-500 truncate">{pokemonName}</p>
        </div>
      </div>
    );
  }

  // Has logo(s) - show first one, click opens image
  const logo = logos[0];

  return (
    <a
      href={logo.local_path}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
        <img
          src={logo.local_path}
          alt={logo.pokemon_name || `Pokemon ${logo.pokedex_number}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[#4A90D9]">
            {formatPokedex(logo.pokedex_number)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(logo.form_variant)}`}>
            {logo.form_variant}
          </span>
        </div>
        <p className="text-xs font-medium text-gray-800 truncate">
          {pokemonName}
          {logo.form_name && (
            <span className="text-gray-500 font-normal"> ({logo.form_name})</span>
          )}
        </p>
        {logos.length > 1 && (
          <p className="text-xs text-[#4A90D9] mt-1">+{logos.length - 1} more</p>
        )}
      </div>
    </a>
  );
}
