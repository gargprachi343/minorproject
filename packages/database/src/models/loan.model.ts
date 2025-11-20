import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ILoan extends Document {
    bookId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    checkoutDate: Date
    dueDate: Date
    returnDate?: Date
    status: 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'RESERVED'
}

const loanSchema: Schema<ILoan> = new Schema(
    {
        bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        checkoutDate: { type: Date, required: true, default: Date.now },
        dueDate: { type: Date, required: true },
        returnDate: { type: Date },
        status: {
            type: String,
            enum: ['ACTIVE', 'RETURNED', 'OVERDUE', 'RESERVED'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Loan: Model<ILoan> =
    mongoose.models.Loan || mongoose.model<ILoan>('Loan', loanSchema)

export default Loan
