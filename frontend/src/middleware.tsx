import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const cookies = request.cookies
    const sessionCookie = cookies.get('JSESSIONID');
    console.log('the damn cookie is', sessionCookie);

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/meals',],
};
