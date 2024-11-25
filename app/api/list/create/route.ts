import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: 'User must be authenticated' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, boardId } = body;
    if (!title || !boardId) {
      return NextResponse.json({ error: 'Field is required.' }, { status: 400 });
    }
    const highestOrderList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = highestOrderList ? highestOrderList.order + 1 : 0;

    const list = await prisma.list.create({
      data: {
        title,
        order: nextOrder,
        boardId,
      },
    });

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error('Error add list:', error);
    return NextResponse.json({ error: 'Failed to add list' }, { status: 500 });
  }
}
