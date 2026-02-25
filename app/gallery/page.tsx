'use client';

import { useState, useMemo } from 'react';
import LogoCard from '@/components/logo-card';
import GalleryFilter from '@/components/gallery-filter';
import AnimatedBackground from '@/components/animated-background';
import manifest from '@/lib/logos-manifest.json';
import pokemonTypes from '@/lib/pokemon-types.json';
import type { LogoEntry } from '@/lib/types';

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const logos = useMemo(() => {
    let filtered: LogoEntry[] = manifest.logos as LogoEntry[];

    // Filter by search text
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((logo) => {
        const name = logo.name.toLowerCase();
        const numStr = logo.pokedex.toString();
        const paddedNum = logo.pokedex.toString().padStart(4, '0');
        const variant = logo.variant.toLowerCase();
        return name.includes(s) || numStr.includes(s) || paddedNum.includes(s) || variant.includes(s);
      });
    }

    // Filter by types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((logo) => {
        const typeKey = `${logo.pokedex}-${logo.variant}`;
        const typeData = (pokemonTypes as Record<string, { types: string[] }>)[typeKey];
        if (!typeData?.types) return false;
        return selectedTypes.some(t => typeData.types.includes(t));
      });
    }

    return filtered;
  }, [search, selectedTypes]);

  return (
    <div className="relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-center mb-2">Pokemon 30th Anniversary Logo Gallery</h1>
        <p className="text-center text-gray-500 mb-6">
          {manifest.totalLogos} logos collected
        </p>

        <GalleryFilter
          search={search}
          onSearchChange={setSearch}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />

        {logos.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No Pokemon found.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {logos.map((logo, index) => {
              const typeKey = `${logo.pokedex}-${logo.variant}`;
              const typeData = (pokemonTypes as Record<string, { types: string[]; colors: string[] }>)[typeKey];
              return (
                <LogoCard
                  key={`${typeKey}-${index}`}
                  logo={logo}
                  types={typeData?.types}
                  typeColors={typeData?.colors}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
