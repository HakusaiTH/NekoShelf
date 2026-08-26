# 📚 MVC Book Library

A modern, full-featured **MVC Book Library Web Application** built with **Node.js, Express, EJS, SQLite, and Multer**.

This application follows the classic **Model-View-Controller (MVC)** architectural pattern and features a responsive design system, instant live search and filtering, book cover image upload, genre dropdown selection, and a full-screen detailed view modal.

---

## 👥 Team Work Breakdown

| Member | Assigned File / Area | Responsibilities | Git Branch |
| :--- | :--- | :--- | :--- |
| **Member 1 (Phoovadet)** | `views/index.ejs` | **Homepage & Catalog:** Dashboard stats, Grid/Table view, Live search, Full-Screen Detail Modal | `main` |
| **Member 2 (Namo)** | `views/add.ejs` | **Add Book Page:** Add form, Cover upload UI with preview, Genre dropdown, Validation alerts | `feature/add-book` |
| **Member 3 (Ammy)** | `views/edit.ejs` | **Edit Book Page:** Edit form, Cover update, Danger Zone delete modal | `feature/edit-book` |
| **Member 4 (Jerry)** | `views/partials/` | **Header & Footer:** Clean Navbar layout, Search UI, Footer component | `feature/layout-partials` |
| **Member 5 (Roger)** | `public/css/style.css` | **Design System & Styles:** CSS Variables, Cards, Dropzone upload box, Modal styling | `feature/theme-styles` |

---

## ✨ Key Features & Enhancements

### 🏷️ 1. Preset Genre Dropdown Selector
- Replaced plain text input fields with a structured `<select>` dropdown menu in both **Add Book** (`views/add.ejs`) and **Edit Book** (`views/edit.ejs`) forms.
- Predefined categories include: *Fiction, Non-Fiction, Technology, Classic, Dystopian, Fantasy, Sci-Fi, Mystery, Romance, Biography, History, and Other*.
- On book edit, the existing genre is automatically pre-selected.

### 🖼️ 2. Book Cover Image Uploads
- Integrated **Multer** middleware (`middleware/upload.js`) to handle image uploads (`multipart/form-data`).
- Includes a custom drag-and-drop file upload zone with **Live Image Preview** before saving.
- Supports JPEG, PNG, WEBP, and GIF formats up to **5MB**.
- Uploaded files are stored in `public/uploads/` with unique timestamped filenames.

### 🖥️ 3. Full-Screen Book Details Modal
- Clicking **"Detail"** opens a centered, responsive **Full-Screen Modal** (`94vw x 88vh`).
- Displays a high-resolution cover image card (or 3D fallback for books without images), record ID badge, book title, author, metadata stat boxes (Genre, Published Year, Added Date), full story description/summary, and quick action buttons.

### ⚠️ 4. Robust Form Validation & Error Alerts
- Replaced raw text 400 error pages with user-friendly red error alert banners on form pages.
- Preserves all typed form data when validation fails (e.g., missing Title or Author).
- Gracefully handles file upload validation errors without crashing Express.

### 🧹 5. Clean Header Design
- Simplified navigation bar header and page hero headers by removing decorative icons for a sleek, modern, typography-focused aesthetic.
- Fixed positioning so close buttons and action badges in modals never overlap.

---

## 🏗️ Architecture & MVC Breakdown

```
mvc-book-library/
├── config/
│   └── db.js            # SQLite connection, table init & dynamic schema migration
├── controllers/
│   └── bookController.js # Handles request logic, Multer upload parsing, EJS rendering
├── database/
│   ├── library.db       # SQLite database file
│   └── schema.sql       # SQL schema definition
├── middleware/
│   └── upload.js        # Multer diskStorage config & file filter middleware
├── models/
│   └── bookModel.js     # Interacts directly with SQLite database (CRUD queries)
├── public/
│   ├── css/
│   │   └── style.css    # Complete Design System & responsive CSS styling
│   └── uploads/         # Uploaded book cover images directory
├── routes/
│   └── bookRoutes.js    # Express route mappings with upload middleware
├── views/
│   ├── partials/
│   │   ├── header.ejs   # Shared Navigation Bar component
│   │   └── footer.ejs   # Shared Footer component
│   ├── add.ejs          # Add book form view with image preview & genre select
│   ├── edit.ejs         # Edit book form view with danger zone delete modal
│   └── index.ejs        # Main catalog dashboard (Grid View, Table View, Search & Modal)
├── app.js               # Application entry point wiring Express, EJS, and Routes
└── package.json         # Project metadata and dependencies
```

### 🔁 MVC Flow Overview:
1. **User Request**: User visits a route (e.g., `POST /books` or `GET /books/:id/json`).
2. **Routes (`routes/bookRoutes.js`)**: Passes request through `upload` middleware to parse multipart files.
3. **Controller (`controllers/bookController.js`)**: Validates input data, interacts with Model, and decides whether to redirect or render a View with data.
4. **Model (`models/bookModel.js`)**: Runs parameterized SQLite queries against `database/library.db`.
5. **View (`views/*.ejs`)**: EJS engine compiles dynamic HTML with CSS design system tokens from `public/css/style.css`.

---

## 🚀 How to Run the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```

### 3. Access in Browser
Open your browser at: **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ API & Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Renders main catalog page (Grid / Table view with search) |
| `GET` | `/books/add` | Renders Add Book form |
| `POST` | `/books` | Creates a new book (Supports `cover_image` upload) |
| `GET` | `/books/:id/json` | Returns JSON book details for the full-screen modal |
| `GET` | `/books/:id/edit` | Renders Edit Book form pre-filled with data |
| `PUT` | `/books/:id` | Updates existing book (Supports `cover_image` update) |
| `DELETE` | `/books/:id` | Deletes a book record from database |
