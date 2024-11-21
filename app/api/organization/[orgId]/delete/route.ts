import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(req: Request, { params }: { params: { orgId: string } }) {
  const { orgId } = await params;

  if (!orgId) {
    return NextResponse.json({ error: 'Org ID is required' }, { status: 400 });
  }

  try {
    // Find the board to ensure it exists before deleting
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!org) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 });
    }

    // Delete the board
    await prisma.organization.delete({
      where: { id: orgId },
    });

    return NextResponse.json({ message: 'Org deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting org with ID ${orgId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
