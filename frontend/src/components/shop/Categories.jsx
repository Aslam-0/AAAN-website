import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Wind, Droplets, Flower2, Hand, Grid2x2, Home, Lamp, Sofa, Frame, Utensils } from 'lucide-react';
import { fetchCategories } from '../../api';
import CategoryCard from '../product/CategoryCard';
import './Categories.css';

// Icon map — assigned to DB categories by name match so chips always show icons
const ICON_MAP = [
  { pattern: /home|decor|wall/i,        icon: Home },
  { pattern: /light|lamp|candle/i,      icon: Lamp },
  { pattern: /cushion|curtain|bed/i,    icon: Sofa },
  { pattern: /idol|showpiece|vase|clock|mirror/i, icon: Frame },
  { pattern: /kitchen|dining/i,         icon: Utensils },
  { pattern: /skin|face|glow/i,         icon: Sparkles },
  { pattern: /wellness|relax|massag/i,  icon: Wind },
];

function getIcon(name) {
  const match = ICON_MAP.find(({ pattern }) => pattern.test(name));
  return match ? match.icon : Grid2x2;
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetchCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setCategories(data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Decide render mode: use image cards only if at least one category has an image
  const hasImages = categories.some((c) => c.imageUrl || c.image);

  return (
    <section id="categories" className="categories-section">
      <div className="container">
        <div className="categories-header">
          <div>
            <p className="section-label">Browse</p>
            <h2 className="section-title categories-title">
              Shop By <span className="serif-italic">Category</span>
            </h2>
          </div>
        </div>

        {loading && (
          <div className="category-chips">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="category-chip category-chip-skeleton" aria-hidden="true" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="categories-error">
            <p>Couldn't load categories.</p>
            <button className="btn btn-secondary" onClick={load}>Try again</button>
          </div>
        )}

        {!loading && !error && hasImages && (
          <div className="categories-grid">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}

        {!loading && !error && !hasImages && categories.length > 0 && (
          <div className="category-chips">
            {categories.map((cat) => {
              const Icon = getIcon(cat.name);
              return (
                <Link to={`/category/${cat.slug || cat._id}`} key={cat._id} className="category-chip">
                  <span className="category-chip-icon"><Icon size={18} /></span>
                  <span className="category-chip-text">
                    <span className="category-chip-name">{cat.name}</span>
                    <span className="category-chip-count">
                      {cat.productCount ?? 0} {(cat.productCount ?? 0) === 1 ? 'Product' : 'Products'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

