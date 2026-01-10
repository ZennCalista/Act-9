import { useEffect, useState } from 'react';
import { client } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Sub-component for individual product logic
const ProductCard = ({ product, role, onDelete, onAddToCart, onUpdate }: any) => {
  const [formData, setFormData] = useState({
    title: product.title,
    price: product.price,
    stock: product.stock,
    description: product.description || ''
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = 
    formData.title !== product.title ||
    Number(formData.price) !== product.price || 
    Number(formData.stock) !== product.stock ||
    formData.description !== (product.description || '') ||
    newImage !== null;

  const handleSave = () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', String(formData.price));
    data.append('stock', String(formData.stock));
    data.append('description', formData.description);
    if (newImage) {
      data.append('image', newImage);
    }

    onUpdate(product.id, data);
    setNewImage(null); // Reset after save
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: role === 'SELLER' ? '1px solid #94a3b8' : 'none' }}>
      {newImage ? (
         <div style={{ height: '220px', overflow: 'hidden' }}>
            <img 
              src={URL.createObjectURL(newImage)} 
              alt="Preview" 
              style={{ width: '100%', height: '220px', objectFit: 'cover', opacity: 0.8 }}
            />
         </div>
      ) : product.imageUrl ? (
        <img 
          src={`http://localhost:3000${product.imageUrl}`} 
          alt={product.title} 
          style={{ width: '100%', height: '220px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{ height: '220px', background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            📦
        </div>
      )}

      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          
          {/* SELLER MODE: Inputs */}
          {role === 'SELLER' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <label style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Product Name</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => handleChange('title', e.target.value)}
                style={{ marginBottom: 0, padding: '0.4rem' }} 
              />
              
              <label style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Price (PHP)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={e => handleChange('price', e.target.value)}
                style={{ marginBottom: 0, padding: '0.4rem' }} 
              />

              <label style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Stock</label>
              <input 
                type="number" 
                value={formData.stock} 
                onChange={e => handleChange('stock', e.target.value)}
                style={{ marginBottom: 0, padding: '0.4rem' }} 
              />

              <label style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => handleChange('description', e.target.value)}
                style={{ marginBottom: 0, padding: '0.4rem', resize: 'vertical', minHeight: '60px' }} 
                placeholder="Product description... "
              />

              <label style={{fontSize: '0.8rem', fontWeight: 'bold'}}>Change Image</label>
              <input 
                 type="file" 
                 accept="image/*"
                 onChange={e => setNewImage(e.target.files ? e.target.files[0] : null)}
                 style={{ marginBottom: 0, padding: '0.4rem', fontSize: '0.8rem' }}
              />
            </div>
          ) : (
            // BUYER MODE: Display
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{product.title}</h3>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>₱{product.price}</span>
              </div>
              {product.description && (
                <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 1rem 0' }}>{product.description}</p>
              )}
              
              <div style={{ marginBottom: '1rem' }}>
                  {product.stock > 0 ? (
                      <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>In Stock: {product.stock}</span>
                  ) : (
                      <span className="badge out-of-stock">Out of Stock</span>
                  )}
              </div>
            </>
          )}

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {role === 'BUYER' && product.stock > 0 && (
                <button onClick={() => onAddToCart(product.id)} style={{ width: '100%' }}>Add to Cart</button>
              )}
              
              {role === 'SELLER' && (
                  <>
                    {hasChanges && (
                      <button onClick={handleSave} style={{ width: '100%', background: '#3b82f6' }}>💾 Save Changes</button>
                    )}
                    <button className="danger" onClick={() => onDelete(product.id)} style={{ width: '100%' }}>Delete Product</button>
                  </>
              )}
          </div>
      </div>
    </div>
  );
};

export const ProductsPage = () => {
  const { role } = useAuth();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: '', price: '', stock: '', description: '', image: null as File | null });

  const fetchProducts = async () => {
    const res = await client.get('/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    try {
      const priceVal = Number(newProduct.price);
      const stockVal = Number(newProduct.stock);
      
      if (!newProduct.title || isNaN(priceVal) || isNaN(stockVal)) {
          alert('Please fill in valid details');
          return;
      }

      const formData = new FormData();
      formData.append('title', newProduct.title);
      formData.append('price', String(priceVal));
      formData.append('stock', String(stockVal));
      formData.append('description', newProduct.description);
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      await client.post('/products', formData);
      fetchProducts();
      setNewProduct({ title: '', price: '', stock: '', description: '', image: null });
    } catch (e) {
      console.error(e);
      alert('Error creating product');
    }
  };

  const handleUpdate = async (id: string, updatedData: any) => {
    try {
      await client.patch(`/products/${id}`, updatedData);
      // alert('Product updated!'); // Optional: feedback
      fetchProducts(); // Refresh to ensure sync
    } catch (e: any) {
      console.error('Update failed:', e);
      if (e.response && e.response.status === 401) {
        alert('Session expired or unauthorized. Please login again.');
      } else {
        alert(e.response?.data?.message || 'Error updating product');
      }
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await client.post('/cart', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (e: any) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
      if(!confirm('Are you sure you want to delete this?')) return;
      await client.delete(`/products/${id}`);
      fetchProducts();
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
         <h2>{role === 'SELLER' ? 'Seller Dashboard' : 'Marketplace'}</h2>
      </div>
      
      {role === 'SELLER' && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
          <h3 style={{ color: 'var(--primary)' }}>📢 Sell an Item</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 2fr', gap: '1rem' }}>
              <div>
                  <label>Product Name</label>
                  <input style={{ marginBottom: 0 }} placeholder="e.g. Wireless Mouse" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
              </div>
              <div>
                  <label>Price (PHP)</label>
                  <input style={{ marginBottom: 0 }} type="number" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
              </div>
              <div>
                  <label>Stock Qty</label>
                  <input style={{ marginBottom: 0 }} type="number" placeholder="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
              </div>
              <div>
                  <label>Description</label>
                  <input style={{ marginBottom: 0 }} placeholder="Short description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                  <label>Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setNewProduct({...newProduct, image: e.target.files ? e.target.files[0] : null})}
                    style={{ marginBottom: 0, padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%' }} 
                  />
              </div>
              <button onClick={handleCreate}>+ Add Item</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {products.map((p: any) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            role={role} 
            onDelete={handleDelete} 
            onUpdate={handleUpdate} 
            onAddToCart={handleAddToCart} 
          />
        ))}
      </div>
    </div>
  );
};