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
  const boardId = searchParams.get('boardId');

  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }

  try {
    const lists = await prisma.list.findMany({
      where: {
        boardId,
      },

      orderBy: { order: 'asc' },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (lists.length === 0) {
      return NextResponse.json({ message: 'No lists found' }, { status: 404 });
    }

    return NextResponse.json(lists, { status: 200 });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}
