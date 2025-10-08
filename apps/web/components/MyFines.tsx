'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { IFine } from '@workspace/database/models/fine.model'
import { AlertCircle, IndianRupee } from 'lucide-react'

interface FineWithId extends IFine {
  _id: string
  createdAt: Date
}

interface MyFinesProps {
  fines: FineWithId[]
}

export default function MyFines({ fines }: MyFinesProps) {
  if (fines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IndianRupee className='w-5 h-5' />
            Pending Fines
          </CardTitle>
          <CardDescription>
            You have no pending fines. Great job!
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalAmount = fines.reduce((sum, fine) => sum + fine.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <AlertCircle className='w-5 h-5 text-destructive' />
          Pending Fines
        </CardTitle>
        <CardDescription>
          You have {fines.length} pending fine
          {fines.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {fines.map((fine) => (
            <div
              key={fine._id.toString()}
              className='flex justify-between items-start p-3 border border-border rounded-lg bg-muted/50'
            >
              <div className='flex-1'>
                <p className='font-medium text-foreground'>{fine.reason}</p>
                <p className='text-sm text-muted-foreground mt-1'>
                  {new Date(fine.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-lg font-bold text-destructive'>
                  ₹{fine.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <div className='pt-4 border-t border-border'>
            <div className='flex justify-between items-center'>
              <p className='text-lg font-semibold'>Total Amount Due</p>
              <p className='text-2xl font-bold text-destructive'>
                ₹{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
