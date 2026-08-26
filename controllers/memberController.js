// controllers/memberController.js
// CONTROLLER: Manages Library Members CRUD and Member Loan History

const MemberModel = require('../models/memberModel');

const MemberController = {
  // GET /members
  index: (req, res) => {
    MemberModel.getAll((err, members) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.render('members/index', {
        members: members || [],
        title: 'Members Management',
        activeTab: 'members'
      });
    });
  },

  // GET /members/add
  showAddForm: (req, res) => {
    res.render('members/add', {
      title: 'Register New Member',
      activeTab: 'members',
      error: null,
      formData: {}
    });
  },

  // POST /members
  create: (req, res) => {
    const { member_code, name, email, phone } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).render('members/add', {
        title: 'Register New Member',
        activeTab: 'members',
        error: 'Member name is required.',
        formData: req.body || {}
      });
    }

    MemberModel.create(
      {
        member_code: member_code ? member_code.trim() : null,
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null
      },
      (err) => {
        if (err) {
          return res.status(400).render('members/add', {
            title: 'Register New Member',
            activeTab: 'members',
            error: err.message.includes('UNIQUE') ? 'Member Code already exists.' : ('Database error: ' + err.message),
            formData: req.body || {}
          });
        }
        res.redirect('/members');
      }
    );
  },

  // GET /members/:id/edit
  showEditForm: (req, res) => {
    const { id } = req.params;
    MemberModel.getById(id, (err, member) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      if (!member) return res.status(404).send('Member not found');
      res.render('members/edit', {
        member,
        title: 'Edit Member Details',
        activeTab: 'members',
        error: null
      });
    });
  },

  // PUT /members/:id
  update: (req, res) => {
    const { id } = req.params;
    const { member_code, name, email, phone } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).render('members/edit', {
        member: { id, member_code, name, email, phone },
        title: 'Edit Member Details',
        activeTab: 'members',
        error: 'Member name is required.'
      });
    }

    MemberModel.update(
      id,
      {
        member_code: member_code ? member_code.trim() : '',
        name: name.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null
      },
      (err) => {
        if (err) {
          return res.status(400).render('members/edit', {
            member: { id, member_code, name, email, phone },
            title: 'Edit Member Details',
            activeTab: 'members',
            error: 'Database error: ' + err.message
          });
        }
        res.redirect('/members');
      }
    );
  },

  // DELETE /members/:id
  destroy: (req, res) => {
    const { id } = req.params;
    MemberModel.delete(id, (err) => {
      if (err) return res.status(500).send('Database error: ' + err.message);
      res.redirect('/members');
    });
  }
};

module.exports = MemberController;
