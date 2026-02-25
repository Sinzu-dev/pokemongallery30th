'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
    { href: '/random', label: 'Random' },
  ];

  return (
    <header className="bg-[#4A90D9] shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <Link href="/" className="flex items-center gap-3 text-[#FFD700] font-bold text-xl hover:opacity-90">
          <img src="/logos/0025-anime-1.png" alt="30th" className="w-12 h-12 object-contain" />
          <span className="hidden sm:inline">Pokemon 30th Anniversary Logo Gallery</span>
          <span className="sm:hidden">Pokemon 30th</span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pathname === link.href
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
