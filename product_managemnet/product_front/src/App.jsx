import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<UserPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
