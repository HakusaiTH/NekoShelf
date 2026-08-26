// models/userModel.js
// User Model for Authentication and Role Management

const db = require('../config/db');
const bcrypt = require('bcryptjs');

const UserModel = {
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      callback(err, row);
    });
  },

  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      callback(err, row);
    });
  },

  findById: (id, callback) => {
    const sql = 'SELECT id, username, email, role, name, created_at FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  createUser: (userData, callback) => {
    const { username, email, password, role, name } = userData;
    const userRole = role === 'admin' ? 'admin' : 'user';
    const hash = bcrypt.hashSync(password, 10);

    const sql = `
      INSERT INTO users (username, email, password, role, name)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [username, email, hash, userRole, name || username], function (err) {
      callback(err, this ? this.lastID : null);
    });
  },

  comparePassword: (candidatePassword, hash) => {
    return bcrypt.compareSync(candidatePassword, hash);
  }
};

module.exports = UserModel;
