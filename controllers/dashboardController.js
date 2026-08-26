// controllers/dashboardController.js
// CONTROLLER: Renders the Dashboard overview with aggregate metrics and recent activities

const LoanModel = require('../models/loanModel');
const BookModel = require('../models/bookModel');

const DashboardController = {
  index: (req, res) => {
    LoanModel.getDashboardStats((err, stats) => {
      if (err) {
        return res.status(500).send('Database error: ' + err.message);
      }
      BookModel.getAll(null, null, (err, books) => {
        const lowStockBooks = (books || []).filter(b => b.available_copies <= 1);
        res.render('dashboard', {
          title: 'Library Dashboard',
          activeTab: 'dashboard',
          stats,
          lowStockBooks
        });
      });
    });
  }
};

module.exports = DashboardController;
