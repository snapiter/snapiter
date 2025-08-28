import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};