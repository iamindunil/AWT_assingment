import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authentication.js';

const prisma = new PrismaClient();
const router = express.Router();


// Get checkout history for a specific email
router.get('/:email', /*authenticateToken,*/ async (req, res) => {
  const { email } = req.params;
  try {
    const history = await prisma.checkout_history.findMany({
      where: { email },
      orderBy: { checkout_date_and_time: 'desc' },
    });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert new checkout entry
router.post('/', /*authenticateToken,*/ async (req, res) => {
  const { email, book_isbn, total_price, qty, checkout_date_and_time } = req.body;
  try {
    const newEntry = await prisma.checkout_history.create({
      data: {
        email,
        book_isbn,
        total_price,
        qty,
        checkout_date_and_time: new Date(checkout_date_and_time),
      },
    });
    res.status(201).json({ message: 'Checkout recorded', data: newEntry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
