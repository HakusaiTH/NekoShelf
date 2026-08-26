// controllers/loanController.js
// CONTROLLER: Manages book checkout (loans), returns, and status tracking

const LoanModel = require('../models/loanModel');
const BookModel = require('../models/bookModel');
const MemberModel = require('../models/memberModel');

const LoanController = {
  // GET /loans -> list loans with filter
  index: (req, res) => {
    const { status } = req.query;

    LoanModel.getAll(status, (err, loans) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('loans/index', {
        loans: loans || [],
        selectedStatus: status || '',
        title: 'Loans & Borrowings',
        activeTab: 'loans'
      });
    });
  },

  // GET /loans/add -> show checkout loan creation form
  showCreateForm: (req, res) => {
    BookModel.getAll(null, null, (err, books) => {
      const availableBooks = (books || []).filter(b => b.available_copies > 0);
      MemberModel.getAll((err, members) => {
        res.render('loans/create', {
          books: availableBooks,
          members: members || [],
          title: 'Issue New Loan (Book Checkout)',
          activeTab: 'loans',
          error: null
        });
      });
    });
  },

  // POST /loans -> issue a loan
  create: (req, res) => {
    const { book_id, member_id, due_days } = req.body || {};

    const renderWithForm = (errorMessage) => {
      BookModel.getAll(null, null, (err, books) => {
        const availableBooks = (books || []).filter(b => b.available_copies > 0);
        MemberModel.getAll((err, members) => {
          res.status(400).render('loans/create', {
            books: availableBooks,
            members: members || [],
            title: 'Issue New Loan (Book Checkout)',
            activeTab: 'loans',
            error: errorMessage
          });
        });
      });
    };

    if (!book_id || !member_id) {
      return renderWithForm('Please select both a book and a member.');
    }

    LoanModel.createLoan(book_id, member_id, due_days || 14, (err) => {
      if (err) return renderWithForm(err.message);
      res.redirect('/loans');
    });
  },

  // POST /loans/:id/return -> return a book
  returnBook: (req, res) => {
    const { id } = req.params;
    LoanModel.returnBook(id, (err) => {
      if (err) return res.status(500).send('Error processing return: ' + err.message);
      res.redirect('/loans');
    });
  }
};

module.exports = LoanController;
