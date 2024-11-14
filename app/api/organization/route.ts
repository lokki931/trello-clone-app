import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || typeof token.id !== 'string') {
    return NextResponse.json({ error: 'User must be authenticated' }, { status: 401 });
  }

  const userId = token.id; // Type is now confirmed to be a string

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        users: {
          some: {
            id: userId, // userId is now of type string
          },
        },
      },
      include: {
        users: true, // Optional: Include users if you want to see user details within each organization
      },
    });

    if (organizations.length === 0) {
      return NextResponse.json(
        { message: 'No organizations found for this user' },
        { status: 404 },
      );
    }

    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error('Error fetching organizations for user:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
