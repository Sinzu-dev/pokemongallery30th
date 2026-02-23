import { NextRequest, NextResponse } from 'next/server';
import { insertLogo, isDuplicate, updateLogoPath, countVariants } from '@/lib/db';
import { isValidTwitterImageUrl, downloadImage, renameToFinal, deleteFile } from '@/lib/image-downloader';
import type { LogoInput } from '@/lib/types';

// POST /api/logos - Create new logo (pending approval)
export async function POST(request: NextRequest) {
  let tempFilename: string | null = null;

  try {
    const body = await request.json();
    const { url, pokedex_number, pokemon_name, form_variant, form_name, submitter_name } = body;

    // Validate required fields
    if (!url || !pokedex_number || !form_variant) {
      return NextResponse.json(
        { error: 'Missing required fields: url, pokedex_number, form_variant' },
        { status: 400 }
      );
    }

    // Validate Twitter URL
    if (!isValidTwitterImageUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL. Must be a Twitter image URL (pbs.twimg.com/media/)' },
        { status: 400 }
      );
    }

    // Validate pokedex number
    const pokedexNum = parseInt(pokedex_number, 10);
    if (isNaN(pokedexNum) || pokedexNum < 1 || pokedexNum > 1025) {
      return NextResponse.json(
        { error: 'Pokedex number must be between 1 and 1025' },
        { status: 400 }
      );
    }

    // Check duplicate
    if (isDuplicate(url)) {
      return NextResponse.json(
        { error: 'This image URL has already been submitted' },
        { status: 409 }
      );
    }

    // Download image
    const { localPath, filename } = await downloadImage(url, pokedexNum, form_variant);
    tempFilename = filename;

    // Insert to database (approved = 0 by default)
    const logoInput: LogoInput = {
      pokedex_number: pokedexNum,
      pokemon_name: pokemon_name?.trim() || undefined,
      form_variant,
      form_name: form_name?.trim() || undefined,
      original_url: url,
      local_path: localPath,
      submitter_name: submitter_name?.trim() || undefined,
    };

    const logo = insertLogo(logoInput);

    // Rename file with sequence number (count after insert)
    const sequence = countVariants(pokedexNum);
    const finalPath = renameToFinal(filename, pokedexNum, sequence);
    updateLogoPath(logo.id, finalPath);

    return NextResponse.json({
      success: true,
      message: 'Submitted! Your logo will appear after approval.',
      logo: { ...logo, local_path: finalPath }
    }, { status: 201 });
  } catch (error) {
    // Cleanup temp file on error
    if (tempFilename) {
      deleteFile(tempFilename);
    }

    console.error('Failed to create logo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create logo' },
      { status: 500 }
    );
  }
}
