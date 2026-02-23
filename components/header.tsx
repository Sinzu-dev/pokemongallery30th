'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/gallery', label: 'Gallery' },
  ];

  return (
    <header className="bg-[#4A90D9] shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo/Title */}
        <Link href="/" className="text-[#FFD700] font-bold text-xl hover:opacity-90">
          Pokemon Logo Gallery
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
