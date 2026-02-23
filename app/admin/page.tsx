'use client';

import { useState, useEffect } from 'react';
import type { Logo } from '@/lib/types';

export default function AdminPage() {
  const [pending, setPending] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const res = await fetch('/api/admin');
    const data = await res.json();
    setPending(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    fetchPending();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Admin - Pending Submissions</h1>

      {pending.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <p className="text-gray-500">No pending submissions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((logo) => (
            <div key={logo.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
              {/* Image */}
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                <img
                  src={logo.local_path}
                  alt={`Pokemon ${logo.pokedex_number}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-[#4A90D9]">
                    #{logo.pokedex_number.toString().padStart(4, '0')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                    {logo.form_variant}
                  </span>
                </div>
                {logo.pokemon_name && (
                  <p className="text-sm font-medium">{logo.pokemon_name}</p>
                )}
                {logo.form_name && (
                  <p className="text-sm text-gray-500">Form: {logo.form_name}</p>
                )}
                {logo.submitter_name && (
                  <p className="text-xs text-gray-400 mt-1">by {logo.submitter_name}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(logo.created_at).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAction(logo.id, 'approve')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(logo.id, 'reject')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-gray-400 text-sm mt-8">
        {pending.length} pending submission{pending.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
