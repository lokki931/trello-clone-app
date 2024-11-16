import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || typeof token.id !== 'string') {
    return NextResponse.json({ error: 'User must be authenticated' }, { status: 401 });
  }

  const userId = token.id;

  const { title, imgFull, imgThumb, organizationId } = await request.json();
  if (!title || !imgFull || !imgThumb || !organizationId) {
    return NextResponse.json({ error: 'Field is required.' }, { status: 400 });
  }
  try {
    const board = await prisma.board.create({
      data: {
        title,
        imgFull,
        imgThumb,
        createdById: userId,
        organizationId,
      },
    });
    return NextResponse.json(board, { status: 200 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
  }
}
