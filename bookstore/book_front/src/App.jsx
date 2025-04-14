import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ title: '', description: '', tags: '', author: '' });

    const [filteredBooks, setFilteredBooks] = useState([]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
        const filtered = books.filter((book) =>
          book.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredBooks(filtered);
      };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
      };

      const fetchBooks = async () => {
        try {
          const response = await fetch('http://localhost:5000/books', {
            params: { tag: filteredBooks }
          });
          const data = await response.json();
          setBooks(data);
        } catch (error) {
          console.error('Error fetching books:', error);
        }
      };

      useEffect(() => {
        fetchBooks();
      }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
              const response = await fetch('http://localhost:5000/books', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
              });
              const data = await response.json();
              setBooks([...books, data]);
              setForm({ title: '', description: '', tags: '', author: '' });
            } catch (error) {
                console.error('Error adding book:', error);
                }
            }

  return (
    <div className="space-y-10 bg-gray-50 mx-auto px-4 py-8 max-w-4xl min-h-screen">
    <h1 className="font-bold text-blue-600 text-4xl text-center">📚 Bookstore</h1>

    <input
      type="text"
      value={search}
      onChange={handleSearch}
      placeholder="Search books..."
      className="shadow-sm px-4 py-2 border border-gray-300 focus:border-blue-300 rounded-lg focus:ring-blue-300 w-full text-gray-800"
    />

<form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 border border-gray-200 rounded-lg">
  <h2 className="font-semibold text-gray-800 text-xl">Add a New Book</h2>

  <input
    type="text"
    name="title"
    value={form.title}
    onChange={handleChange}
    placeholder="Title"
    className="px-4 py-2 border border-gray-300 focus:border-blue-300 rounded-md focus:ring-blue-300 w-full text-gray-800"
  />
  <input
    type="text"
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Description"
    className="px-4 py-2 border border-gray-300 focus:border-blue-300 rounded-md focus:ring-blue-300 w-full text-gray-800"
  />
  <input
    type="text"
    name="tags"
    value={form.tags}
    onChange={handleChange}
    placeholder="Tags (comma-separated)"
    className="px-4 py-2 border border-gray-300 focus:border-blue-300 rounded-md focus:ring-blue-300 w-full text-gray-800"
  />
  <input
    type="text"
    name="author"
    value={form.author}
    onChange={handleChange}
    placeholder="Author"
    className="px-4 py-2 border border-gray-300 focus:border-blue-300 rounded-md focus:ring-blue-300 w-full text-gray-800"
  />

  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-400 py-2 rounded-lg w-full text-white transition"
  >
    Add Book
  </button>
</form>


    <div>
      <h2 className="font-semibold text-gray-800 text-2xl">Book List</h2>
      <ul className="space-y-4 mt-4">
        {(search ? filteredBooks : books).map((book) => (
          <li key={book._id} className="bg-white shadow-sm p-4 border border-gray-200 rounded-md">
            <h3 className="font-semibold text-blue-600 text-lg">{book.title}</h3>
            <p className="text-gray-700">{book.description}</p>
            <p className="text-gray-600 text-sm">Tags: {book.tags.join(', ')}</p>
            <p className="text-gray-600 text-sm">Author: {book.author}</p>
          </li>
        ))}
      </ul>
    </div>
  </div>


  )
}

export default App;
