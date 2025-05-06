// routes/billingInfo.js

import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());

const COOKIE_NAME = 'billing_info';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Get billing info
router.get('/', (req, res) => {
  console.debug("billing info route hit");
  const billing = req.cookies[COOKIE_NAME];
  if (!billing) {
    console.debug("No billing info saved");
    return res.json({ message: 'No billing info saved' });
  }
  console.debug("Billing info saved");
  res.json(JSON.parse(billing));
});

// Save billing info (masked + non-sensitive only)
router.post('/', (req, res) => {
  const {
    email,
    payment_method,
    card_number,
    exp_date
  } = req.body;

  if (!email || !payment_method || !card_number || !exp_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Mask card number
  const maskedCard = card_number.replace(/\d(?=\d{4})/g, '*');

  const billing = {
    email,
    payment_method,
    card_number: maskedCard,
    exp_date
  };

  res.cookie(COOKIE_NAME, JSON.stringify(billing), {
    maxAge: MAX_AGE,
    httpOnly: true,
    sameSite: 'lax'
  });

  res.json({ message: 'Billing info saved (masked)', billing });
});

// Clear billing info
router.delete('/', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Billing info cleared' });
});

export default router;
