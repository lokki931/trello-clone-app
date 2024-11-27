import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  try {
    // Parse the request body
    const { lists } = await request.json();

    // Update the list order in the database
    const updatePromises = lists.map((list: { id: string; order: number }) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: list.order },
      }),
    );

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'List order updated successfully' });
  } catch (error) {
    console.error('Error updating list order:', error);
    return NextResponse.json({ message: 'Error updating list order' }, { status: 500 });
  }
}
