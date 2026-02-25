'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// All 18 Pokemon types with official colors
const POKEMON_TYPES: { name: string; color: string }[] = [
  { name: 'normal', color: '#A8A878' },
  { name: 'fire', color: '#F08030' },
  { name: 'water', color: '#6890F0' },
  { name: 'electric', color: '#F8D030' },
  { name: 'grass', color: '#78C850' },
  { name: 'ice', color: '#98D8D8' },
  { name: 'fighting', color: '#C03028' },
  { name: 'poison', color: '#A040A0' },
  { name: 'ground', color: '#E0C068' },
  { name: 'flying', color: '#A890F0' },
  { name: 'psychic', color: '#F85888' },
  { name: 'bug', color: '#A8B820' },
  { name: 'rock', color: '#B8A038' },
  { name: 'ghost', color: '#705898' },
  { name: 'dragon', color: '#7038F8' },
  { name: 'dark', color: '#705848' },
  { name: 'steel', color: '#B8B8D0' },
  { name: 'fairy', color: '#EE99AC' },
];

export default function GalleryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const typesParam = searchParams.get('types');
    return typesParam ? typesParam.split(',') : [];
  });

  // Sync selectedTypes with URL on mount
  useEffect(() => {
    const typesParam = searchParams.get('types');
    setSelectedTypes(typesParam ? typesParam.split(',') : []);
  }, [searchParams]);

  const updateUrl = (newSearch: string, newTypes: string[]) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newTypes.length > 0) params.set('types', newTypes.join(','));
    const queryString = params.toString();
    router.push(queryString ? `/gallery?${queryString}` : '/gallery');
  };

  const handleSearch = () => {
    updateUrl(search, selectedTypes);
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    updateUrl(search, newTypes);
  };

  const clearAll = () => {
    setSearch('');
    setSelectedTypes([]);
    router.push('/gallery');
  };

  const hasFilters = search || selectedTypes.length > 0;

  return (
    <div className="mb-4 space-y-3">
      {/* Search row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by name or number..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-[#4A90D9] text-white rounded-lg hover:bg-blue-600">
          Search
        </button>
        {hasFilters && (
          <button onClick={clearAll} className="px-4 py-2 text-gray-600">
            Clear
          </button>
        )}
      </div>

      {/* Type filter row */}
      <div className="flex flex-wrap gap-1.5">
        {POKEMON_TYPES.map(({ name, color }) => {
          const isActive = selectedTypes.includes(name);
          return (
            <button
              key={name}
              onClick={() => toggleType(name)}
              className="px-2 py-1 text-xs rounded capitalize font-medium transition-all"
              style={{
                backgroundColor: isActive ? color : 'transparent',
                color: isActive ? '#fff' : color,
                border: `2px solid ${color}`,
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
