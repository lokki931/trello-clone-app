import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { boardId } = body;
    // Find the board to ensure it exists before deleting
    const listUnique = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!listUnique) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    const highestOrderList = await prisma.list.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = highestOrderList ? highestOrderList.order + 1 : 0;

    // Delete the board
    const copyList = await prisma.list.create({
      data: {
        title: `${listUnique.title} - Copy`,
        boardId,
        order: nextOrder,
      },
    });

    return NextResponse.json(copyList, { status: 200 });
  } catch (error) {
    console.error(`Error deleting list with ID ${listId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
