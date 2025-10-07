import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
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

        // Get bookId from request body
        const body = await request.json()
        const { bookId } = body

        if (!bookId) {
            return NextResponse.json(
                { message: 'Book ID is required' },
                { status: 400 }
            )
        }

        // Find the user
        const user = await User.findById(decoded.id)

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        // Check if book is already in wishlist
        const bookIndex = user.wishlist.findIndex(
            (id) => id.toString() === bookId
        )

        let action: 'added' | 'removed'

        if (bookIndex > -1) {
            // Remove from wishlist
            user.wishlist.splice(bookIndex, 1)
            action = 'removed'
        } else {
            // Add to wishlist
            user.wishlist.push(bookId)
            action = 'added'
        }

        await user.save()

        return NextResponse.json({
            success: true,
            action,
            message:
                action === 'added'
                    ? 'Book added to wishlist'
                    : 'Book removed from wishlist',
            wishlist: user.wishlist,
        })
    } catch (error) {
        console.error('Error in /api/user/wishlist:', error)

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
            { message: 'An error occurred while updating wishlist' },
            { status: 500 }
        )
    }
}

// GET endpoint to fetch user's wishlist
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

        // Find the user and populate wishlist
        const user = await User.findById(decoded.id).populate('wishlist')

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: user.wishlist,
        })
    } catch (error) {
        console.error('Error in /api/user/wishlist:', error)

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
            { message: 'An error occurred while fetching wishlist' },
            { status: 500 }
        )
    }
}
