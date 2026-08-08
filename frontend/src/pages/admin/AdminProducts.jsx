import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import {
  fetchAdminProducts,
  updateStock,
  updateDiscount,
  deleteProduct,
  formatPrice,
  getProductPrice,
} from '../../api';
import '../../styles/Panel.css';

const demoProducts = [
  { _id: 'p-1', name: 'AAAN Luxury Silk Saree & Dupatta Set', category: { name: 'Clothes' }, price: 4999, discountPercent: 20, stockQuantity: 24, images: ['/aaan-logo.svg'] },
  { _id: 'p-2', name: 'AAAN Ergonomic Executive Office Chair', category: { name: 'Furniture' }, price: 12999, discountPercent: 15, stockQuantity: 12, images: ['/aaan-logo.svg'] },
  { _id: 'p-3', name: 'AAAN Smart OLED 4K Display Monitor', category: { name: 'Electronics' }, price: 28999, discountPercent: 10, stockQuantity: 8, images: ['/aaan-logo.svg'] }
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetchAdminProducts()
      .then((res) => {
        if (Array.isArray(res)) setProducts(res);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStock = async (id, stockQuantity) => {
    await updateStock(id, parseInt(stockQuantity, 10));
    load();
  };

  const handleDiscount = async (id, discountPercent) => {
    await updateDiscount(id, parseInt(discountPercent, 10));
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-sky btn-sm">
          <PlusCircle size={16} /> Add Product
        </Link>
      </div>
      <p className="panel-subtitle">Manage inventory, stock levels, and discounts</p>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td data-label="Product" data-full>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    {p.name}
                  </div>
                </td>
                <td data-label="Price">{formatPrice(p.price)}</td>
                <td data-label="Discount">
                  <input
                    type="number"
                    className="discount-input"
                    defaultValue={p.discountPercent || 0}
                    min={0}
                    max={100}
                    onBlur={(e) => handleDiscount(p._id, e.target.value)}
                  />%
                </td>
                <td data-label="Final">{formatPrice(getProductPrice(p))}</td>
                <td data-label="Stock">
                  <input
                    type="number"
                    className="stock-input"
                    defaultValue={p.stockQuantity}
                    min={0}
                    onBlur={(e) => handleStock(p._id, e.target.value)}
                  />
                </td>
                <td data-label="Actions">
                  <div className="panel-actions">
                    <Link to={`/admin/products/${p._id}/edit`} className="btn btn-sm btn-secondary">Edit</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
