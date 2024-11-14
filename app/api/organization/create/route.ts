import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function POST(request: Request) {
  const { title, img, userId } = await request.json();

  try {
    const organization = await prisma.organization.create({
      data: {
        title,
        img,
        users: {
          connect: { id: userId },
        },
      },
    });
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
