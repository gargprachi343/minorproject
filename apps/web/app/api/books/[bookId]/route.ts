import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
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

        return NextResponse.json({
            success: true,
            data: book,
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
