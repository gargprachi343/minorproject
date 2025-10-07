import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import {
    users,
    books,
    loans,
    fines,
    attendance,
    libraryStatus,
} from './seed-data.js'

import User from './models/user.model.js'
import Book from './models/book.model.js'
import Loan from './models/loan.model.js'
import Fine from './models/fine.model.js'
import Attendance from './models/attendance.model.js'
import LibraryStatus from './models/libraryStatus.model.js'

// Load environment variables from the root .env file
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in .env file')
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('MongoDB connected for seeding...')

        // Clear all existing data
        console.log('Clearing existing data...')
        await Fine.deleteMany({})
        await Loan.deleteMany({})
        await Book.deleteMany({})
        await User.deleteMany({})
        await Attendance.deleteMany({})
        await LibraryStatus.deleteMany({})

        // Insert new data
        console.log('Seeding new data...')

        // Hash passwords for all users before inserting
        console.log('Hashing user passwords...')
        const salt = await bcrypt.genSalt(10)
        const usersWithHashedPasswords = await Promise.all(
            users.map(async (user) => ({
                ...user,
                passwordHash: await bcrypt.hash('password123', salt), // Default password for all demo users
            }))
        )

        await User.insertMany(usersWithHashedPasswords)
        await Book.insertMany(books)
        await Loan.insertMany(loans)
        await Fine.insertMany(fines)
        await Attendance.insertMany(attendance)
        await LibraryStatus.create(libraryStatus) // Use .create for a single document

        console.log('Database has been successfully seeded! 🌱')
    } catch (error) {
        console.error('Error seeding database:', error)
    } finally {
        await mongoose.disconnect()
        console.log('MongoDB disconnected.')
    }
}

seedDatabase().then((_) => {
    console.log('Seeding process completed.')
})
