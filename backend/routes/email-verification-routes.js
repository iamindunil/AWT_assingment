import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendVerificationCode } from '../utils/mailer.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get verification code for a specific email
router.get('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const verification = await prisma.email_verifications.findUnique({
      where: { email }
    });
    if (!verification) return res.status(404).json({ error: 'Code not found' });
    res.json(verification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or update verification code
router.post('/', async (req, res) => {
  const { email } = req.body;
  const code = String(Math.floor(100000 + Math.random() * 900000));

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Create or update the verification code in the database
    const upsert = await prisma.email_verifications.upsert({
      where: { email },
      update: { code },
      create: { email, code },
    });

    // Send the verification code to the user's email
    await sendVerificationCode(email, code);

    // Respond to the client
    res.status(201).json({ message: 'Code set and sent', data: upsert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/verify', async (req, res) => {
  const { email, code } = req.body;
  try {
    const verification = await prisma.email_verifications.findUnique({ where: { email } });
    
    // Check if the verification record exists
    if (!verification) {
      return res.status(404).json({ error: 'Code not found' });
    }

    // Check if the code matches
    if (verification.code !== code) {
      return res.status(400).json({ error: 'Invalid code' });
    }

    // Delete the code after successful verification
    await prisma.email_verifications.delete({ where: { email } });

    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Delete verification code for email
router.delete('/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await prisma.email_verifications.delete({ where: { email } });
    res.json({ message: 'Code deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Code not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default router;
