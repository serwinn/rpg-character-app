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
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const prisma = req.app.locals.prisma;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
      to: user.email,
      subject: 'Reset hasła - RPG Character Sheet',
      html: `
        <p>Otrzymaliśmy prośbę o reset hasła dla twojego konta.</p>
        <p>Kliknij poniższy link, aby zresetować hasło:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link wygaśnie za godzinę.</p>
        <p>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość.</p>
      `
    });
    
    res.json({ message: 'Reset password instructions sent to email' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
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
      return res.status(400).json({ message: 'Invalid or expired reset token' });
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
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const prisma = req.app.locals.prisma;
  
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Validate role
    if (role !== 'PLAYER' && role !== 'GM') {
      return res.status(400).json({ message: 'Invalid role. Must be PLAYER or GM' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return user info and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
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