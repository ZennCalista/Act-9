import { useEffect, useState } from 'react';
import { client } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ 
        title: '', 
        message: '', 
        type: 'info' as 'info' | 'success' | 'error' | 'confirm' 
    });

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

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await client.patch(`/cart/${itemId}`, { quantity: newQuantity });
            fetchCart();
        } catch (e: any) {
             setModalConfig({
                title: 'Update Failed',
                message: e.response?.data?.message || 'Failed to update quantity',
                type: 'error'
             });
             setModalOpen(true);
        }
    };

    const handleCheckoutClick = () => {
        setModalConfig({
            title: 'Confirm Checkout',
            message: 'Are you sure you want to checkout and pay for these items?',
            type: 'confirm'
        });
        setModalOpen(true);
    };

    const performCheckout = async () => {
        try {
            await client.post('/orders/checkout');
            setModalConfig({
                title: 'Success',
                message: 'Order placed successfully!',
                type: 'success'
            });
            fetchCart();
        } catch (e: any) {
             setModalConfig({
                title: 'Checkout Failed',
                message: e.response?.data?.message || 'Checkout failed',
                type: 'error'
             });
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        if (modalConfig.type === 'success') {
            navigate('/orders');
        }
    };

    if (!cart) return <div className="container">Loading...</div>;

    const total = cart.items?.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0) || 0;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Modal
                isOpen={modalOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onClose={handleModalClose}
                onConfirm={modalConfig.type === 'confirm' ? performCheckout : undefined}
                confirmText="Pay Now"
            />
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', color: item.quantity <= 1 ? '#ccc' : '#333' }}
                                            >-</button>
                                            <span style={{ padding: '0 0.5rem', minWidth: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock}
                                                style={{ padding: '0.2rem 0.6rem', border: 'none', background: 'transparent', cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer', color: item.quantity >= item.product.stock ? '#ccc' : '#333' }}
                                            >+</button>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                                            × PHP {item.product.price}
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: item.quantity >= item.product.stock ? 'orange' : 'transparent', height: '1.2rem' }}>
                                        {item.quantity >= item.product.stock && 'Max stock reached'}
                                    </div>
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
                        <button onClick={handleCheckoutClick} style={{ fontSize: '1.1rem', padding: '0.8rem 2rem' }}>Checkout & Pay</button>
                    </div>
                </div>
            )}
        </div>
    );
};