import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@workspace/database/connection'
import User from '@workspace/database/models/user.model'

interface JWTPayload {
    id: string
    studentId: string
    name: string
    email: string
}

export async function GET() {
    try {
        // Get the token from cookies
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            )
        }

        // Verify JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables'
            )
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload

        // Connect to database
        await dbConnect()

        // Fetch the user from database (optional - for fresh data)
        const user = await User.findById(decoded.id).select('-passwordHash')

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        // Return user data
        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                studentId: user.studentId,
                name: user.name,
                email: user.email,
                role: user.role,
                wishlist: user.wishlist,
                completedBooks: user.completedBooks,
            },
        })
    } catch (error) {
        console.error('Error in /api/auth/me:', error)

        // Handle JWT errors specifically
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 401 }
            )
        }

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json(
                { message: 'Token expired' },
                { status: 401 }
            )
        }

        return NextResponse.json(
            { message: 'An error occurred while fetching user data' },
            { status: 500 }
        )
    }
}
