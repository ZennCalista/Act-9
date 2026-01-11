import React, { useState } from 'react';
import { client } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'BUYER' });
  const [touchedPassword, setTouchedPassword] = useState(false);

  const hasLength = form.password.length >= 6;
  const hasNumber = /\d/.test(form.password);
  const isValid = hasLength && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return; // Prevent submission if invalid
    
    try {
      await client.post('/auth/register', form);
      alert('Registration successful, please login');
      navigate('/login');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input placeholder="Choose a username" onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div>
                   <label>Password</label>
                   <input 
                      type="password" 
                      placeholder="Enter password" 
                      onChange={e => {
                          setForm({...form, password: e.target.value});
                          if (!touchedPassword) setTouchedPassword(true);
                      }} 
                   />
                   {touchedPassword && (
                       <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                           <div style={{ color: hasLength ? '#22c55e' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <span>{hasLength ? '✓' : '○'}</span> At least 6 characters
                           </div>
                           <div style={{ color: hasNumber ? '#22c55e' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                               <span>{hasNumber ? '✓' : '○'}</span> At least 1 number
                           </div>
                       </div>
                   )}
                </div>
                <div>
                    <label>I want to be a:</label>
                    <select onChange={e => setForm({...form, role: e.target.value})}>
                        <option value="BUYER">Buyer (I want to shop)</option>
                        <option value="SELLER">Seller (I want to sell)</option>
                    </select>
                </div>
                <button 
                  type="submit" 
                  style={{ width: '100%', marginTop: '0.5rem', opacity: isValid ? 1 : 0.6, cursor: isValid ? 'pointer' : 'not-allowed' }}
                  disabled={!isValid}
                >
                  Register
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
            </p>
        </div>
    </div>
  );
};