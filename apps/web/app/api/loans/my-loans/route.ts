import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@workspace/database/connection'
import Loan from '@workspace/database/models/loan.model'
import { calculateFines } from '@/lib/fines'

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

        // Calculate fines and update statuses
        await calculateFines(decoded.id)

        // Fetch active, overdue, and reserved loans for this user with populated book details
        const loans = await Loan.find({
            userId: decoded.id,
            status: { $in: ['ACTIVE', 'OVERDUE', 'RESERVED'] },
        })
            .populate('bookId')
            .sort({ dueDate: 1 }) // Sort by due date (earliest first)

        return NextResponse.json({
            success: true,
            data: loans,
        })
    } catch (error) {
        console.error('Error in /api/loans/my-loans:', error)

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
            { message: 'An error occurred while fetching loans' },
            { status: 500 }
        )
    }
}
