import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath =
        path === '/login' || path === '/register' || path === '/'

    // Define paths that require authentication
    const isProtectedPath =
        path.startsWith('/dashboard') || path.startsWith('/api/dashboard')

    // Get the token from cookies
    const token = request.cookies.get('token')?.value || ''

    // If user is on a public path and has a token, redirect to dashboard
    if (isPublicPath && token && path !== '/') {
        try {
            // Verify token is valid
            if (process.env.JWT_SECRET) {
                jwt.verify(token, process.env.JWT_SECRET)
                // Token is valid, redirect to dashboard
                return NextResponse.redirect(
                    new URL('/dashboard', request.nextUrl)
                )
            }
        } catch {
            // Invalid token, clear it and let them access public path
            const response = NextResponse.next()
            response.cookies.delete('token')
            return response
        }
    }

    // If user is trying to access a protected path without a token, redirect to login
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

    // If user has a token and is accessing a protected path, verify the token
    if (isProtectedPath && token) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined')
            }
            // Verify the token is valid
            jwt.verify(token, process.env.JWT_SECRET)
            // Token is valid, allow access
            return NextResponse.next()
        } catch {
            // Invalid token, clear it and redirect to login
            const response = NextResponse.redirect(
                new URL('/login', request.nextUrl)
            )
            response.cookies.delete('token')
            return response
        }
    }

    // For all other cases, allow the request to proceed
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
