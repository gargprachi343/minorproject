'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Book {
  _id: string
  title: string
  author: string[]
  coverImage: string
  genre: string[]
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'RESERVED'
  type: 'PHYSICAL' | 'DIGITAL'
}

export default function WishlistPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [removingBook, setRemovingBook] = useState<string | null>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/user/wishlist')
        if (response.ok) {
          const result = await response.json()
          setBooks(result.data || [])
        } else if (response.status === 401) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        toast.error('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [router])

  const handleRemoveFromWishlist = async (bookId: string) => {
    setRemovingBook(bookId)
    try {
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.action === 'removed') {
          toast.success('Book removed from wishlist')
          // Remove book from state
          setBooks((prev) => prev.filter((book) => book._id !== bookId))
        }
      } else {
        toast.error('Failed to remove book from wishlist')
      }
    } catch (error) {
      console.error('Error removing book:', error)
      toast.error('An error occurred')
    } finally {
      setRemovingBook(null)
    }
  }

  const getStatusVariant = (
    bookStatus: string
  ): 'default' | 'secondary' | 'destructive' => {
    switch (bookStatus) {
      case 'AVAILABLE':
        return 'default'
      case 'RESERVED':
        return 'secondary'
      case 'CHECKED_OUT':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-xl'>
              <Heart className='w-5 h-5' />
            </div>
            <h1 className='text-xl font-bold text-foreground'>My Wishlist</h1>
          </div>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading your wishlist...</p>
          </div>
        ) : books.length === 0 ? (
          <div className='text-center py-12'>
            <Heart className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
            <h2 className='text-2xl font-semibold mb-2'>
              Your wishlist is empty
            </h2>
            <p className='text-muted-foreground mb-6'>
              Start adding books you want to read!
            </p>
            <Button onClick={() => router.push('/books')}>
              Browse Catalog
            </Button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className='mb-6'>
              <p className='text-sm text-muted-foreground'>
                {books.length} {books.length === 1 ? 'book' : 'books'} in your
                wishlist
              </p>
            </div>

            {/* Books Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {books.map((book) => (
                <Card
                  key={book._id}
                  className='overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col'
                >
                  <Link href={`/books/${book._id}`}>
                    <div className='relative aspect-[2/3] bg-muted'>
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw'
                      />
                    </div>
                  </Link>
                  <CardContent className='p-4 flex flex-col flex-grow'>
                    <Link
                      href={`/books/${book._id}`}
                      className='flex flex-col flex-grow'
                    >
                      <h3 className='font-semibold text-base mb-1 line-clamp-2 hover:text-primary transition-colors'>
                        {book.title}
                      </h3>
                      <p className='text-sm text-muted-foreground mb-2 line-clamp-1'>
                        {book.author.join(', ')}
                      </p>
                    </Link>

                    <div className='flex items-center justify-between mb-3'>
                      <Badge variant={getStatusVariant(book.status)}>
                        {book.status}
                      </Badge>
                      <Badge variant='outline'>{book.type}</Badge>
                    </div>

                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleRemoveFromWishlist(book._id)}
                      disabled={removingBook === book._id}
                      className='w-full'
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      {removingBook === book._id ? 'Removing...' : 'Remove'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
