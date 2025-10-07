import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILibraryStatus extends Document {
    totalSeats: number
    occupiedSeats: number
    isOpen: boolean
    lastResetAt: Date
}

const libraryStatusSchema: Schema<ILibraryStatus> = new Schema({
    totalSeats: { type: Number, required: true, default: 0 },
    occupiedSeats: { type: Number, required: true, default: 0 },
    isOpen: { type: Boolean, default: true },
    lastResetAt: { type: Date },
})

const LibraryStatus: Model<ILibraryStatus> =
    mongoose.models.LibraryStatus ||
    mongoose.model<ILibraryStatus>('LibraryStatus', libraryStatusSchema)

export default LibraryStatus
