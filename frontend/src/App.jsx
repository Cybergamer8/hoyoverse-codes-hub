import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/codes');
      const data = await response.json();
      setCodes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching codes:', error);
      setLoading(false);
    }
  };

  const handleRedeem = async (code) => {
    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.code, game: code.game })
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error('Error redeeming code:', error);
      alert('Failed to redeem code');
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>Hoyoverse Codes Hub</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>

      <main className="main-content">
        <h2>Available Game Codes</h2>
        
        {loading ? (
          <p>Loading codes...</p>
        ) : (
          <div className="codes-grid">
            {codes.map((code, index) => (
              <div key={index} className="code-card">
                <h3>{code.game}</h3>
                <div className="code-display">{code.code}</div>
                <p className="reward">{code.reward}</p>
                {code.expires && (
                  <p className="expires">Expires: {code.expires}</p>
                )}
                <button 
                  className="redeem-btn"
                  onClick={() => handleRedeem(code)}
                >
                  Redeem Code
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Login successful!');
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login error occurred');
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <h1>Hoyoverse Codes Hub</h1>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>

      <main className="login-content">
        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="submit-btn">Login</button>
          </form>
          
          {message && <p className="message">{message}</p>}
        </div>
      </main>
    </div>
  );
}

export default App;
