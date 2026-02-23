'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FORM_VARIANTS } from '@/lib/types';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState(searchParams.get('form') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (form && form !== 'all') params.set('form', form);
    if (search) params.set('search', search);

    const queryString = params.toString();
    router.push(`/gallery${queryString ? `?${queryString}` : ''}`);
  }, [form, search, router]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Form Variant Filter */}
      <select
        value={form}
        onChange={(e) => setForm(e.target.value)}
        className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="all">All Forms</option>
        {FORM_VARIANTS.map((v) => (
          <option key={v.value} value={v.value}>
            {v.label}
          </option>
        ))}
      </select>

      {/* Pokedex Search */}
      <input
        type="number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by Pokedex #"
        min="1"
        max="1025"
        className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Clear button */}
      {(form !== 'all' || search) && (
        <button
          onClick={() => {
            setForm('all');
            setSearch('');
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Clear
        </button>
      )}
    </div>
  );
}
