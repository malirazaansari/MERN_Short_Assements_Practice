import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import contactRoutes from './routes/contacts.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/contactdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/contacts', contactRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
