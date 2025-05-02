// routes/shoppingCart.js

import express from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
router.use(cookieParser());

const COOKIE_NAME = 'shopping_cart';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Get cart
router.get('/', (req, res) => {
  const cart = req.cookies[COOKIE_NAME];
  if (!cart) return res.json({ message: 'Cart is empty' });
  res.json(JSON.parse(cart));
});

// Add or update item in cart
router.post('/', (req, res) => {
  const { email, isbn, title, quantity, unit_price } = req.body;

  if (!email || !isbn || !title || !quantity || !unit_price) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  let cart = req.cookies[COOKIE_NAME] ? JSON.parse(req.cookies[COOKIE_NAME]) : {
    email,
    items: [],
    total: 0,
    number_of_books: 0
  };

  // If email mismatches existing cart, reject
  if (cart.email !== email) {
    return res.status(400).json({ error: 'Email mismatch with existing cart' });
  }

  // Check if item already exists
  const existingItem = cart.items.find(item => item.isbn === isbn);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ isbn, title, quantity, unit_price });
  }

  // Recalculate total and number_of_books
  cart.total = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  cart.number_of_books = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Set cookie
  res.cookie(COOKIE_NAME, JSON.stringify(cart), {
    maxAge: MAX_AGE,
    httpOnly: true, // Prevent client-side JS from modifying it
    sameSite: 'lax'
  });

  res.json({ message: 'Cart updated', cart });
});

// Clear cart
router.delete('/', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Cart cleared' });
});

export default router;
