'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { ILoan } from '@workspace/database/models/loan.model'
import { IBook } from '@workspace/database/models/book.model'
import { Calendar, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

interface PopulatedLoan extends Omit<ILoan, 'bookId'> {
  _id: string
  bookId: IBook
}

interface MyLoansTableProps {
  loans: PopulatedLoan[]
  onRenew?: (loanId: string) => void
  onRenewSuccess?: () => void
}

export default function MyLoansTable({
  loans,
  onRenewSuccess,
}: MyLoansTableProps) {
  const [renewingLoan, setRenewingLoan] = useState<string | null>(null)

  if (loans.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <p>You have no active loans.</p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleRenew = async (loanId: string) => {
    if (renewingLoan) return

    setRenewingLoan(loanId)
    try {
      const response = await fetch('/api/loans/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loanId }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        // Refresh the loans list
        if (onRenewSuccess) {
          onRenewSuccess()
        }
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to renew loan')
      }
    } catch (error) {
      console.error('Error renewing loan:', error)
      toast.error('An error occurred while renewing the loan')
    } finally {
      setRenewingLoan(null)
    }
  }

  return (
    <div className='rounded-lg border border-border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Checkout Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan._id.toString()}>
              <TableCell className='font-medium'>{loan.bookId.title}</TableCell>
              <TableCell>{loan.bookId.author.join(', ')}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-muted-foreground' />
                  {formatDate(loan.checkoutDate)}
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4 text-muted-foreground' />
                  {formatDate(loan.dueDate)}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    loan.status === 'OVERDUE' ? 'destructive' : 'default'
                  }
                >
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleRenew(loan._id)}
                  disabled={
                    loan.status === 'OVERDUE' || renewingLoan === loan._id
                  }
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  {renewingLoan === loan._id ? 'Renewing...' : 'Renew'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
