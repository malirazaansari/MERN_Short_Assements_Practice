import React, { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:5000/tasks`, {
      params: { status: filter === "all" ? undefined : filter },
    });
    setTasks(res.data);
  };

  const addTask = async () => {
    const res = await axios.post("http://localhost:5000/tasks", { title });
    setTitle("");
    setTasks([...tasks, res.data]);
  };

  const completeTask = async (id: string) => {
    await axios.put(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task Manager</h1>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <div className="my-2">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span className={task.completed ? "line-through" : ""}>
              {task.title}
            </span>
            {!task.completed && (
              <button onClick={() => completeTask(task._id)}>Complete</button>
            )}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
