import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Book from "./model/model.js";

const app = express();
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Bookstore API");
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, description, tags } = req.body;
    const newBook = new Book({ title, author, description, tags });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    console.error("Error creating book:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    await Book.findByIdAndDelete(bookId);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}   );
