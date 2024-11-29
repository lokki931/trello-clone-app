import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = await params;

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const { title } = body;
    if (!title) {
      return NextResponse.json({ error: 'Field is required.' }, { status: 400 });
    }
    const highestOrderTask = await prisma.task.findFirst({
      where: { listId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = highestOrderTask ? highestOrderTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: {
        title,
        order: nextOrder,
        listId,
      },
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error add task:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}
