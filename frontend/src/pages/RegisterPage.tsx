import React, { useState, useEffect } from 'react';
import { client } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'BUYER' });
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'TAKEN'>('IDLE');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    type: 'info' as 'error' | 'success' | 'info' | 'confirm',
    onClose: () => setModalOpen(false)
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!form.username) {
        setUsernameStatus('IDLE');
        return;
      }
      setUsernameStatus('CHECKING');
      try {
        const res = await client.get(`/users/check/${form.username}`);
        setUsernameStatus(res.data.available ? 'AVAILABLE' : 'TAKEN');
      } catch (error) {
        console.error(error);
        setUsernameStatus('IDLE'); 
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [form.username]);

  const hasLength = form.password.length >= 6;
  const hasNumber = /\d/.test(form.password);
  const isValid = hasLength && hasNumber && (usernameStatus === 'AVAILABLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return; // Prevent submission if invalid
    
    try {
      await client.post('/auth/register', form);
      setModalContent({
        title: 'Registration Successful',
        message: 'Registration successful, please login',
        type: 'success',
        onClose: () => {
          setModalOpen(false);
          navigate('/login');
        }
      });
      setModalOpen(true);
    } catch (e: any) {
      setModalContent({
        title: 'Registration Failed',
        message: e.response?.data?.message || 'Registration failed',
        type: 'error',
        onClose: () => setModalOpen(false)
      });
      setModalOpen(true);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                      placeholder="Choose a username" 
                      onChange={e => setForm({...form, username: e.target.value})} 
                    />
                    {usernameStatus === 'CHECKING' && <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Checking availability...</span>}
                    {usernameStatus === 'TAKEN' && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>❌ Username is already taken</span>}
                    {usernameStatus === 'AVAILABLE' && <span style={{ fontSize: '0.8rem', color: '#22c55e' }}>✓ Username available</span>}
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
        <Modal 
          isOpen={modalOpen}
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={modalContent.onClose}
        />
    </div>
  );
};