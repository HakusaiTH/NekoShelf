// app.js
// Entry point. Wires together Express, EJS view engine, session authentication, static files, middleware, and routes.

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const { attachUser } = require('./middleware/authMiddleware');

// Import Route Modules
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const memberRoutes = require('./routes/memberRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: 'mvc-book-library-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Attach User Context & Roles to res.locals for all EJS Views
app.use(attachUser);

// Register Relational & Auth Routes
app.use('/auth', authRoutes);
app.use('/', dashboardRoutes);
app.use('/books', bookRoutes);
app.use('/authors', authorRoutes);
app.use('/categories', categoryRoutes);
app.use('/members', memberRoutes);
app.use('/loans', loanRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).render('books/index', {
    books: [],
    categories: [],
    search: '',
    selectedCategory: '',
    title: '404 - Page Not Found',
    activeTab: ''
  });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`=================================================`);
    console.log(`Library Management System is running!`);
    console.log(`URL: http://localhost:${port}`);
    console.log(`=================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);
