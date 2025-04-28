import React, { useEffect, useState } from 'react';
import { Input, Button, List, Checkbox, message } from 'antd';
import axios from 'axios';
import { getToken } from '../utils/auth';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load todos');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo) return;
    await axios.post('http://localhost:5000/api/todos', { title: newTodo }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    setNewTodo('');
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`http://localhost:5000/api/todos/${todo._id}`, { completed: !todo.completed }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    fetchTodos();
  };

  return (
    <div className="p-6">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        📝 My Todos
      </h1>

      <Input.Search
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        enterButton="Add Todo"
        onSearch={addTodo}
      />

      <List
        style={{ marginTop: 20 }}
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Button onClick={() => toggleComplete(todo)}>
                {todo.completed ? 'Undo' : 'Complete'}
              </Button>,
              <Button danger onClick={() => deleteTodo(todo._id)}>Delete</Button>
            ]}
          >
            <Checkbox checked={todo.completed} onChange={() => toggleComplete(todo)}>
              {todo.title}
            </Checkbox>
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoPage;
