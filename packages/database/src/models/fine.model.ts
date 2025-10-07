import mongoose, { Schema, Document, models, Model } from 'mongoose'

export interface IFine extends Document {
    loanId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    amount: number
    reason: string
    status: 'PENDING' | 'PAID'
}

const fineSchema: Schema<IFine> = new Schema(
    {
        loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
    },
    {
        timestamps: true,
    }
)

const Fine: Model<IFine> =
    models.Fine || mongoose.model<IFine>('Fine', fineSchema)

export default Fine
