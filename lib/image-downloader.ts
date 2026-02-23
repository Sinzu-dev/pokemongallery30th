import fs from 'fs';
import path from 'path';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

// Validate Twitter image URL
export function isValidTwitterImageUrl(url: string): boolean {
  return url.startsWith('https://pbs.twimg.com/media/');
}

// Get file extension from content-type
function getExtension(contentType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };
  return map[contentType] || 'jpg';
}

// Generate unique filename: {pokedex}-{sequence}.{ext}
export function generateFilename(
  pokedexNumber: number,
  sequence: number,
  extension: string
): string {
  return `${pokedexNumber.toString().padStart(4, '0')}-${sequence}.${extension}`;
}

// Download image from URL and save to public/logos
export async function downloadImage(
  url: string,
  pokedexNumber: number,
  formVariant: string
): Promise<{ localPath: string; filename: string }> {
  // Ensure logos directory exists
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
  }

  // Fetch image
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) {
    throw new Error('URL does not point to an image');
  }

  const buffer = await response.arrayBuffer();
  const extension = getExtension(contentType);

  // Generate temp filename (will be renamed after DB insert)
  const tempFilename = `temp-${Date.now()}-${pokedexNumber}-${formVariant}.${extension}`;
  const tempPath = path.join(LOGOS_DIR, tempFilename);

  // Write file
  fs.writeFileSync(tempPath, Buffer.from(buffer));

  return {
    localPath: `/logos/${tempFilename}`,
    filename: tempFilename,
  };
}

// Rename temp file to final filename: {pokedex}-{sequence}.{ext}
export function renameToFinal(
  tempFilename: string,
  pokedexNumber: number,
  sequence: number
): string {
  const extension = tempFilename.split('.').pop() || 'jpg';
  const finalFilename = generateFilename(pokedexNumber, sequence, extension);

  const oldPath = path.join(LOGOS_DIR, tempFilename);
  const newPath = path.join(LOGOS_DIR, finalFilename);

  fs.renameSync(oldPath, newPath);

  return `/logos/${finalFilename}`;
}

// Delete file (for cleanup on error)
export function deleteFile(filename: string): void {
  const filePath = path.join(LOGOS_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
