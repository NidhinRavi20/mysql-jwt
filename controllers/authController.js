const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, age } = req.body;

  try {
    const [existingUser] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (name, email, password, age) VALUES (?, ?, ?, ?)', 
                     [name, email, hashedPassword, age]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, 'jwtsecretkey@123', { expiresIn: '1h' });

    res.json({ token, user: { name: user[0].name, email: user[0].email, age: user[0].age } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [user] = await db.execute('SELECT name, email, age FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit User Profile
exports.editUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, age } = req.body;

  try {
    await db.execute('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, userId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User Profile
exports.deleteUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
