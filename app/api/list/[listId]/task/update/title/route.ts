import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }
  try {
    // Parse the incoming request body
    const { title, id }: { title: string; id: string } = await request.json();

    // Validate that the title and id are provided
    if (!title || !id) {
      return NextResponse.json({ error: 'Both title and task ID are required' }, { status: 400 });
    }

    // Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id, listId },
      data: { title },
    });

    // Respond with the updated task data
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ message: 'Error updating task' }, { status: 500 });
  }
}
