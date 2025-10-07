import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@workspace/database/connection'
import User from '@workspace/database/models/user.model'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        // Parse request body
        const body = await request.json()
        const { studentId, name, email, password } = body

        // Validate required fields
        if (!studentId || !name || !email || !password) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            )
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Check if user already exists by email or studentId
        const existingUser = await User.findOne({
            $or: [{ email }, { studentId }],
        })

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { message: 'Email already registered' },
                    { status: 409 }
                )
            }
            if (existingUser.studentId === studentId) {
                return NextResponse.json(
                    { message: 'Student ID already registered' },
                    { status: 409 }
                )
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        // Create new user
        const newUser = await User.create({
            studentId,
            name,
            email,
            passwordHash,
            role: 'student', // Default role
            wishlist: [],
            completedBooks: [],
        })

        // Return success response (exclude password hash)
        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful',
                data: {
                    id: newUser._id,
                    studentId: newUser.studentId,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error in /api/auth/register:', error)
        return NextResponse.json(
            { message: 'An error occurred during registration' },
            { status: 500 }
        )
    }
}
