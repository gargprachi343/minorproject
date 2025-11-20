import Loan from '@workspace/database/models/loan.model'
import Fine from '@workspace/database/models/fine.model'

export async function calculateFines(userId: string) {
    const now = new Date()
    
    // Find overdue loans (ACTIVE, RESERVED, or OVERDUE) that are past due date
    const overdueLoans = await Loan.find({
        userId: userId,
        status: { $in: ['ACTIVE', 'RESERVED', 'OVERDUE'] },
        dueDate: { $lt: now }
    })

    for (const loan of overdueLoans) {
        // Calculate days overdue
        const diffTime = Math.abs(now.getTime() - loan.dueDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        const fineAmount = diffDays * 5

        // Check if fine exists
        let fine = await Fine.findOne({ loanId: loan._id })

        if (fine) {
            // If fine exists and is pending, update the amount
            if (fine.status === 'PENDING') {
                fine.amount = fineAmount
                fine.reason = `Overdue by ${diffDays} days`
                await fine.save()
            }
        } else {
            // Create new fine
            fine = new Fine({
                loanId: loan._id,
                userId: userId,
                amount: fineAmount,
                reason: `Overdue by ${diffDays} days`,
                status: 'PENDING'
            })
            await fine.save()
        }

        // Update loan status to OVERDUE if not already
        if (loan.status !== 'OVERDUE') {
            loan.status = 'OVERDUE'
            await loan.save()
        }
    }
}
