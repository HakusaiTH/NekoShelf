# MVC Exercise: Book Library

A minimal full-stack exercise demonstrating the **MVC pattern** with a
**relational database**, built with Node.js.

## Stack
- **Model** — `models/bookModel.js` (queries a SQLite relational database)
- **View** — `views/*.ejs` (EJS templates rendered as HTML)
- **Controller** — `controllers/bookController.js` (handles requests, talks to the model, picks a view)
- **Database** — SQLite (file-based relational database, `database/library.db`, auto-created on first run)

## Project structure
```
mvc-book-library/
├── app.js                     # entry point, wires everything together
├── config/
│   └── db.js                  # DB connection + table creation
├── models/
│   └── bookModel.js           # all SQL queries live here (Model)
├── controllers/
│   └── bookController.js      # request handling logic (Controller)
├── routes/
│   └── bookRoutes.js          # URL -> controller mapping
├── views/
│   ├── index.ejs              # list books (View)
│   ├── add.ejs                # add book form (View)
│   └── edit.ejs                # edit book form (View)
├── public/css/style.css       # styling
└── database/schema.sql        # reference schema
```

## How to run in VS Code

1. **Open the folder** `mvc-book-library` in VS Code.
2. **Open a terminal** in VS Code: `Terminal → New Terminal`.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the server**:
   ```bash
   npm start
   ```
5. Open your browser at **http://localhost:3000**

The SQLite database file (`database/library.db`) is created automatically
the first time you run the app — no separate database server needed.

## What the app does

A simple CRUD (Create, Read, Update, Delete) app for managing a list of books:

- `GET /` — list all books (Model reads from DB → Controller → index.ejs View)
- `GET /books/add` — show a form to add a book
- `POST /books` — create a new book (Controller validates, Model inserts into DB)
- `GET /books/:id/edit` — show a pre-filled edit form
- `PUT /books/:id` — update a book
- `DELETE /books/:id` — delete a book

## MVC flow (example: adding a book)

1. User submits the "Add Book" **form** (View) → `POST /books`
2. **Route** (`routes/bookRoutes.js`) maps this to `BookController.create`
3. **Controller** validates input and calls `BookModel.create(...)`
4. **Model** runs an `INSERT INTO books ...` SQL statement against SQLite
5. Controller redirects back to `/`, which re-renders the **View** with the updated list

## Suggested extensions (for practicing further)

- Add a second table, e.g. `authors`, with a foreign key from `books.author_id`
  — practice a real relational **join**.
- Add server-side validation with error messages shown in the view.
- Add search/filter (`GET /?q=...`) using a `WHERE title LIKE ?` query.
- Swap SQLite for MySQL/PostgreSQL to practice connecting to a real DB server.
- Add a `PATCH` route to mark a book as "read"/"unread" (add a `is_read` column).
