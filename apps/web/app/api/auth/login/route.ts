import dbConnect from '@workspace/database/connection'
import User from '@workspace/database/models/user.model'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    try {
        await dbConnect()

        const { studentId, password } = await request.json()

        if (!studentId || !password) {
            return NextResponse.json(
                {
                    message: 'Student ID and password are required.',
                },
                { status: 400 }
            )
        }

        const user = await User.findOne({ studentId })

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials.' },
                { status: 401 }
            )
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash)

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials.' },
                { status: 401 }
            )
        }

        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            throw new Error(
                'JWT_SECRET is not defined in environment variables'
            )
        }

        // Create JWT token with user data
        const tokenData = {
            id: String(user._id),
            studentId: user.studentId,
            name: user.name,
            email: user.email,
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1d', // Token expires in 1 day
        })

        // Set the token in an HttpOnly cookie for security
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV !== 'development', // Use HTTPS in production
            maxAge: 60 * 60 * 24, // 1 day in seconds
            path: '/', // Cookie is valid for entire site
            sameSite: 'lax', // Provides CSRF protection
        })

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                userId: user._id,
                name: user.name,
                email: user.email,
                studentId: user.studentId,
            },
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                message: 'An error occurred during login.',
            },
            { status: 500 }
        )
    }
}
