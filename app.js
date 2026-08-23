// app.js
// Entry point. Wires together Express, the view engine, middleware, and routes.

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine (EJS is the "V" in MVC here)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // parse HTML form data
app.use(express.json());
app.use(methodOverride('_method'));               // allows <form> to send PUT/DELETE
app.use(express.static(path.join(__dirname, 'public'))); // CSS / static files

// Routes
app.use('/', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
