import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  // No cookie at all → kick to landing page immediately
  if (!token?.value) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Only protect the dashboard (and any sub-paths)
export const config = {
  matcher: ['/dashboard/:path*'],
};
