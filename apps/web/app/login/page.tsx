'use client'

import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { useState } from 'react'
import { BookOpen, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = '/dashboard'
      } else {
        setError(data.error || 'Failed to login. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4'>
      <div className='w-full max-w-md'>
        {/* Logo and Title */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-2xl mb-4 shadow-lg'>
            <BookOpen className='w-8 h-8' />
          </div>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Library Management
          </h1>
          <p className='text-muted-foreground'>
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className='bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6'>
          <form onSubmit={handleLogin} className='space-y-5'>
            {/* Error Message */}
            {error && (
              <div className='flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg'>
                <AlertCircle className='w-4 h-4 flex-shrink-0' />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-foreground'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
                <Input
                  id='email'
                  placeholder='m@example.com'
                  required
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className='pl-10 h-11'
                  autoComplete='email'
                />
              </div>
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-foreground'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
                <Input
                  id='password'
                  required
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className='pl-10 h-11'
                  autoComplete='current-password'
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type='submit'
              className='w-full h-11 text-base font-medium'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className='text-center text-sm text-muted-foreground pt-4 border-t border-border'>
            <p>Need help? Contact your administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
