// lib/clerk.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export const clerk = clerkMiddleware;

// Clerk configuration for Vercel deployment
export const clerkConfig = {
  // Enable debugging in development
  debug: process.env.NODE_ENV === 'development',
  
  // Domain configuration for production
  ...(process.env.VERCEL_URL && {
    frontendApi: `https://${process.env.VERCEL_URL}`,
  }),
  
  // Sign in/up URL configuration
  signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
  signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
  afterSignInUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/',
  afterSignUpUrl: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/',
};

// Helper function to check if Clerk is properly configured
export const isClerkConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY
  );
};

// Helper to get the current domain for Clerk
export const getClerkDomain = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  return window?.location?.origin || '';
};
