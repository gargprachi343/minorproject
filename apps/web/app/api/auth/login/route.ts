import { NextResponse } from 'next/server'
import connectToDB from '@workspace/database/connection'
import User from '@workspace/database/models/user.model'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables')
    }
    return new TextEncoder().encode(secret)
}

export async function POST(request: Request) {
    try {
        await connectToDB()
        const { email, password } = await request.json()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 400 }
            )
        }

        // const isPasswordCorrect = await bcrypt.compare(
        //     password,
        //     user.passwordHash
        // )
        // if (!isPasswordCorrect) {
        //     return NextResponse.json(
        //         { error: 'Invalid credentials' },
        //         { status: 400 }
        //     )
        // }

        const token = await new SignJWT({ 
            id: String(user._id), 
            studentId: user.studentId,
            name: user.name,
            email: user.email,
            role: user.role 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1h')
            .sign(getJwtSecretKey())

        const response = NextResponse.json({ message: 'Login successful' })
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            path: '/',
        })

        return response
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 }
        )
    }
}
