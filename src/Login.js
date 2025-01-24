import { useState } from 'react';
import './Login.css';
import logo from './images/logo.jpg';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasi login
    localStorage.setItem('loggedInUser', 'Nama User yang Login');
    window.location.href = '/';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Company Logo" />
          <h1>PT KARUNIA BERCA INDONESIA</h1>
          <h2>Enterprise Resource Planning</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          
          <button type="submit" className="login-button">
            Login
            <i className="fas fa-sign-in-alt"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 