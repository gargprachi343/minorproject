'use client'

import { useState, useEffect } from 'react'
import { Input } from '@workspace/ui/components/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Book {
  _id: string
  title: string
  author: string[]
  coverImage: string
  genre: string[]
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'RESERVED'
  type: 'PHYSICAL' | 'DIGITAL'
}

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '12',
        })

        if (search) params.append('search', search)
        if (genre !== 'all') params.append('genre', genre)
        if (status !== 'all') params.append('status', status)

        const response = await fetch(`/api/books?${params}`)
        if (response.ok) {
          const data = await response.json()
          setBooks(data.data || [])
          setTotalPages(data.pagination?.totalPages || 1)
          setTotalCount(data.pagination?.totalCount || 0)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchBooks()
    }, 300)

    return () => clearTimeout(debounce)
  }, [search, genre, status, page])

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
              <BookOpen className='w-5 h-5' />
            </div>
            <h1 className='text-xl font-bold text-foreground'>
              Library Catalog
            </h1>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        {/* Filters */}
        <div className='mb-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <Input
              placeholder='Search by title or author...'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className='pl-10'
            />
          </div>

          <Select
            value={genre}
            onValueChange={(value) => {
              setGenre(value)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Genre' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Genres</SelectItem>
              <SelectItem value='Fiction'>Fiction</SelectItem>
              <SelectItem value='Non-Fiction'>Non-Fiction</SelectItem>
              <SelectItem value='Science Fiction'>Science Fiction</SelectItem>
              <SelectItem value='Fantasy'>Fantasy</SelectItem>
              <SelectItem value='Mystery'>Mystery</SelectItem>
              <SelectItem value='Romance'>Romance</SelectItem>
              <SelectItem value='Thriller'>Thriller</SelectItem>
              <SelectItem value='Biography'>Biography</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='AVAILABLE'>Available</SelectItem>
              <SelectItem value='CHECKED_OUT'>Checked Out</SelectItem>
              <SelectItem value='RESERVED'>Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className='mb-4 text-muted-foreground'>
          Showing {books.length} of {totalCount} books
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className='text-center py-12 text-muted-foreground'>
            <p>Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            <p>No books found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
            {books.map((book) => (
              <Link
                key={book._id}
                href={`/books/${book._id}`}
                className='group'
              >
                <Card className='h-full transition-all hover:shadow-xl hover:-translate-y-1'>
                  <CardContent className='p-4'>
                    <div className='aspect-[2/3] mb-4 rounded-lg overflow-hidden bg-muted relative'>
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform'
                      />
                    </div>
                    <div className='space-y-2'>
                      <h3 className='font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors'>
                        {book.title}
                      </h3>
                      <p className='text-sm text-muted-foreground line-clamp-1'>
                        {book.author.join(', ')}
                      </p>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <Badge variant={getStatusVariant(book.status)}>
                          {book.status}
                        </Badge>
                        <Badge variant='outline'>{book.type}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-4'>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className='w-4 h-4 mr-2' />
              Previous
            </Button>
            <span className='text-sm text-muted-foreground'>
              Page {page} of {totalPages}
            </span>
            <Button
              variant='outline'
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
