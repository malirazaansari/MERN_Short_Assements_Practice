// models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
});

module.exports = mongoose.model('Note', noteSchema);
