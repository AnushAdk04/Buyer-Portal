const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { Resend } = require('resend');
const { findByEmail, createUser, findById } = require('../models/userModel');

const resend = new Resend(process.env.RESEND_API_KEY);

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await findByEmail(email);
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, passwordHash, 'buyer');
    const user = await findById(userId);

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await findByEmail(email);
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await findByEmail(email);
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour

    await db.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetTokenHash, resetExpires, user.id]
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: 'BuyerPortal <noreply@anushadhikari.com.np>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">BuyerPortal Password Reset</h1>
          <p>You requested a password reset. Please click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await db.query(
      'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2',
      [resetTokenHash, Date.now()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const userId = result.rows[0].id;
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [passwordHash, userId]
    );

    res.json({ message: 'Password has been successfully reset. You can now login.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };