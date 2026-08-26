// models/memberModel.js
// MODEL: Manages the 'members' table

const db = require('../config/db');

const MemberModel = {
  getAll: (callback) => {
    const sql = `
      SELECT m.*, 
             (SELECT COUNT(*) FROM loans l WHERE l.member_id = m.id AND l.status = 'borrowed') AS active_loans_count
      FROM members m
      ORDER BY m.id DESC
    `;
    db.all(sql, [], callback);
  },

  getById: (id, callback) => {
    db.get('SELECT * FROM members WHERE id = ?', [id], callback);
  },

  getMemberLoans: (memberId, callback) => {
    const sql = `
      SELECT l.*, b.title AS book_title, b.cover_image
      FROM loans l
      JOIN books b ON l.book_id = b.id
      WHERE l.member_id = ?
      ORDER BY l.id DESC
    `;
    db.all(sql, [memberId], callback);
  },

  create: (member, callback) => {
    const { member_code, name, email, phone } = member;
    const code = member_code || ('MEM-' + Math.floor(1000 + Math.random() * 9000));
    db.run(
      'INSERT INTO members (member_code, name, email, phone) VALUES (?, ?, ?, ?)',
      [code, name, email || null, phone || null],
      function (err) {
        callback(err, this ? this.lastID : null);
      }
    );
  },

  update: (id, member, callback) => {
    const { member_code, name, email, phone } = member;
    db.run(
      'UPDATE members SET member_code = ?, name = ?, email = ?, phone = ? WHERE id = ?',
      [member_code, name, email || null, phone || null, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.run('DELETE FROM members WHERE id = ?', [id], callback);
  }
};

module.exports = MemberModel;
