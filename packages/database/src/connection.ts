import mongoose from 'mongoose'
// import dotenv from 'dotenv'

// dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'URI NOT FOUND'

if (MONGODB_URI === 'URI NOT FOUND') {
    throw new Error(
        'Please define the MONGODB_URI variable inside .env file in the root of the project'
    )
}

let cached = (globalThis as any).mongoose

if (!cached) {
    cached = (globalThis as any).mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<mongoose.Connection> {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                return mongoose.connection
            })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect
