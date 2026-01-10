import { useEffect, useState } from 'react';
import { client } from '../api/client';

export const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        client.get('/orders').then(res => setOrders(res.data));
    }, []);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>📦 Order History</h2>
            {orders.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No orders found.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {orders.map((o: any) => (
                        <div key={o.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Order #{o.id.slice(0, 8)}...</h4>
                                    <small style={{ color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</small>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>PHP {o.totalPrice}</div>
                                    <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>{o.status}</span>
                                </div>
                            </div>
                            
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {o.items.map((i: any) => (
                                    <li key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                        <span>{i.product.title} <span style={{ color: 'var(--text-muted)' }}>x{i.quantity}</span></span>
                                        <span>PHP {i.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};