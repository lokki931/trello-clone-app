import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'User must be authenticated' }, { status: 401 });
  }

  // Extract query parameters instead of relying on `request.json()`
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get('organizationId');

  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  try {
    const boards = await prisma.board.findMany({
      where: {
        organizationId,
      },
    });

    if (boards.length === 0) {
      return NextResponse.json({ message: 'No boards found' }, { status: 404 });
    }

    return NextResponse.json(boards, { status: 200 });
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
  }
}
