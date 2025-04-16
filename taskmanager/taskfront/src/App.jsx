import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;
    await axios.post('http://localhost:5000/tasks', { title });
    setTitle('');
    fetchTasks();
  };

  const completeTask = async (id) => {
    await axios.put(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="mx-auto p-4 max-w-md">
      <h1 className="mb-4 font-bold text-2xl">Task Manager</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="px-2 py-1 border w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task"
        />
        <button onClick={addTask} className="bg-blue-500 px-4 py-1 text-white">Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center mb-2">
            <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>{task.title}</span>
            <div className="flex gap-2">
              <button onClick={() => completeTask(task._id)} className="text-green-600">✔</button>
              <button onClick={() => deleteTask(task._id)} className="text-red-600">✖</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
