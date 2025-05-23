import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Note from './noteModel.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/notesdb');

// Create
app.post('/notes', async (req, res) => {
  const { title, description, tags } = req.body;
  const note = new Note({ title, description, tags });
  await note.save();
  res.json(note);
});

// Read
app.get('/notes', async (req, res) => {
  const { tag } = req.query;
  const notes = tag
    ? await Note.find({ tags: tag })
    : await Note.find();
  res.json(notes);
});

// Delete
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));
