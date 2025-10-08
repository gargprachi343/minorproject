import { NextResponse } from 'next/server'
import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
import User from '@workspace/database/models/user.model'
import Loan from '@workspace/database/models/loan.model'
import Fine from '@workspace/database/models/fine.model'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error('JWT_SECRET is not defined')
    return new TextEncoder().encode(secret)
}

export async function GET() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            )
        }

        const { payload } = await jwtVerify(token, getJwtSecretKey())
        const userId = payload.id as string

        if (!userId) {
            console.error('No id in JWT payload:', payload)
            return NextResponse.json(
                { message: 'Invalid token payload' },
                { status: 401 }
            )
        }

        await dbConnect()

        const [
            user,
            activeLoans,
            pendingFines,
            totalBooksCount,
            totalMembersCount,
        ] = await Promise.all([
            User.findById(userId).select('name'),
            Loan.find({
                userId,
                status: { $in: ['ACTIVE', 'OVERDUE'] },
            }),
            Fine.find({ userId, status: 'PENDING' }),
            Book.countDocuments(),
            User.countDocuments(),
        ])

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        const responseData = {
            user,
            stats: {
                totalBooks: totalBooksCount,
                totalMembers: totalMembersCount,
                borrowedBooks: activeLoans.length,
                pendingFines: pendingFines.length,
            },
        }
        return NextResponse.json({ success: true, data: responseData })
    } catch (error) {
        console.error('Dashboard API Error:', error)
        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
        return NextResponse.json(
            {
                message: 'An error occurred',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
