import express from 'express';
import Todo from '../models/Todo.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = 'your_secret_key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// Get user's todos
router.get('/', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.userId });
  res.json(todos);
});

// Create a todo
router.post('/', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const todo = await Todo.create({ title, userId: req.user.userId });
  res.status(201).json(todo);
});

// Update a todo
router.put('/:id', authMiddleware, async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );
  res.json(todo);
});

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
  res.json({ success: true });
});

export default router;
