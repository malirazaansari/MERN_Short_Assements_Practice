// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', tags: '' });
  const [filterTag, setFilterTag] = useState('');

  const fetchNotes = async () => {
    const res = await axios.get('http://localhost:5000/notes', {
      params: { tag: filterTag }
    });
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, [filterTag]);

  const createNote = async () => {
    const tags = form.tags.split(',').map(t => t.trim());
    await axios.post('http://localhost:5000/notes', { ...form, tags });
    setForm({ title: '', description: '', tags: '' });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:5000/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="mx-auto p-4 max-w-xl">
      <h1 className="mb-4 font-bold text-2xl">Notes App</h1>

      <input value={form.title} placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input value={form.description} placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input value={form.tags} placeholder="Tags (comma-separated)" onChange={e => setForm({ ...form, tags: e.target.value })} />
      <button onClick={createNote}>Add Note</button>

      <input className="mt-4" placeholder="Filter by tag" onChange={e => setFilterTag(e.target.value)} />

      <ul className="mt-4">
        {notes.map(note => (
          <li key={note._id} className="my-2 p-2 border">
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <small>Tags: {note.tags.join(', ')}</small>
            <br />
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
