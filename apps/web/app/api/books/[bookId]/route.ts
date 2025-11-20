import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
import Loan from '@workspace/database/models/loan.model'
import User from '@workspace/database/models/user.model'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        await dbConnect()

        const { bookId } = await params

        // Find the book by ID
        const book = await Book.findById(bookId)

        if (!book) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Book not found',
                },
                { status: 404 }
            )
        }

        let currentLoan = null
        if (book.status !== 'AVAILABLE' && book.type === 'PHYSICAL') {
            const loan = await Loan.findOne({
                bookId: book._id,
                status: { $in: ['ACTIVE', 'RESERVED', 'OVERDUE'] }
            }).populate('userId', 'name')
            
            if (loan) {
                currentLoan = {
                    borrowerName: (loan.userId as any).name,
                    dueDate: loan.dueDate,
                    status: loan.status
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                ...book.toObject(),
                currentLoan
            },
        })
    } catch (error) {
        console.error('Error fetching book:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching the book.',
            },
            { status: 500 }
        )
    }
}
