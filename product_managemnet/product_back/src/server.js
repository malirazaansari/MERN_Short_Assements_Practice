import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routers from './routes/product.js'; // Import your routes

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/product_management';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(express.json());


// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Product Management API!');
});

// Define routes for product management
app.use('/api/products', routers);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
