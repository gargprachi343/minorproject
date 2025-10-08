'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { User, Mail, IdCard, Shield, BookMarked, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserData {
    id: string
    studentId: string
    name: string
    email: string
    role: 'student' | 'admin'
    wishlist: string[]
    completedBooks: string[]
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true)
            try {
                const response = await fetch('/api/auth/me')
                if (response.ok) {
                    const result = await response.json()
                    setUser(result.data)
                } else if (response.status === 401) {
                    router.push('/login')
                } else {
                    toast.error('Failed to load profile')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
                toast.error('An error occurred while loading profile')
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [router])

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            if (response.ok) {
                toast.success('Logged out successfully')
                router.push('/login')
            } else {
                toast.error('Failed to logout')
            }
        } catch (error) {
            console.error('Error during logout:', error)
            toast.error('An error occurred during logout')
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'>
            {/* Header */}
            <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
                <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                        <div className='inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-xl'>
                            <User className='w-5 h-5' />
                        </div>
                        <h1 className='text-xl font-bold text-foreground'>
                            My Profile
                        </h1>
                    </div>
                    <Button onClick={() => router.push('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className='container mx-auto px-4 py-8 max-w-4xl'>
                {loading ? (
                    <div className='text-center py-12'>
                        <p className='text-muted-foreground'>Loading your profile...</p>
                    </div>
                ) : user ? (
                    <div className='space-y-6'>
                        {/* Profile Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <User className='w-5 h-5' />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-start gap-3'>
                                    <User className='w-5 h-5 text-muted-foreground mt-0.5' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Name
                                        </p>
                                        <p className='text-base font-medium'>
                                            {user.name}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <IdCard className='w-5 h-5 text-muted-foreground mt-0.5' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Student ID
                                        </p>
                                        <p className='text-base font-medium'>
                                            {user.studentId}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <Mail className='w-5 h-5 text-muted-foreground mt-0.5' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Email
                                        </p>
                                        <p className='text-base font-medium'>
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-start gap-3'>
                                    <Shield className='w-5 h-5 text-muted-foreground mt-0.5' />
                                    <div>
                                        <p className='text-sm text-muted-foreground'>
                                            Role
                                        </p>
                                        <p className='text-base font-medium capitalize'>
                                            {user.role}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <BookMarked className='w-5 h-5' />
                                    Reading Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                    <div className='flex items-center gap-3 p-4 bg-muted rounded-lg'>
                                        <div className='inline-flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-xl'>
                                            <BookMarked className='w-6 h-6' />
                                        </div>
                                        <div>
                                            <p className='text-2xl font-bold'>
                                                {user.wishlist.length}
                                            </p>
                                            <p className='text-sm text-muted-foreground'>
                                                Books in Wishlist
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-3 p-4 bg-muted rounded-lg'>
                                        <div className='inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-xl'>
                                            <CheckCircle className='w-6 h-6' />
                                        </div>
                                        <div>
                                            <p className='text-2xl font-bold'>
                                                {user.completedBooks.length}
                                            </p>
                                            <p className='text-sm text-muted-foreground'>
                                                Books Completed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className='flex flex-col sm:flex-row gap-3'>
                                <Button
                                    onClick={() => router.push('/wishlist')}
                                    className='flex-1'
                                >
                                    <BookMarked className='w-4 h-4 mr-2' />
                                    View Wishlist
                                </Button>
                                <Button
                                    onClick={() => router.push('/books')}
                                    variant='outline'
                                    className='flex-1'
                                >
                                    Browse Books
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant='destructive'
                                    className='flex-1'
                                >
                                    Logout
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-muted-foreground'>
                            Failed to load profile data
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard')}
                            className='mt-4'
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                )}
            </main>
        </div>
    )
}
