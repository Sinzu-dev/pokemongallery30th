'use client';

import type { LogoEntry } from '@/lib/types';

interface LogoCardProps {
  logo: LogoEntry;
  showTriangle?: boolean;
  typeColors?: string[]; // Array of 1-2 type colors
  types?: string[]; // Array of type names (e.g., ["grass", "poison"])
}

function formatPokedex(num: number): string {
  return `#${num.toString().padStart(4, '0')}`;
}

function getBadgeColor(variant: string): string {
  const colors: Record<string, string> = {
    base: 'bg-gray-200 text-gray-700',
    alolan: 'bg-cyan-200 text-cyan-700',
    galarian: 'bg-pink-200 text-pink-700',
    hisuian: 'bg-amber-200 text-amber-700',
    paldean: 'bg-orange-200 text-orange-700',
  };
  return colors[variant] || 'bg-purple-200 text-purple-700';
}

export default function LogoCard({ logo, showTriangle = false, typeColors = ['#888888'], types = [] }: LogoCardProps) {
  return (
    <a
      href={logo.path}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center p-2 relative">
        <img
          src={logo.path}
          alt={`${logo.name} ${logo.variant !== 'base' ? `(${logo.variant})` : ''}`}
          className="max-w-full max-h-full object-contain"
          loading="lazy"
        />
        {showTriangle && typeColors.length === 1 && (
          <div
            className="absolute bottom-0 left-0"
            style={{
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '32px 0 0 32px',
              borderColor: `transparent transparent transparent ${typeColors[0]}`,
            }}
          />
        )}
        {showTriangle && typeColors.length >= 2 && (
          <>
            {/* First type - full triangle */}
            <div
              className="absolute bottom-0 left-0"
              style={{
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '32px 0 0 32px',
                borderColor: `transparent transparent transparent ${typeColors[0]}`,
              }}
            />
            {/* Second type - smaller triangle at corner */}
            <div
              className="absolute bottom-0 left-0"
              style={{
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '16px 0 0 16px',
                borderColor: `transparent transparent transparent ${typeColors[1]}`,
              }}
            />
          </>
        )}
      </div>
      <div className="p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-[#4A90D9] text-xs">
            {formatPokedex(logo.pokedex)}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full ${getBadgeColor(logo.variant)}`}
          >
            {logo.variant}
          </span>
        </div>
        <p className="text-xs font-medium text-gray-800 truncate">{logo.name}</p>
        {types.length > 0 && (
          <div className="flex gap-1 mt-1">
            {types.map((type, i) => (
              <span
                key={type}
                className="text-[9px] px-1.5 py-0.5 rounded capitalize text-white font-medium"
                style={{ backgroundColor: typeColors[i] || '#888888' }}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
