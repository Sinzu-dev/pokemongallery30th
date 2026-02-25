'use client';

import { useState, useCallback, useRef } from 'react';
import { domToPng } from 'modern-screenshot';
import LogoCard from '@/components/logo-card';
import AnimatedBackground from '@/components/animated-background';
import manifest from '@/lib/logos-manifest.json';
import pokemonTypes from '@/lib/pokemon-types.json';
import type { LogoEntry } from '@/lib/types';

type PickMode = 1 | 6 | 9 | 100;

const MODES: { value: PickMode; label: string; description: string }[] = [
  { value: 1, label: '1', description: 'Pick 1' },
  { value: 6, label: '6', description: 'Pick a team of 6' },
  { value: 9, label: '9', description: 'Pick 9' },
  { value: 100, label: '100', description: 'Pick 100' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function RandomPage() {
  const [mode, setMode] = useState<PickMode>(6);
  const [picked, setPicked] = useState<LogoEntry[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTriangleOnSave, setShowTriangleOnSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleModeChange = (newMode: PickMode) => {
    setMode(newMode);
    setPicked([]);
  };

  const handlePick = useCallback(() => {
    setIsAnimating(true);
    setPicked([]);

    setTimeout(() => {
      const shuffled = shuffleArray(manifest.logos as LogoEntry[]);
      setPicked(shuffled.slice(0, mode));
      setIsAnimating(false);
    }, 500);
  }, [mode]);

  const handleSave = useCallback(async () => {
    if (!gridRef.current) return;

    setIsSaving(true);
    // Wait for grid to become visible and images to be ready
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const dataUrl = await domToPng(gridRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `pokemon-team-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Save failed:', error);
    }

    setIsSaving(false);
  }, []);

  const getGridCols = () => {
    if (mode === 1) return 'grid-cols-1 max-w-xs mx-auto';
    if (mode === 6) return 'grid-cols-3 max-w-xl mx-auto'; // 3x2 layout
    if (mode === 9) return 'grid-cols-3 max-w-xl mx-auto'; // 3x3 layout
    return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-10 max-w-6xl mx-auto';
  };

  return (
    <div className="relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-center mb-2">Random Team Generator</h1>
        <p className="text-center text-gray-500 mb-6">
          Pick random from {manifest.totalLogos} logos
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => handleModeChange(m.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === m.value
                  ? 'bg-[#4A90D9] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title={m.description}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="text-center mb-8 flex justify-center gap-4">
          <button
            onClick={handlePick}
            disabled={isAnimating}
            className="px-8 py-4 bg-[#FFD93D] text-gray-900 font-bold text-xl rounded-xl hover:bg-yellow-400 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg"
          >
            {isAnimating ? 'Picking...' : mode === 6 ? 'Pick Random Team!' : `Pick ${mode}!`}
          </button>

          {picked.length > 0 && (mode === 6 || mode === 9) && (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-4 bg-[#4A90D9] text-white font-bold text-xl rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-all transform hover:scale-105 shadow-lg"
              >
                {isSaving ? 'Saving...' : 'Save Image'}
              </button>
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTriangleOnSave}
                  onChange={(e) => setShowTriangleOnSave(e.target.checked)}
                  className="w-5 h-5 accent-pink-500"
                />
                <span className="text-sm">Add type</span>
              </label>
            </>
          )}
        </div>

        {picked.length > 0 && (
          <>
            {/* Display grid with full cards */}
            <div className={`grid gap-3 ${getGridCols()} bg-white p-4 rounded-xl`}>
              {picked.map((logo, index) => (
                <div
                  key={`${logo.pokedex}-${logo.variant}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <LogoCard
                    logo={logo}
                    showTriangle={false}
                    types={(pokemonTypes as Record<string, { types: string[]; colors: string[] }>)[`${logo.pokedex}-${logo.variant}`]?.types}
                    typeColors={(pokemonTypes as Record<string, { types: string[]; colors: string[] }>)[`${logo.pokedex}-${logo.variant}`]?.colors}
                  />
                </div>
              ))}
            </div>

            {/* Grid for image-only export (hidden when not saving) */}
            <div
              ref={gridRef}
              className={`grid gap-4 ${mode === 6 ? 'grid-cols-3' : 'grid-cols-3'} bg-white p-4`}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '1200px',
                clipPath: isSaving ? 'none' : 'inset(100%)',
                pointerEvents: 'none',
                zIndex: isSaving ? 9999 : -1
              }}
            >
              {picked.map((logo) => {
                const colors = (pokemonTypes as Record<string, { colors: string[] }>)[`${logo.pokedex}-${logo.variant}`]?.colors || ['#888888'];
                const triangleSize = 48;
                return (
                  <div key={`save-${logo.pokedex}-${logo.variant}`} className="relative bg-gray-100 aspect-square flex items-center justify-center p-4">
                    <img src={logo.path} alt="" className="max-w-full max-h-full object-contain" />
                    {showTriangleOnSave && colors.length === 1 && (
                      <div
                        className="absolute bottom-0 left-0"
                        style={{
                          width: 0, height: 0,
                          borderStyle: 'solid',
                          borderWidth: `${triangleSize}px 0 0 ${triangleSize}px`,
                          borderColor: `transparent transparent transparent ${colors[0]}`,
                        }}
                      />
                    )}
                    {showTriangleOnSave && colors.length >= 2 && (
                      <svg
                        className="absolute bottom-0 left-0"
                        width={triangleSize}
                        height={triangleSize}
                        viewBox={`0 0 ${triangleSize} ${triangleSize}`}
                      >
                        {/* Type 1 - upper half (from corner to midpoint of hypotenuse) */}
                        <polygon points={`0,${triangleSize} 0,0 ${triangleSize / 2},${triangleSize / 2}`} fill={colors[0]} />
                        {/* Type 2 - lower half (from corner to midpoint to bottom-right) */}
                        <polygon points={`0,${triangleSize} ${triangleSize / 2},${triangleSize / 2} ${triangleSize},${triangleSize}`} fill={colors[1]} />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {picked.length === 0 && !isAnimating && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-6xl mb-4">?</p>
            <p>Press the button to pick random!</p>
          </div>
        )}
      </div>
    </div>
  );
}
