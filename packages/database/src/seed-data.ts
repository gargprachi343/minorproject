import mongoose from 'mongoose'

// some generated object ids for users
const prachiId = new mongoose.Types.ObjectId()
const tithiID = new mongoose.Types.ObjectId()
const vrindaID = new mongoose.Types.ObjectId()

// some generated object ids for books
const duneId = new mongoose.Types.ObjectId()
const hobbitId = new mongoose.Types.ObjectId()
const cppId = new mongoose.Types.ObjectId()
const dsId = new mongoose.Types.ObjectId()
const nineteen84Id = new mongoose.Types.ObjectId()

// some generated object id for loans
const overdueLoanId = new mongoose.Types.ObjectId()

// 1. User Data ---
export const users = [
    {
        _id: prachiId,
        studentId: '00720815724',
        name: 'Prachi',
        email: 'prachi@example.com',
        passwordHash: 'placeholder_hash',
        wishlist: [cppId],
        completedBooks: [hobbitId],
    },
    {
        _id: tithiID,
        studentId: '00820815724',
        name: 'Tithi',
        email: 'tithi@example.com',
        passwordHash: 'placeholder_hash',
        wishlist: [],
        completedBooks: [],
    },
    {
        _id: vrindaID,
        studentId: '00920815724',
        name: 'Vrinda',
        email: 'vrinda@example.com',
        passwordHash: 'placeholder_hash',
        wishlist: [duneId, dsId],
        completedBooks: [],
    },
]

// 2. Book Data ---
export const books = [
    {
        _id: duneId,
        title: 'Dune',
        author: ['Frank Herbert'],
        summary:
            'Follows the adventures of Paul Atreides, heir to a noble family.',
        coverImage: '/covers/dune.jpg',
        genre: ['Science Fiction'],
        publicationYear: 1965,
        type: 'PHYSICAL',
        status: 'CHECKED_OUT', // Checked out by Vrinda
        ratings: [
            {
                userId: prachiId,
                rating: 5,
                review: 'A true classic, must-read!',
            },
        ],
    },
    {
        _id: hobbitId,
        title: 'The Hobbit',
        author: ['J.R.R. Tolkien'],
        summary:
            'The prelude to The Lord of the Rings, following Bilbo Baggins.',
        coverImage: '/covers/hobbit.jpg',
        genre: ['Fantasy'],
        publicationYear: 1937,
        type: 'PHYSICAL',
        status: 'AVAILABLE', // Returned by Prachi
    },
    {
        _id: cppId,
        title: 'C++ Primer',
        author: ['Stanley B. Lippman', 'Josée Lajoie'],
        summary:
            'The definitive guide to modern C++ for new and experienced programmers.',
        coverImage: '/covers/cpp.jpg',
        genre: ['Programming', 'Textbook'],
        publicationYear: 2012,
        type: 'DIGITAL',
        status: 'AVAILABLE',
        fileUrl: '/ebooks/cpp_primer.epub',
        format: 'EPUB',
    },
    {
        _id: dsId,
        title: 'Python for Data Analysis',
        author: ['Wes McKinney'],
        summary:
            'A practical guide to data manipulation with pandas, NumPy, and IPython.',
        coverImage: '/covers/data.jpg',
        genre: ['Data Science', 'Programming'],
        publicationYear: 2017,
        type: 'DIGITAL',
        status: 'AVAILABLE',
        fileUrl: '/ebooks/python_data.pdf',
        format: 'PDF',
    },
    {
        _id: nineteen84Id,
        title: '1984',
        author: ['George Orwell'],
        summary:
            'A dystopian novel set in Airstrip One, a province of the superstate Oceania.',
        coverImage: '/covers/1984.jpg',
        genre: ['Dystopian', 'Classic'],
        publicationYear: 1949,
        type: 'PHYSICAL',
        status: 'CHECKED_OUT', // Checked out by Tithi (and is overdue)
    },
]

// 3. Loan Data ---
export const loans = [
    {
        // Vrinda's active loan for Dune
        bookId: duneId,
        userId: vrindaID,
        checkoutDate: new Date('2025-10-01T10:00:00Z'),
        dueDate: new Date('2025-10-15T10:00:00Z'),
        status: 'ACTIVE',
    },
    {
        // Tithi's overdue loan for 1984
        _id: overdueLoanId,
        bookId: nineteen84Id,
        userId: tithiID,
        checkoutDate: new Date('2025-09-20T11:00:00Z'),
        dueDate: new Date('2025-10-04T11:00:00Z'),
        status: 'OVERDUE',
    },
    {
        // Prachi's completed loan for The Hobbit
        bookId: hobbitId,
        userId: prachiId,
        checkoutDate: new Date('2025-09-15T09:00:00Z'),
        dueDate: new Date('2025-09-29T09:00:00Z'),
        returnDate: new Date('2025-09-28T14:00:00Z'),
        status: 'RETURNED',
    },
]

// 4. Fine Data ---
export const fines = [
    {
        loanId: overdueLoanId,
        userId: tithiID,
        amount: 20.0, // e.g. 5 rupees per day for 4 days overdue
        reason: 'Overdue by 4 days',
        status: 'PENDING',
    },
]

// 5. Attendance Data ---
export const attendance = [
    {
        // Prachi is currently in the library
        userId: prachiId,
        entryTime: new Date('2025-10-08T09:00:00Z'),
    },
    {
        // Vrinda is currently in the library
        userId: vrindaID,
        entryTime: new Date('2025-10-08T09:15:00Z'),
    },
]

// 6. Library Status Data ---
export const libraryStatus = {
    totalSeats: 250,
    occupiedSeats: 2, // Matches the number of active attendance records
    isOpen: true,
}
