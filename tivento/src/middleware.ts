import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/events(.*)',
  '/event/(.*)',
  '/groups(.*)',
  '/categories(.*)',
  '/api/webhooks/(.*)',
  '/api/clerk/(.*)',
  '/favicon.ico',
  '/manifest.json',
  '/_next/(.*)',
  '/static/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Allow public routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // Protect private routes
    const { userId } = await auth();
    if (!userId) {
      // Redirect to sign-in for protected routes
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of errors, allow the request to proceed
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};