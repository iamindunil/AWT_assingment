import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authentication.js';

const prisma = new PrismaClient();
const router = express.Router();

// Get shipping info for a specific email
router.get('/:email', /*authenticateToken,*/ async (req, res) => {
  console.debug("shipping info route hit");
  const { email } = req.params;
  try {
    const shipping = await prisma.shipping.findUnique({ where: { email } });
    if (!shipping) return res.status(404).json({ error: 'Shipping info not found' });
    res.json(shipping);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new shipping entry
router.post('/', /*authenticateToken,*/ async (req, res) => {
  const { email, address, postalcode, country } = req.body;
  try {
    const shipping = await prisma.shipping.create({
      data: { email, address, postalcode, country },
    });
    res.status(201).json({ message: 'Shipping info added', shipping });
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Shipping info for this email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Update existing shipping info
router.put('/', /*authenticateToken,*/ async (req, res) => {
  const { email, address, postalcode, country } = req.body;
  try {
    const updated = await prisma.shipping.update({
      where: { email },
      data: { address, postalcode, country },
    });
    res.json({ message: 'Shipping info updated', shipping: updated });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Shipping info not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Delete shipping info by email
router.delete('/:email', /*authenticateToken,*/ async (req, res) => {
  const { email } = req.params;
  try {
    await prisma.shipping.delete({ where: { email } });
    res.json({ message: 'Shipping info deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Shipping info not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default router;
