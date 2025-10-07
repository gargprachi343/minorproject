import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@workspace/database/connection'
import Loan from '@workspace/database/models/loan.model'

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

        // Get loanId from request body
        const body = await request.json()
        const { loanId } = body

        if (!loanId) {
            return NextResponse.json(
                { message: 'Loan ID is required' },
                { status: 400 }
            )
        }

        // Find the loan
        const loan = await Loan.findById(loanId)

        if (!loan) {
            return NextResponse.json(
                { message: 'Loan not found' },
                { status: 404 }
            )
        }

        // Verify the loan belongs to this user
        if (loan.userId.toString() !== decoded.id) {
            return NextResponse.json(
                { message: 'Unauthorized to renew this loan' },
                { status: 403 }
            )
        }

        // Check if loan is overdue
        if (loan.status === 'OVERDUE') {
            return NextResponse.json(
                {
                    message:
                        'Cannot renew overdue loans. Please return the book or pay fines first.',
                },
                { status: 400 }
            )
        }

        // Check if loan is already returned
        if (loan.status === 'RETURNED') {
            return NextResponse.json(
                { message: 'This loan has already been returned' },
                { status: 400 }
            )
        }

        // Extend the due date by 14 days (2 weeks)
        const renewalPeriod = 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
        const newDueDate = new Date(loan.dueDate.getTime() + renewalPeriod)

        loan.dueDate = newDueDate
        await loan.save()

        return NextResponse.json({
            success: true,
            message: 'Loan renewed successfully',
            data: {
                newDueDate: newDueDate,
                loan: loan,
            },
        })
    } catch (error) {
        console.error('Error in /api/loans/renew:', error)

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
            { message: 'An error occurred while renewing the loan' },
            { status: 500 }
        )
    }
}
