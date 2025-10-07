'use client'

import { useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { BookOpen, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: formData.studentId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Registration successful! Please login.')
        router.push('/login')
      } else {
        toast.error(data.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-4'>
          <div className='flex justify-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-xl'>
              <BookOpen className='w-8 h-8' />
            </div>
          </div>
          <div className='space-y-2 text-center'>
            <CardTitle className='text-2xl'>Create an Account</CardTitle>
            <CardDescription>
              Register to access the library system
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='studentId'>Student ID</Label>
              <Input
                id='studentId'
                name='studentId'
                placeholder='Enter your student ID'
                value={formData.studentId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Enter your full name'
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Create a password'
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </Button>

            <div className='text-center text-sm text-muted-foreground'>
              Already have an account?{' '}
              <Link href='/login' className='text-primary hover:underline'>
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
