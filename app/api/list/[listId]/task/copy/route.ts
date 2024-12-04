import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Find the task to ensure it exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.listId !== listId) {
      return NextResponse.json({ error: 'Task not found in the specified list' }, { status: 404 });
    }

    // Find the task with the highest order in the same list
    const highestOrderTask = await prisma.task.findFirst({
      where: { listId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    // Create a copy of the task
    const copiedTask = await prisma.task.create({
      data: {
        title: `${task.title} - Copy`,
        listId,
        order: nextOrder,
      },
    });

    return NextResponse.json(copiedTask, { status: 200 });
  } catch (error) {
    console.error(`Error copying task in list with ID ${listId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
