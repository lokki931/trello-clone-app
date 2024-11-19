import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { boardId: string } }) {
  const { boardId } = await params;

  if (!boardId) {
    return NextResponse.json({ error: 'Board ID is required' }, { status: 400 });
  }
  try {
    // Parse the incoming request body
    const { title } = await request.json();

    // Validate that the title is provided
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    // Update the board title in the database
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: { title },
    });

    // Respond with the updated board data
    return NextResponse.json(updatedBoard);
  } catch (error) {
    console.error('Error updating board:', error);
    return NextResponse.json({ message: 'Error updating board' }, { status: 500 });
  }
}
