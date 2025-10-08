import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables')
    }
    return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const token = request.cookies.get('token')?.value

    const isPublicPath =
        pathname === '/login' || pathname === '/register' || pathname === '/'

    // If the user has a token and is on a public page, redirect to dashboard
    if (token && isPublicPath) {
        try {
            await jwtVerify(token, getJwtSecretKey())
            return NextResponse.redirect(new URL('/dashboard', request.url))
        } catch {
            // If token is invalid, let them stay but clear the bad cookie
            const response = NextResponse.next()
            response.cookies.delete('token')
            return response
        }
    }

    // If the user has no token and is trying to access a protected page, redirect to login
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If the user has a token but it's invalid, redirect to login
    if (token && !isPublicPath) {
        try {
            await jwtVerify(token, getJwtSecretKey())
        } catch {
            const response = NextResponse.redirect(
                new URL('/login', request.url)
            )
            response.cookies.delete('token')
            return response
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
