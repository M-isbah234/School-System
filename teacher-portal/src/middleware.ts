import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();
  if (pathname.startsWith('/api/')) return NextResponse.next();
  if (pathname.startsWith('/_next')) return NextResponse.next();

  // For teacher portal, we just check if a name cookie exists
  const userName = request.cookies.get('user_name')?.value;
  if (!userName) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
