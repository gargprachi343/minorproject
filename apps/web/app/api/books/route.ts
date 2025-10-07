import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await dbConnect()

        const books = await Book.find({})

        return NextResponse.json({
            success: true,
            data: books,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching books.',
            },
            { status: 500 }
        )
    }
}
