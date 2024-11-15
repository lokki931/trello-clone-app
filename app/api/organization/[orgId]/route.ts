import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getToken } from 'next-auth/jwt';

interface MyToken {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: { orgId: string } }) {
  if (!process.env.NEXTAUTH_SECRET) {
    console.error('NEXTAUTH_SECRET is missing in environment variables.');
    return NextResponse.json({ error: 'Server configuration issue' }, { status: 500 });
  }

  // Authenticate the user
  const token = (await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })) as MyToken | null;

  if (!token || !token.id) {
    return NextResponse.json({ error: 'You are not authorized. Please log in.' }, { status: 401 });
  }

  const userId = token.id;
  const { orgId } = await params; // Get orgId from the dynamic route

  if (!orgId) {
    return NextResponse.json({ error: 'Organization ID is required.' }, { status: 400 });
  }

  try {
    // Fetch the organization by ID and validate user association
    const organization = await prisma.organization.findFirst({
      where: {
        id: orgId,
        users: {
          some: { id: userId },
        },
      },
      include: {
        users: true, // Optional: Include users for additional context
      },
    });

    if (!organization) {
      return NextResponse.json(
        { message: 'Organization not found or you do not have access to it.' },
        { status: 404 },
      );
    }

    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization. Please try again later.' },
      { status: 500 },
    );
  }
}
