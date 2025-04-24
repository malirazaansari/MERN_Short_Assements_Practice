import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
});

module.exports = mongoose.model('Task', taskSchema);
