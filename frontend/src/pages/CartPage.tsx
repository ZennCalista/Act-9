import { useEffect, useState } from 'react';
import { client } from '../api/client';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<any>(null);

    const fetchCart = async () => {
        try {
            const res = await client.get('/cart');
            setCart(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (id: string) => {
        await client.delete(`/cart/${id}`);
        fetchCart();
    };

    const handleCheckout = async () => {
        try {
            await client.post('/orders/checkout');
            alert('Order placed successfully!');
            fetchCart();
            navigate('/orders');
        } catch (e: any) {
             alert(e.response?.data?.message || 'Checkout failed');
        }
    }

    if (!cart) return <div className="container">Loading...</div>;

    const total = cart.items?.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>🛒 Your Shopping Cart</h2>
            
            {cart.items?.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Your cart is empty.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {cart.items?.map((item: any) => (
                            <div key={item.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '1rem',
                                borderBottom: '1px solid var(--border)'
                            }}>
                                <div>
                                    <h4 style={{ marginBottom: '0.2rem' }}>{item.product.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        Qty: {item.quantity} × PHP {item.product.price}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>PHP {(item.product.price * item.quantity).toFixed(2)}</span>
                                    <button className="danger" onClick={() => handleRemove(item.id)}>Remove</button>
                                </div>
                            </div>
                        ))}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Total Amount:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>PHP {total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                        <button onClick={handleCheckout} style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}>Checkout & Pay</button>
                    </div>
                </div>
            )}
        </div>
    );
};