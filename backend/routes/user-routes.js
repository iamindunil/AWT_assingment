import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authentication.js';
import { sendVerificationCode } from '../utils/mailer.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all users
router.get('/', /*authenticateToken,*/ async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        phone_number: true,
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single user by email
router.get('/:email', /*authenticateToken,*/ async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        phone_number: true,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user details (excluding password)
router.put('/', /*authenticateToken,*/ async (req, res) => {
  const { email, name, phone_number, password } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        phone_number,
        password, // optionally hash this before saving
      },
    });
    res.json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Create new user - now sends verification code first
router.post('/', async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists', success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
      },
    });

    // Generate a 6-digit verification code
    const code = String(Math.floor(100000 + Math.random() * 900000));
    
    // Store the verification code
    await prisma.email_verifications.create({
      data: {
        email,
        code,
      },
    });
    
    try {
      // Send verification email
      await sendVerificationCode(email, code);
      
      res.status(201).json({ 
        message: 'User registered. Please verify your email to complete registration.', 
        email,
        success: true 
      });
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // User is created but email failed - still return success but with a different message
      res.status(201).json({ 
        message: 'Account created but there was an issue sending the verification email. Please request a new code.', 
        email,
        success: true,
        emailSent: false
      });
    }
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists', success: false });
    } else {
      console.error('Registration error:', err);
      res.status(500).json({ error: err.message, success: false });
    }
  }
});

// Delete user by email
router.delete('/:email', /*authenticateToken,*/ async (req, res) => {
  const { email } = req.params;
  try {
    await prisma.user.delete({
      where: { email },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default router;
