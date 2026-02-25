'use client';

import { useState, useEffect } from 'react';
import manifest from '@/lib/logos-manifest.json';
import type { LogoEntry } from '@/lib/types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function BackgroundRow({ logos, direction, speed }: { logos: LogoEntry[]; direction: 'left' | 'right'; speed: number }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="flex overflow-hidden opacity-10 pointer-events-none">
      <div className={`flex ${animationClass}`} style={{ animationDuration: `${speed}s`, gap: '16px' }}>
        {[...logos, ...logos].map((logo, i) => (
          <img
            key={`${logo.pokedex}-${logo.variant}-${i}`}
            src={logo.path}
            alt=""
            className="object-contain flex-shrink-0"
            style={{ width: '64px', height: '64px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AnimatedBackground() {
  const [backgroundRows, setBackgroundRows] = useState<LogoEntry[][]>([]);

  useEffect(() => {
    const allLogos = manifest.logos as LogoEntry[];
    // Calculate rows based on viewport height (each row ~72px: 64px image + 8px gap)
    const rowHeight = 72;
    const numRows = Math.ceil(window.innerHeight / rowHeight) + 2; // +2 buffer
    setBackgroundRows(Array.from({ length: numRows }, () => shuffleArray(allLogos).slice(0, 25)));
  }, []);

  if (backgroundRows.length === 0) return null;

  return (
    <div className="fixed inset-0 flex flex-col justify-center -z-10 pointer-events-none" style={{ gap: '8px' }}>
      {backgroundRows.map((logos, i) => (
        <BackgroundRow
          key={i}
          logos={logos}
          direction={i % 2 === 0 ? 'right' : 'left'}
          speed={25 + (i * 3)}
        />
      ))}
    </div>
  );
}
