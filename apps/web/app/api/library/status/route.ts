import dbConnect from '@workspace/database/connection'
import LibraryStatus from '@workspace/database/models/libraryStatus.model'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await dbConnect()

        // Find the library status document (should be a singleton)
        let status = await LibraryStatus.findOne()

        // If no status exists, create a default one
        if (!status) {
            status = await LibraryStatus.create({
                totalSeats: 100,
                occupiedSeats: 0,
                isOpen: true,
                lastResetAt: new Date(),
            })
        }

        return NextResponse.json({
            success: true,
            data: status,
        })
    } catch (error) {
        console.error('Error fetching library status:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred while fetching library status.',
            },
            { status: 500 }
        )
    }
}
