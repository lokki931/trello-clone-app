import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const currentUrl = new URL(request.url);

  // Define protected paths
  const protectedPaths = ['/org', '/board', '/api'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // If the path is protected and the user is not authenticated, redirect to sign-in
  if (isProtectedPath && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated and tries to access unauthenticated routes, redirect to '/org'
  if (token) {
    if (currentUrl.pathname === '/board') {
      // You can add board-specific redirection logic here
      return NextResponse.next(); // Placeholder for any specific handling for the '/board' route
    }

    if (currentUrl.pathname !== '/org' && !isProtectedPath) {
      return NextResponse.redirect(new URL('/org', currentUrl.origin));
    }
  }

  // Proceed with the request if no redirection is needed
  return NextResponse.next();
}

// Specify which paths to run middleware on
export const config = {
  matcher: ['/org/:path*', '/', '/board/:path*', '/api/:path*'], // You can add more paths here if needed
};
