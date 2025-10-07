import dbConnect from '@workspace/database/connection'
import Book from '@workspace/database/models/book.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Get query parameters
        const searchParams = request.nextUrl.searchParams
        const search = searchParams.get('search')
        const genre = searchParams.get('genre')
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        // Build query object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}

        // Search filter - match title or author
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ]
        }

        // Genre filter
        if (genre) {
            query.genre = genre
        }

        // Status filter
        if (status) {
            query.status = status
        }

        // Calculate pagination
        const skip = (page - 1) * limit

        // Fetch books with filters and pagination
        const [books, totalCount] = await Promise.all([
            Book.find(query).skip(skip).limit(limit).sort({ title: 1 }),
            Book.countDocuments(query),
        ])

        return NextResponse.json({
            success: true,
            data: books,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            },
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
