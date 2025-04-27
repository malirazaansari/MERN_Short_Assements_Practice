import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = await Contact.create({ name, email, phone });
  res.status(201).json(contact);
});

router.delete('/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
