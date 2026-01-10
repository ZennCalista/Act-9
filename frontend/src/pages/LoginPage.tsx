import React, { useState } from 'react';
import { client } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await client.post('/auth/login', form);
      login(res.data.access_token);
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setModalTitle('Login Failed');
      setModalMessage(Array.isArray(message) ? message.join(', ') : message);
      setModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Modal 
          isOpen={modalOpen} 
          title={modalTitle} 
          message={modalMessage} 
          onClose={() => setModalOpen(false)} 
          type="error"
        />
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Welcome Back</h2>
            <form onSubmit={handleSubmit}>
                <div>
                   <label>Username</label>
                   <input 
                      placeholder="Enter your username" 
                      onChange={e => setForm({...form, username: e.target.value})} 
                   />
                </div>
                <div>
                   <label>Password</label>
                   <input 
                      type="password" 
                      placeholder="Enter your password" 
                      onChange={e => setForm({...form, password: e.target.value})} 
                   />
                </div>
                <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Login</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register</Link>
            </p>
        </div>
    </div>
  );
};