import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }
  try {
    // Parse the incoming request body
    const { title } = await request.json();

    // Validate that the title is provided
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    // Update the board title in the database
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { title },
    });

    // Respond with the updated board data
    return NextResponse.json(updatedList);
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ message: 'Error updating list' }, { status: 500 });
  }
}
