import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'admin_session';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin route
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
        const session = request.cookies.get(ADMIN_COOKIE_NAME);

        if (session?.value !== 'authenticated') {
            const loginUrl = new URL('/admin-login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect from login page if already authenticated
    if (pathname === '/admin-login') {
        const session = request.cookies.get(ADMIN_COOKIE_NAME);

        if (session?.value === 'authenticated') {
            const adminUrl = new URL('/admin', request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/admin-login'],
};
