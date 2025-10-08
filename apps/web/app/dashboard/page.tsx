'use client'

import { Button } from '@workspace/ui/components/button'
import {
  BookOpen,
  Users,
  BookMarked,
  TrendingUp,
  LogOut,
  AlertCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MyLoansTable from '@/components/MyLoansTable'
import MyFines from '@/components/MyFines'
import { toast } from 'sonner'

interface LibraryStatus {
  totalSeats: number
  occupiedSeats: number
  isOpen: boolean
}

interface User {
  name: string
}

interface Stats {
  totalBooks: number
  totalMembers: number
  borrowedBooks: number
  pendingFines: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loans, setLoans] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fines, setFines] = useState<any[]>([])
  const [libraryStatus, setLibraryStatus] = useState<LibraryStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch from the single dashboard endpoint first
      const dashboardRes = await fetch('/api/dashboard')
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json()
        setUser(dashboardData.data.user)
        setStats(dashboardData.data.stats)
      } else {
        throw new Error('Failed to fetch dashboard stats')
      }

      // Fetch loans, fines, and status in parallel
      const [loansRes, finesRes, statusRes] = await Promise.all([
        fetch('/api/loans/my-loans'),
        fetch('/api/fines/my-fines'),
        fetch('/api/library/status'),
      ])

      if (loansRes.ok) {
        const loansData = await loansRes.json()
        setLoans(loansData.data || [])
      }

      if (finesRes.ok) {
        const finesData = await finesRes.json()
        setFines(finesData.data || [])
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json()
        setLibraryStatus(statusData.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
          <div className='flex items-center gap-4'>
            {libraryStatus && (
              <div className='hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg'>
                <Users className='w-4 h-4' />
                <span>
                  Seats:{' '}
                  {libraryStatus.totalSeats - libraryStatus.occupiedSeats} /{' '}
                  {libraryStatus.totalSeats}
                </span>
              </div>
            )}
            <Button variant='outline' size='sm' onClick={handleLogout}>
              <LogOut className='w-4 h-4' />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-foreground mb-2'>
            Welcome back{user ? `, ${user.name}` : ''}!
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
            <h3 className='text-2xl font-bold text-foreground mb-1'>
              {stats?.totalBooks ?? 0}
            </h3>
            <p className='text-muted-foreground text-sm'>Total Books</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg'>
                <Users className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>
              {stats?.totalMembers ?? 0}
            </h3>
            <p className='text-muted-foreground text-sm'>Active Members</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg'>
                <BookOpen className='w-6 h-6' />
              </div>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>
              {stats?.borrowedBooks ?? 0}
            </h3>
            <p className='text-muted-foreground text-sm'>Books Borrowed</p>
          </div>

          <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg'>
                <BookMarked className='w-6 h-6' />
              </div>
            </div>
            <h3 className='text-2xl font-bold text-foreground mb-1'>
              {stats?.pendingFines ?? 0}
            </h3>
            <p className='text-muted-foreground text-sm'>Pending Fines</p>
          </div>
        </div>

        {/* Active Loans Section */}
        <div className='mb-8'>
          <h3 className='text-2xl font-bold text-foreground mb-4'>
            My Active Loans
          </h3>
          {loading ? (
            <div className='text-center py-8 text-muted-foreground'>
              <p>Loading your loans...</p>
            </div>
          ) : (
            <MyLoansTable loans={loans} onRenewSuccess={fetchData} />
          )}
        </div>

        {/* Pending Fines Section */}
        <div className='mb-8'>
          <h3 className='text-2xl font-bold text-foreground mb-4'>
            Fines & Payments
          </h3>
          {loading ? (
            <div className='text-center py-8 text-muted-foreground'>
              <p>Loading your fines...</p>
            </div>
          ) : (
            <MyFines fines={fines} />
          )}
        </div>

        {/* Quick Actions */}
        <div className='bg-card border border-border rounded-xl p-6 shadow-lg'>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            Quick Actions
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Button
              variant='outline'
              className='h-auto py-4 flex-col gap-2'
              onClick={() => router.push('/books')}
            >
              <BookOpen className='w-6 h-6' />
              <span>Browse Books</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto py-4 flex-col gap-2'
              onClick={() => router.push('/profile')}
            >
              <Users className='w-6 h-6' />
              <span>My Profile</span>
            </Button>
            <Button
              variant='outline'
              className='h-auto py-4 flex-col gap-2'
              onClick={() => router.push('/wishlist')}
            >
              <BookMarked className='w-6 h-6' />
              <span>My Wishlist</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
