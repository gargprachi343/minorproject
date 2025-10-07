'use client'

import { Button } from '@workspace/ui/components/button'
import { BookOpen, Users, BookMarked, TrendingUp, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-xl'>
              <BookOpen className='w-5 h-5' />
            </div>
            <h1 className='text-xl font-bold text-foreground'>
              Library Management
            </h1>
          </div>
          <Button variant='outline' size='sm' onClick={handleLogout}>
            <LogOut className='w-4 h-4' />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-foreground mb-2'>
            Welcome to Your Dashboard
          </h2>
          <p className='text-muted-foreground'>
            Manage your library operations from here
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg'>
                <BookMarked className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>1,234</h3>
            <p className='text-muted-foreground text-sm'>Total Books</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg'>
                <Users className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>456</h3>
            <p className='text-muted-foreground text-sm'>Active Members</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg'>
                <BookOpen className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>89</h3>
            <p className='text-muted-foreground text-sm'>Books Borrowed</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg'>
                <TrendingUp className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>98%</h3>
            <p className='text-muted-foreground text-sm'>Return Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            Quick Actions
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Button variant='outline' className='h-auto py-4 flex-col gap-2'>
              <BookOpen className='w-6 h-6' />
              <span>Add New Book</span>
            </Button>
            <Button variant='outline' className='h-auto py-4 flex-col gap-2'>
              <Users className='w-6 h-6' />
              <span>Register Member</span>
            </Button>
            <Button variant='outline' className='h-auto py-4 flex-col gap-2'>
              <BookMarked className='w-6 h-6' />
              <span>Issue Book</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
