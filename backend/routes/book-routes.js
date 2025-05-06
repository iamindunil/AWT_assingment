import express from 'express';
import axios from 'axios';
import { authenticateToken } from '../middleware/authentication.js';

const router = express.Router();
const bookCache = new Map();

function derivePriceFromId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const min = 10;
    const max = 100;
    const price = Math.abs(hash) % (max - min + 1) + min;
    return price;
}

router.get('/', /*authenticateToken,*/ async (req, res) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=fiction&maxResults=40`);
  
      // Shuffle and pick 20 random items
      const shuffled = response.data.items.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 20);
  
      const books = selected.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || [],
        price: derivePriceFromId(item.id),
        description: item.volumeInfo.description || 'No description available.',
        thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
        stock: Math.floor(Math.random() * 20) + 1
      }));
  
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch random books' });
    }
  });
  

router.get('/search', /*authenticateToken,*/ async (req, res) => {
  const { q } = req.query;

  if (bookCache.has(q)) {
    return res.json(bookCache.get(q));
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
    const books = response.data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      price: derivePriceFromId(item.id),
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      stock: Math.floor(Math.random() * 20) + 1
    }));

    bookCache.set(q, books);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

router.get('/:id', /*authenticateToken,*/ async (req, res) => {
  const { id } = req.params;
  
  // Check cache first
  const cacheKey = `book-${id}`;
  if (bookCache.has(cacheKey)) {
    return res.json(bookCache.get(cacheKey));
  }
  
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
    
    // Format the book data
    const item = response.data;
    const book = {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      price: derivePriceFromId(item.id),
      description: item.volumeInfo.description || 'No description available.',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      stock: Math.floor(Math.random() * 20) + 1
    };
    
    // Cache the result
    bookCache.set(cacheKey, book);
    
    res.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).json({ error: 'Failed to fetch book details' });
  }
});

export default router;
