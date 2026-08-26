// controllers/authController.js
// Authentication Controller for Login, Registration, and Session Logout

const UserModel = require('../models/userModel');

const authController = {
  showLogin: (req, res) => {
    if (req.session && req.session.user) {
      return res.redirect('/');
    }
    res.render('auth/login', {
      title: 'Sign In',
      error: req.query.error || null,
      success: req.query.success || null,
      formData: {}
    });
  },

  processLogin: (req, res) => {
    const { loginKey, password } = req.body;
    if (!loginKey || !password) {
      return res.render('auth/login', {
        title: 'Sign In',
        error: 'Please fill in all fields.',
        success: null,
        formData: { loginKey }
      });
    }

    // Try finding by username first, then by email
    UserModel.findByUsername(loginKey, (err, user) => {
      if (err) {
        return res.render('auth/login', {
          title: 'Sign In',
          error: 'Database error occurred.',
          success: null,
          formData: { loginKey }
        });
      }

      if (!user) {
        // Try finding by email
        return UserModel.findByEmail(loginKey, (err2, userByEmail) => {
          if (err2 || !userByEmail) {
            return res.render('auth/login', {
              title: 'Sign In',
              error: 'Invalid username/email or password.',
              success: null,
              formData: { loginKey }
            });
          }

          // Verify password
          if (!UserModel.comparePassword(password, userByEmail.password)) {
            return res.render('auth/login', {
              title: 'Sign In',
              error: 'Invalid username/email or password.',
              success: null,
              formData: { loginKey }
            });
          }

          // Successful login
          req.session.user = {
            id: userByEmail.id,
            username: userByEmail.username,
            email: userByEmail.email,
            role: userByEmail.role,
            name: userByEmail.name
          };

          return res.redirect('/');
        });
      }

      // Verify password
      if (!UserModel.comparePassword(password, user.password)) {
        return res.render('auth/login', {
          title: 'Sign In',
          error: 'Invalid username/email or password.',
          success: null,
          formData: { loginKey }
        });
      }

      // Successful login
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name
      };

      return res.redirect('/');
    });
  },

  showRegister: (req, res) => {
    if (req.session && req.session.user) {
      return res.redirect('/');
    }
    res.render('auth/register', {
      title: 'Sign Up / Register',
      error: null,
      formData: {}
    });
  },

  processRegister: (req, res) => {
    const { name, username, email, password, confirmPassword, role } = req.body;

    if (!username || !email || !password) {
      return res.render('auth/register', {
        title: 'Sign Up / Register',
        error: 'Please fill in all required fields.',
        formData: { name, username, email, role }
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', {
        title: 'Sign Up / Register',
        error: 'Passwords do not match.',
        formData: { name, username, email, role }
      });
    }

    UserModel.findByUsername(username, (err, existingUser) => {
      if (existingUser) {
        return res.render('auth/register', {
          title: 'Sign Up / Register',
          error: 'Username is already taken.',
          formData: { name, username, email, role }
        });
      }

      UserModel.findByEmail(email, (err2, existingEmail) => {
        if (existingEmail) {
          return res.render('auth/register', {
            title: 'Sign Up / Register',
            error: 'Email address is already registered.',
            formData: { name, username, email, role }
          });
        }

        UserModel.createUser({ name, username, email, password, role }, (err3, newUserId) => {
          if (err3) {
            return res.render('auth/register', {
              title: 'Sign Up / Register',
              error: 'Failed to create account.',
              formData: { name, username, email, role }
            });
          }

          return res.redirect('/auth/login?success=' + encodeURIComponent('Account created successfully! Please sign in.'));
        });
      });
    });
  },

  logout: (req, res) => {
    if (req.session) {
      req.session.destroy(() => {
        res.redirect('/auth/login');
      });
    } else {
      res.redirect('/auth/login');
    }
  }
};

module.exports = authController;
