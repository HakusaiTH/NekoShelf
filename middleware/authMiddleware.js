// middleware/authMiddleware.js
// Authentication & Role-Based Authorization Middleware

const attachUser = (req, res, next) => {
  res.locals.currentUser = req.session ? req.session.user : null;
  res.locals.isAdmin = req.session && req.session.user && req.session.user.role === 'admin';
  next();
};

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/auth/login?error=' + encodeURIComponent('Please sign in to access this page.'));
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).render('books/index', {
    books: [],
    categories: [],
    search: '',
    selectedCategory: '',
    title: '403 - Access Denied (Admin Only)',
    activeTab: '',
    error: 'Access Denied: Admin privileges required.'
  });
};

module.exports = {
  attachUser,
  isAuthenticated,
  isAdmin
};
