// models/loanModel.js
// MODEL: Manages 'loans' transactions, borrowing/returning, and library stats

const db = require('../config/db');
const BookModel = require('./bookModel');

const LoanModel = {
  getAll: (statusFilter, callback) => {
    if (typeof statusFilter === 'function') {
      callback = statusFilter;
      statusFilter = null;
    }

    let sql = `
      SELECT l.*, 
             b.title AS book_title, b.cover_image,
             m.name AS member_name, m.member_code, m.email AS member_email
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      WHERE 1=1
    `;
    const params = [];

    if (statusFilter) {
      sql += ` AND l.status = ?`;
      params.push(statusFilter);
    }

    sql += ` ORDER BY l.id DESC`;

    db.all(sql, params, callback);
  },

  getById: (id, callback) => {
    const sql = `
      SELECT l.*, 
             b.title AS book_title, 
             m.name AS member_name, m.member_code
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      WHERE l.id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Issue loan (Transaction: Insert loan & Decrement book available_copies)
  createLoan: (bookId, memberId, dueDays = 14, callback) => {
    // Calculate due date
    const today = new Date();
    const dueDateObj = new Date(today);
    dueDateObj.setDate(dueDateObj.getDate() + parseInt(dueDays));
    const dueDateStr = dueDateObj.toISOString().split('T')[0];
    const borrowDateStr = today.toISOString().split('T')[0];

    // First check if book has available copies
    BookModel.getById(bookId, (err, book) => {
      if (err) return callback(err);
      if (!book) return callback(new Error('Book not found'));
      if (book.available_copies <= 0) return callback(new Error('No copies available for loan'));

      db.run(
        `INSERT INTO loans (book_id, member_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?, 'borrowed')`,
        [bookId, memberId, borrowDateStr, dueDateStr],
        function (err) {
          if (err) return callback(err);
          const loanId = this.lastID;
          // Decrement available copies
          BookModel.adjustAvailableCopies(bookId, -1, (err) => {
            if (err) return callback(err);
            callback(null, loanId);
          });
        }
      );
    });
  },

  // Return book (Transaction: Update return_date & status, Increment available_copies)
  returnBook: (loanId, callback) => {
    LoanModel.getById(loanId, (err, loan) => {
      if (err) return callback(err);
      if (!loan) return callback(new Error('Loan record not found'));
      if (loan.status === 'returned') return callback(new Error('Book has already been returned'));

      const returnDateStr = new Date().toISOString().split('T')[0];
      db.run(
        `UPDATE loans SET return_date = ?, status = 'returned' WHERE id = ?`,
        [returnDateStr, loanId],
        (err) => {
          if (err) return callback(err);
          // Increment available copies
          BookModel.adjustAvailableCopies(loan.book_id, 1, callback);
        }
      );
    });
  },

  // Get aggregated stats for the dashboard
  getDashboardStats: (callback) => {
    const today = new Date().toISOString().split('T')[0];

    // First update any 'borrowed' loans past due date to 'overdue' status
    db.run(
      `UPDATE loans SET status = 'overdue' WHERE status = 'borrowed' AND due_date < ?`,
      [today],
      (err) => {
        if (err) console.error('Error updating overdue status:', err.message);

        // Fetch counts
        const stats = {};

        db.get('SELECT COUNT(*) AS count FROM books', [], (err, r) => {
          stats.totalBooks = (r && r.count) || 0;

          db.get('SELECT SUM(total_copies) AS total, SUM(available_copies) AS avail FROM books', [], (err, r) => {
            stats.totalCopies = (r && r.total) || 0;
            stats.availableCopies = (r && r.avail) || 0;

            db.get('SELECT COUNT(*) AS count FROM authors', [], (err, r) => {
              stats.totalAuthors = (r && r.count) || 0;

              db.get('SELECT COUNT(*) AS count FROM members', [], (err, r) => {
                stats.totalMembers = (r && r.count) || 0;

                db.get("SELECT COUNT(*) AS count FROM loans WHERE status = 'borrowed'", [], (err, r) => {
                  stats.activeLoans = (r && r.count) || 0;

                  db.get("SELECT COUNT(*) AS count FROM loans WHERE status = 'overdue'", [], (err, r) => {
                    stats.overdueLoans = (r && r.count) || 0;

                    // Recent loans
                    LoanModel.getAll(null, (err, recentLoans) => {
                      stats.recentLoans = (recentLoans || []).slice(0, 5);
                      callback(null, stats);
                    });
                  });
                });
              });
            });
          });
        });
      }
    );
  }
};

module.exports = LoanModel;
