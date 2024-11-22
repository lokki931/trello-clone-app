import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: { orgId: string } }) {
  const { orgId } = await params;

  if (!orgId) {
    return NextResponse.json({ error: 'Org ID is required' }, { status: 400 });
  }
  try {
    // Parse the incoming request body
    const { title } = await request.json();

    // Validate that the title is provided
    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    // Update the board title in the database
    const updatedOrg = await prisma.organization.update({
      where: { id: orgId },
      data: { title },
    });

    // Respond with the updated board data
    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error('Error updating org:', error);
    return NextResponse.json({ message: 'Error updating org' }, { status: 500 });
  }
}
