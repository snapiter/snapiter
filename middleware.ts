import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  // Check if the user is accessing protected dashboard routes, except for auth and api
  if (
    pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/dashboard/auth') &&
    !pathname.startsWith('/dashboard/api')
  ) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/dashboard/auth', request.url));
    }
  }
  

  // Extract hostname from various possible sources
  // Scaleway serverless containers + Traefik/Caddy compatible
  const hostname =
    request.headers.get('x-forwarded-host') ||     // Reverse proxy header
    request.headers.get('x-real-ip') ||            // Some proxies use this
    request.headers.get('host') ||                 // Standard header
    request.nextUrl.hostname ||                    // Next.js parsed hostname
    'localhost';                                   // Fallback

  // Remove port if present (e.g., localhost:3000 → localhost)
  const cleanHostname = hostname.split(':')[0];


  // 🔑 If on app.snapiter.com and not already under /dashboard → redirect
  if (cleanHostname === 'app.snapiter.com' && !pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }


  // Add hostname to response headers so it can be accessed in components/API routes
  const response = NextResponse.next();
  response.headers.set('x-hostname', cleanHostname);

  // Optional: Add to cookies for client-side access
  response.cookies.set('hostname', cleanHostname, {
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax'
  });

  return response;
}

export const config = {
  matcher: [
    /**
     * Match all paths except:
     * - api routes
     * - Next.js internals (_next/static, _next/image)
     * - favicon
     * - static assets (common extensions like svg, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
