import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken } from '../middleware/authentication.js';

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

// Create new user
router.post('/', async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
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
