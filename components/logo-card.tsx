import type { Logo } from '@/lib/types';

interface LogoCardProps {
  logo: Logo;
}

// Format pokedex number: 25 → #0025
function formatPokedex(num: number): string {
  return `#${num.toString().padStart(4, '0')}`;
}

// Get badge color by form variant
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

export default function LogoCard({ logo }: LogoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
        <img
          src={logo.local_path}
          alt={logo.pokemon_name || `Pokemon ${logo.pokedex_number}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[#4A90D9]">
            {formatPokedex(logo.pokedex_number)}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(logo.form_variant)}`}>
            {logo.form_variant}
          </span>
        </div>

        {(logo.pokemon_name || logo.form_name) && (
          <p className="text-sm font-medium text-gray-800 truncate">
            {logo.pokemon_name}
            {logo.form_name && (
              <span className="text-gray-500 font-normal"> ({logo.form_name})</span>
            )}
          </p>
        )}

        {logo.submitter_name && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            by {logo.submitter_name}
          </p>
        )}
      </div>
    </div>
  );
}
