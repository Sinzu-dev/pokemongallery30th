'use client';

import { useState, FormEvent } from 'react';
import { FORM_VARIANTS } from '@/lib/types';

interface SubmitFormProps {
  defaultPokedex?: string;
  defaultName?: string;
}

export default function SubmitForm({ defaultPokedex = '', defaultName = '' }: SubmitFormProps) {
  const [url, setUrl] = useState('');
  const [pokedexNumber, setPokedexNumber] = useState(defaultPokedex);
  const [pokemonName, setPokemonName] = useState(defaultName);
  const [formVariant, setFormVariant] = useState('base');
  const [formName, setFormName] = useState('');
  const [submitterName, setSubmitterName] = useState('');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Validate Twitter URL format
  const isValidUrl = url.startsWith('https://pbs.twimg.com/media/');

  // Handle preview
  const handlePreview = async () => {
    if (!isValidUrl) {
      setMessage({ type: 'error', text: 'URL phải bắt đầu bằng https://pbs.twimg.com/media/' });
      return;
    }

    setPreviewing(true);
    setMessage(null);

    try {
      // Try to load image directly
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = url;
      });

      setPreviewUrl(url);
    } catch {
      setMessage({ type: 'error', text: 'Không thể tải ảnh. Kiểm tra lại URL.' });
      setPreviewUrl(null);
    } finally {
      setPreviewing(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValidUrl) {
      setMessage({ type: 'error', text: 'URL không hợp lệ' });
      return;
    }

    if (!pokedexNumber) {
      setMessage({ type: 'error', text: 'Vui lòng nhập số Pokedex' });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          pokedex_number: pokedexNumber,
          pokemon_name: pokemonName,
          form_variant: formVariant,
          form_name: formName,
          submitter_name: submitterName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setMessage({ type: 'success', text: 'Logo submitted! Waiting for approval.' });

      // Reset form
      setUrl('');
      setPokedexNumber('');
      setPokemonName('');
      setFormVariant('base');
      setFormName('');
      setSubmitterName('');
      setPreviewUrl(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Twitter URL */}
      <div>
        <label className="block text-sm font-medium mb-1">Twitter Image URL *</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://pbs.twimg.com/media/..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={handlePreview}
            disabled={!url || previewing}
            className="px-4 py-2 bg-[#4A90D9] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {previewing ? '...' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Preview Image */}
      {previewUrl && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-64 mx-auto rounded"
          />
        </div>
      )}

      {/* Pokedex Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Pokedex Number *</label>
        <input
          type="number"
          value={pokedexNumber}
          onChange={(e) => setPokedexNumber(e.target.value)}
          placeholder="25"
          min="1"
          max="1025"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Pokemon Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Pokemon Name</label>
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Pikachu"
          maxLength={100}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Form Variant */}
      <div>
        <label className="block text-sm font-medium mb-1">Regional Variant *</label>
        <select
          value={formVariant}
          onChange={(e) => {
            setFormVariant(e.target.value);
            if (e.target.value === 'base') setFormName('');
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          {FORM_VARIANTS.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      {/* Form Name - only show when NOT base */}
      {formVariant !== 'base' && (
        <div>
          <label className="block text-sm font-medium mb-1">Form Name</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Baile, Pa'u, Pom-Pom, Sensu..."
            maxLength={100}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Specific form name (e.g., Oricorio styles)</p>
        </div>
      )}

      {/* Submitter Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Your Name</label>
        <input
          type="text"
          value={submitterName}
          onChange={(e) => setSubmitterName(e.target.value)}
          placeholder="Anonymous"
          maxLength={100}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !isValidUrl || !pokedexNumber}
        className="w-full py-3 bg-[#FFD93D] text-gray-900 font-semibold rounded-lg hover:bg-yellow-400 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Đang gửi...' : 'Submit Logo'}
      </button>
    </form>
  );
}
