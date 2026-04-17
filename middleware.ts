export { auth as middleware } from '@/auth';

export const config = {
  // Protect all routes under /dashboard
  matcher: ['/dashboard/:path*'],
};
