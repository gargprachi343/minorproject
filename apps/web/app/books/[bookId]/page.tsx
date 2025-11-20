'use client'

import { useState, useEffect } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  BookOpen,
  Heart,
  BookMarked,
  ArrowLeft,
  Calendar,
  User,
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'

interface Book {
  _id: string
  title: string
  author: string[]
  isbn?: string
  summary: string
  coverImage: string
  genre: string[]
  publicationYear: number
  type: 'PHYSICAL' | 'DIGITAL'
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'RESERVED'
  location?: string
  fileUrl?: string
  format?: string
  ratings?: Array<{
    userId: string
    rating: number
    review?: string
  }>
  currentLoan?: {
    borrowerName: string
    dueDate: string
    status: string
  }
}

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params?.bookId as string

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [reservationDays, setReservationDays] = useState(14)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${bookId}`)
        if (response.ok) {
          const data = await response.json()
          setBook(data.data)
        }
      } catch (error) {
        console.error('Error fetching book:', error)
      } finally {
        setLoading(false)
      }
    }

    const checkWishlist = async () => {
      try {
        const response = await fetch('/api/user/wishlist')
        if (response.ok) {
          const data = await response.json()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const inWishlist = data.data.some(
            (item: any) => item._id === bookId || item === bookId
          )
          setIsInWishlist(inWishlist)
        }
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    if (bookId) {
      fetchBook()
      checkWishlist()
    }
  }, [bookId])

  const handleWishlistToggle = async () => {
    if (wishlistLoading) return

    setWishlistLoading(true)
    try {
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.action === 'added')
        toast.success(data.message)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to update wishlist')
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      toast.error('An error occurred')
    } finally {
      setWishlistLoading(false)
    }
  }

  const handleReserveClick = () => {
    setShowReserveModal(true)
  }

  const confirmReserve = async () => {
    try {
      const response = await fetch('/api/books/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId, duration: reservationDays }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        // Update local book state
        if (book && book.type === 'PHYSICAL') {
          setBook({ ...book, status: 'RESERVED' })
        }
        setShowReserveModal(false)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to reserve book')
      }
    } catch (error) {
      console.error('Error reserving book:', error)
      toast.error('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading book details...</p>
      </div>
    )
  }

  if (!book) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground mb-4'>Book not found</p>
          <Button onClick={() => router.push('/books')}>Back to Catalog</Button>
        </div>
      </div>
    )
  }

  const averageRating =
    book.ratings && book.ratings.length > 0
      ? (
          book.ratings.reduce((sum, r) => sum + r.rating, 0) /
          book.ratings.length
        ).toFixed(1)
      : null

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4'>
          <Button variant='ghost' size='sm' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Book Cover */}
          <div className='lg:col-span-1'>
            <Card>
              <CardContent className='p-6'>
                <div className='aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-4 relative'>
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className='object-cover'
                  />
                </div>

                {/* Action Buttons */}
                <div className='space-y-3'>
                  <Button
                    className='w-full'
                    disabled={book.status !== 'AVAILABLE' && book.type === 'PHYSICAL'}
                    onClick={handleReserveClick}
                  >
                    <BookMarked className='w-4 h-4 mr-2' />
                    {book.type === 'PHYSICAL' 
                      ? (book.status === 'AVAILABLE' ? 'Reserve Book' : book.status === 'CHECKED_OUT' ? 'Checked Out' : 'Reserved')
                      : 'Get Digital Copy'}
                  </Button>

                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current text-red-500' : ''}`}
                    />
                    {wishlistLoading
                      ? 'Updating...'
                      : isInWishlist
                        ? 'Remove from Wishlist'
                        : 'Add to Wishlist'}
                  </Button>
                </div>

                {/* Current Loan Info */}
                {book.currentLoan && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border text-sm space-y-2">
                    <div className="font-medium flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Rented by: {book.currentLoan.borrowerName}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expected Release: {new Date(book.currentLoan.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Info Cards */}
                <div className='mt-6 space-y-3'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Badge>{book.type}</Badge>
                    <Badge
                      variant={
                        book.status === 'AVAILABLE' ? 'default' : 'destructive'
                      }
                    >
                      {book.status}
                    </Badge>
                  </div>

                  {book.isbn && (
                    <div className='text-sm text-muted-foreground'>
                      <strong>ISBN:</strong> {book.isbn}
                    </div>
                  )}

                  {book.location && (
                    <div className='text-sm text-muted-foreground'>
                      <strong>Location:</strong> {book.location}
                    </div>
                  )}

                  {averageRating && (
                    <div className='text-sm text-muted-foreground'>
                      <strong>Rating:</strong> {averageRating} / 5.0 (
                      {book.ratings?.length} reviews)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <div className='flex items-start gap-3'>
                  <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl'>
                    <BookOpen className='w-6 h-6' />
                  </div>
                  <div className='flex-1'>
                    <CardTitle className='text-3xl mb-2'>
                      {book.title}
                    </CardTitle>
                    <CardDescription className='text-base flex items-center gap-2'>
                      <User className='w-4 h-4' />
                      {book.author.join(', ')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Publication Info */}
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Calendar className='w-4 h-4' />
                  <span>Published: {book.publicationYear}</span>
                </div>

                {/* Genres */}
                <div>
                  <h3 className='font-semibold mb-2'>Genres</h3>
                  <div className='flex flex-wrap gap-2'>
                    {book.genre.map((g) => (
                      <Badge key={g} variant='secondary'>
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <h3 className='font-semibold mb-2'>Summary</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {book.summary}
                  </p>
                </div>

                {/* Digital Book Info */}
                {book.type === 'DIGITAL' && book.fileUrl && (
                  <div>
                    <h3 className='font-semibold mb-2'>Digital Access</h3>
                    <div className='flex items-center gap-4'>
                      <Badge variant='outline'>{book.format || 'PDF'}</Badge>
                      <Button
                        variant='link'
                        className='p-0'
                        onClick={() => window.open(book.fileUrl, '_blank')}
                      >
                        Access Digital Copy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                {book.ratings && book.ratings.length > 0 && (
                  <div>
                    <h3 className='font-semibold mb-4'>Reviews</h3>
                    <div className='space-y-4'>
                      {book.ratings.map(
                        (rating, index) =>
                          rating.review && (
                            <Card key={index}>
                              <CardContent className='p-4'>
                                <div className='flex items-center gap-2 mb-2'>
                                  <Badge>{rating.rating} / 5</Badge>
                                </div>
                                <p className='text-sm text-muted-foreground'>
                                  {rating.review}
                                </p>
                              </CardContent>
                            </Card>
                          )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      {showReserveModal && book && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Confirm Reservation</CardTitle>
              <CardDescription>
                {book.type === 'PHYSICAL' 
                  ? 'Select how long you want to reserve this book.' 
                  : 'Select how long you want access to this digital book.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max={book.type === 'PHYSICAL' ? "14" : "365"}
                  value={reservationDays}
                  onChange={(e) => setReservationDays(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  {book.type === 'PHYSICAL' 
                    ? 'Maximum 14 days. 5 Rs/day fine after due date.' 
                    : 'You can access this book for the selected duration.'}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowReserveModal(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmReserve}>
                  Confirm Reservation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
