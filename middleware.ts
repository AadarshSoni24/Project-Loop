import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js Middleware for Route Protection
 * Redirects unauthenticated users to /login for all protected routes.
 * API routes are excluded here since they handle auth internally via requireAuth().
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes: /login, /signup, /api/*, static assets, favicon
  // API routes have their own auth via requireAuth() — no need for double JWT checks
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/'
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api routes (handled by their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
