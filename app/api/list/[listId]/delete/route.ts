import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }

  try {
    // Find the board to ensure it exists before deleting
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    // Delete the board
    await prisma.list.delete({
      where: { id: listId },
    });

    return NextResponse.json({ message: 'List deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting list with ID ${listId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
