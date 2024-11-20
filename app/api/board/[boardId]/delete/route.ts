import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { boardId: string } }) {
  const { boardId } = await params;

  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }

  try {
    // Find the board to ensure it exists before deleting
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Delete the board
    await prisma.board.delete({
      where: { id: boardId },
    });

    return NextResponse.json({ message: 'Board deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting board with ID ${boardId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
