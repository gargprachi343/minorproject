import mongoose, { Schema, Document, models, Model } from 'mongoose'

// Interface to define the User document structure
export interface IUser extends Document {
    studentId: string
    name: string
    email: string
    passwordHash: string
    role: 'student' | 'admin'
    wishlist: mongoose.Types.ObjectId[]
    completedBooks: mongoose.Types.ObjectId[]
}

const userSchema: Schema<IUser> = new Schema(
    {
        studentId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['student', 'admin'], default: 'student' },
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
        completedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
)

const User: Model<IUser> =
    models.User || mongoose.model<IUser>('User', userSchema)

export default User
