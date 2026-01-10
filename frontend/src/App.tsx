import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductsPage } from './pages/ProductsPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import './App.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user && (location.pathname === '/login' || location.pathname === '/register')) {
    return null;
  }

  return (
    <nav style={{ 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border)', 
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
           MiniMart
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/" style={{ fontWeight: 500 }}>Products</Link>
              {user.role === 'BUYER' && <Link to="/cart" style={{ fontWeight: 500 }}>Cart</Link>}
              {user.role === 'BUYER' && <Link to="/orders" style={{ fontWeight: 500 }}>My Orders</Link>}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hi, {user.username} ({user.role})</span>
                <button className="secondary" onClick={logout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"><button className="secondary">Login</button></Link>
              <Link to="/register"><button>Get Started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
