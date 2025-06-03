import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { verifyToken } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const prisma = req.app.locals.prisma;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // For security, don't reveal if user exists
      return res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    
    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });
    
    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      from: `"RPG Character Sheet" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset hasła - RPG Character Sheet',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7f1d1d;">Reset hasła</h2>
          <p>Otrzymaliśmy prośbę o reset hasła dla twojego konta.</p>
          <p>Aby zresetować hasło, kliknij poniższy link:</p>
          <a href="${resetUrl}" style="display: inline-block; background: #7f1d1d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0;">
            Resetuj hasło
          </a>
          <p style="color: #666; font-size: 14px;">Link wygaśnie za godzinę.</p>
          <p style="color: #666; font-size: 14px;">Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
        </div>
      `
    });
    
    res.json({ message: 'If an account exists with this email, you will receive password reset instructions.' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas wysyłania instrukcji resetowania hasła.' });
  }
});

// Reset password with token
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const prisma = req.app.locals.prisma;
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Link do resetowania hasła jest nieprawidłowy lub wygasł.' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    
    res.json({ message: 'Hasło zostało pomyślnie zmienione.' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas resetowania hasła.' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const prisma = req.app.locals.prisma;
  
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  const prisma = req.app.locals.prisma;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
});

export default router;