import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    try {
        // Get the cookie store
        const cookieStore = await cookies()

        // Delete the authentication token cookie
        cookieStore.delete('token')

        return NextResponse.json({
            success: true,
            message: 'Logout successful',
        })
    } catch (error) {
        console.error('Error in /api/auth/logout:', error)
        return NextResponse.json(
            { message: 'An error occurred during logout' },
            { status: 500 }
        )
    }
}

// Also support GET method for logout links
export async function GET() {
    return POST()
}
