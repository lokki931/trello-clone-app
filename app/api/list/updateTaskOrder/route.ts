import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { listId, tasks } = await req.json();

    // Input Validation
    if (!listId || typeof listId !== 'string') {
      return NextResponse.json({ message: 'Invalid or missing listId' }, { status: 400 });
    }

    if (!Array.isArray(tasks) || tasks.some((task) => !task.id)) {
      return NextResponse.json({ message: 'Invalid tasks format' }, { status: 400 });
    }

    // Validate the existence of the list
    const list = await prisma.list.findUnique({
      where: { id: listId },
    });

    if (!list) {
      return NextResponse.json({ message: 'List not found' }, { status: 404 });
    }

    // Update task order within the list
    const updatePromises = tasks.map((task, index) => {
      return prisma.task.update({
        where: { id: task.id },
        data: { order: index, listId }, // Ensure the task remains associated with the correct list
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Task order updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating task order:', error);
    return NextResponse.json(
      {
        message: 'Failed to update task order',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
