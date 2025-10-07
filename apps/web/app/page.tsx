'use client'

import { Button } from '@workspace/ui/components/button'
import { BookOpen, Users, BookMarked, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'>
      {/* Hero Section */}
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='text-center max-w-4xl'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-primary text-primary-foreground rounded-3xl mb-8 shadow-xl'>
            <BookOpen className='w-10 h-10' />
          </div>

          <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6'>
            Library Management System
          </h1>

          <p className='text-xl text-muted-foreground mb-12 max-w-2xl mx-auto'>
            A comprehensive solution for managing your library&apos;s books,
            members, loans, and more.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
            <Link href='/login'>
              <Button size='lg' className='text-base px-8'>
                Get Started
              </Button>
            </Link>
            <Link href='/dashboard'>
              <Button size='lg' variant='outline' className='text-base px-8'>
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-16'>
            <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4'>
                <BookMarked className='w-6 h-6' />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                Book Management
              </h3>
              <p className='text-muted-foreground text-sm'>
                Organize and track your entire book collection with ease
              </p>
            </div>

            <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4'>
                <Users className='w-6 h-6' />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                Member Management
              </h3>
              <p className='text-muted-foreground text-sm'>
                Manage library members and their borrowing history
              </p>
            </div>

            <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4'>
                <BarChart className='w-6 h-6' />
              </div>
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                Analytics & Reports
              </h3>
              <p className='text-muted-foreground text-sm'>
                Get insights into library usage and trends
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
