import mongoose, { Schema, Document, models, Model } from 'mongoose'

export interface IBook extends Document {
    title: string
    author: string[]
    isbn?: string // Optional, as some items might not have one
    summary: string
    coverImage: string
    genre: string[]
    publicationYear: number
    type: 'PHYSICAL' | 'DIGITAL'

    // Fields for PHYSICAL books
    rfidTag?: string
    location?: string
    status: 'AVAILABLE' | 'CHECKED_OUT' | 'RESERVED'

    // Fields for DIGITAL books
    fileUrl?: string // google drive link
    format?: string // e.g., PDF, EPUB

    // Embedded ratings
    ratings?: {
        userId: mongoose.Types.ObjectId
        rating: number
        review?: string
    }[]
}

const bookSchema: Schema<IBook> = new Schema(
    {
        title: { type: String, required: true, index: true },
        author: [{ type: String, required: true }],
        isbn: { type: String, unique: true, sparse: true }, // unique but allows multiple nulls
        summary: { type: String, required: true },
        coverImage: { type: String, required: true },
        genre: [{ type: String, required: true }],
        publicationYear: { type: Number, required: true },
        type: { type: String, enum: ['PHYSICAL', 'DIGITAL'], required: true },

        rfidTag: { type: String },
        location: { type: String },
        status: {
            type: String,
            enum: ['AVAILABLE', 'CHECKED_OUT', 'RESERVED'],
            default: 'AVAILABLE',
        },

        fileUrl: { type: String },
        format: { type: String },

        ratings: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating: { type: Number, required: true, min: 1, max: 5 },
                review: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Book: Model<IBook> =
    models.Book || mongoose.model<IBook>('Book', bookSchema)

export default Book
