import { NextRequest, NextResponse } from 'next/server';
import { getPendingLogos, approveLogo, rejectLogo } from '@/lib/db';
import { deleteFile } from '@/lib/image-downloader';

// GET /api/admin - Get pending submissions
export async function GET() {
  try {
    const pending = getPendingLogos();
    return NextResponse.json(pending);
  } catch (error) {
    console.error('Failed to fetch pending:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST /api/admin - Approve or reject
export async function POST(request: NextRequest) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing id or action' }, { status: 400 });
    }

    if (action === 'approve') {
      approveLogo(id);
      return NextResponse.json({ success: true, message: 'Approved' });
    }

    if (action === 'reject') {
      const logo = rejectLogo(id);
      // Delete the file
      if (logo) {
        const filename = logo.local_path.split('/').pop();
        if (filename) deleteFile(filename);
      }
      return NextResponse.json({ success: true, message: 'Rejected and deleted' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin action failed:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
