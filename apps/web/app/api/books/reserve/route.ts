import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
import Loan from '@workspace/database/models/loan.model'

interface JWTPayload {
    id: string
    studentId: string
    name: string
    email: string
}

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated' },
                { status: 401 }
            )
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined')
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
        await dbConnect()

        const body = await request.json()
        const { bookId, duration } = body

        if (!bookId) {
            return NextResponse.json(
                { message: 'Book ID is required' },
                { status: 400 }
            )
        }

        const book = await Book.findById(bookId)
        if (!book) {
            return NextResponse.json(
                { message: 'Book not found' },
                { status: 404 }
            )
        }

        let days = parseInt(duration)
        if (isNaN(days) || days < 1) {
             days = 14 // Default
        }

        if (book.type === 'PHYSICAL') {
            if (book.status !== 'AVAILABLE') {
                return NextResponse.json(
                    { message: 'Book is not available for reservation' },
                    { status: 400 }
                )
            }
            
            if (days > 14) {
                return NextResponse.json(
                    { message: 'Physical books can only be reserved for up to 14 days' },
                    { status: 400 }
                )
            }
        } else {
            // Digital Book Logic
            // Check if user already has this book
            const existingLoan = await Loan.findOne({
                bookId: book._id,
                userId: decoded.id,
                status: { $in: ['ACTIVE', 'RESERVED'] }
            })

            if (existingLoan) {
                return NextResponse.json(
                    { message: 'You already have this book in your library' },
                    { status: 400 }
                )
            }
            // Digital books can be reserved for any duration (as per prompt)
        }

        const reservationDate = new Date()
        const dueDate = new Date(reservationDate.getTime() + days * 24 * 60 * 60 * 1000)

        const loan = new Loan({
            bookId: book._id,
            userId: decoded.id,
            checkoutDate: reservationDate,
            dueDate: dueDate,
            status: book.type === 'DIGITAL' ? 'ACTIVE' : 'RESERVED'
        })

        await loan.save()

        // Update book status only for PHYSICAL books
        if (book.type === 'PHYSICAL') {
            book.status = 'RESERVED'
            await book.save()
        }

        return NextResponse.json({
            message: 'Book reserved successfully',
            data: loan
        })

    } catch (error) {
        console.error('Error reserving book:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
