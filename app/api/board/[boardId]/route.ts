import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { boardId: string } }) {
  const { boardId } = await params;

  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    return NextResponse.json(board, { status: 200 });
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
