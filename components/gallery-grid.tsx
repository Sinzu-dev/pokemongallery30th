import type { Logo } from '@/lib/types';
import LogoCard from './logo-card';

interface GalleryGridProps {
  logos: Logo[];
}

export default function GalleryGrid({ logos }: GalleryGridProps) {
  if (logos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No logos found</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or submit a new logo!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {logos.map((logo) => (
        <LogoCard key={logo.id} logo={logo} />
      ))}
    </div>
  );
}
