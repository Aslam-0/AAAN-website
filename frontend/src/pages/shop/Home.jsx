import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Search, Heart, ShoppingBag, ArrowRight, Star,
  ShieldCheck, RotateCcw, Headphones, Sparkles, Flame,
  Package, Plus, Check, Truck, Zap, Percent, ChevronRight, Award
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { fetchProducts, formatPrice, getProductPrice, addToWishlist, removeFromWishlist } from '../../api';
import { toastWishlist } from '../../utils/toast.js';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AaanLogo from '../../components/common/AaanLogo';
import { semanticSearchProducts } from '../../utils/semanticSearch';
import '../../styles/animations.css';
import './Home.css';

const siteTitle = 'AAAN Enterprises | Official Store — Premium Products & Deals';
const siteDescription = 'Shop high quality electronics, fashion, beauty, and home lifestyle products at AAAN Enterprises. Enjoy fast shipping, secure payment, and 100% genuine quality.';

export default function Home() {
  const { cartItems = [], cartCount, cartTotal, addToCart, isInWishlist, toggleWishlist } = useCart();
  const { isAuthenticated, setShowLoginModal } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // High quality default product catalog fallback
  const defaultProducts = [
    {
      _id: 'demo-1',
      name: 'Air Max Pro Sport Edition',
      slug: 'air-max-pro-sport-edition',
      price: 16900,
      finalPrice: 12999,
      discountPercent: 25,
      rating: 4.9,
      reviewCount: 248,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      category: 'Sports & Shoes'
    },
    {
      _id: 'demo-2',
      name: 'Ultra Smart Watch Series 9',
      slug: 'ultra-smart-watch-series-9',
      price: 24900,
      finalPrice: 18990,
      discountPercent: 24,
      rating: 4.8,
      reviewCount: 312,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics'
    },
    {
      _id: 'demo-3',
      name: 'Luxury Rose Gold Elixir Perfume',
      slug: 'luxury-rose-gold-elixir-perfume',
      price: 4999,
      finalPrice: 3499,
      discountPercent: 30,
      rating: 4.9,
      reviewCount: 184,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
      category: 'Beauty'
    },
    {
      _id: 'demo-4',
      name: 'Pro Wireless ANC Headphones',
      slug: 'pro-wireless-anc-headphones',
      price: 14999,
      finalPrice: 10999,
      discountPercent: 27,
      rating: 4.9,
      reviewCount: 420,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      category: 'Electronics'
    },
    {
      _id: 'demo-5',
      name: 'Premium Silk Cotton Oversized Shirt',
      slug: 'premium-silk-cotton-oversized-shirt',
      price: 2999,
      finalPrice: 1999,
      discountPercent: 33,
      rating: 4.7,
      reviewCount: 96,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion'
    },
    {
      _id: 'demo-6',
      name: 'Minimalist Italian Leather Bag',
      slug: 'minimalist-italian-leather-bag',
      price: 7999,
      finalPrice: 5499,
      discountPercent: 31,
      rating: 4.8,
      reviewCount: 135,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      category: 'Fashion'
    },
    {
      _id: 'demo-7',
      name: 'Botanical Facial Serum Glow Oil',
      slug: 'botanical-facial-serum-glow-oil',
      price: 1899,
      finalPrice: 1299,
      discountPercent: 31,
      rating: 4.9,
      reviewCount: 510,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      category: 'Beauty'
    },
    {
      _id: 'demo-8',
      name: 'Electric Body Massager Deep Tissue',
      slug: 'electric-body-massager-deep-tissue',
      price: 3999,
      finalPrice: 2499,
      discountPercent: 37,
      rating: 4.9,
      reviewCount: 620,
      image: '/masage.jpg',
      category: 'Wellness & Massagers'
    }
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  const baseCategoryFiltered = selectedCategory === 'all'
    ? displayProducts
    : displayProducts.filter(p => {
        const cat = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
        return cat.toLowerCase().includes(selectedCategory.toLowerCase());
      });

  const filteredProducts = searchQuery.trim()
    ? semanticSearchProducts(baseCategoryFiltered, searchQuery)
    : baseCategoryFiltered;

  const bestDeals = displayProducts.slice(0, 4);
  const trendingNow = displayProducts.slice(4, 8).length > 0 ? displayProducts.slice(4, 8) : displayProducts.slice(0, 4);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}#products`);
    }
  };

  const handleWishlistClick = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    const wished = isInWishlist(p._id);
    toggleWishlist(p);
    toastWishlist(!wished);
    try {
      if (wished) await removeFromWishlist(p._id);
      else await addToWishlist(p._id);
    } catch {
      toggleWishlist(p);
    }
  };

  return (
    <div className="aaan-homepage-shell">
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
      </Helmet>

      {/* Announcement Banner */}
      <div className="aaan-announcement-bar">
        <div className="container aaan-announcement-inner">
          <span className="aaan-badge-flash">⚡ LAUNCH OFFER</span>
          <p>
            Get <strong>Up to 50% OFF</strong> + Free Express Shipping across India on orders over ₹499!
          </p>
          <span className="aaan-code-chip">Code: <strong>AAAN50</strong></span>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar />

      <main className="aaan-main-content">
        
        {/* Hero Banner Showcase Section */}
        <section className="aaan-hero-section">
          <div className="container">
            <div className="aaan-hero-card">
              <div className="aaan-hero-left">
                <div className="aaan-hero-tag-badge">
                  <Sparkles size={16} color="#FFE600" />
                  <span>✨ AAAN ENTERPRISES — LUXURY COLLECTION 2026</span>
                </div>
                <h1 className="aaan-hero-title">
                  Discover Unmatched Elegance &amp; <br />
                  <span className="aaan-gradient-text-gold">Premium AAAN Quality</span>
                </h1>
                <p className="aaan-hero-subtitle">
                  Shop handpicked luxury fashion, cutting-edge electronics, premium body massagers &amp; beauty essentials with 24-Hour Doorstep Express Delivery across India.
                </p>

                <div className="aaan-hero-actions">
                  <a href="#bestsellers" className="aaan-btn-gold-primary">
                    Shop Luxury Range <ArrowRight size={18} />
                  </a>
                  <a href="#flash-sale" className="aaan-btn-glass">
                    <Zap size={18} color="#FFE600" /> Today's Flash Deals
                  </a>
                </div>

                {/* Micro Metrics */}
                <div className="aaan-hero-metrics">
                  <div className="metric-item">
                    <strong>50,000+</strong>
                    <span>Happy Customers</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-item">
                    <strong>4.9 ★★★★★</strong>
                    <span>Verified Rating</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-item">
                    <strong>24-Hour</strong>
                    <span>Doorstep Express</span>
                  </div>
                </div>
              </div>

              <div className="aaan-hero-right">
                <div className="aaan-hero-image-frame">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
                    alt="AAAN Premium Showcase"
                    className="aaan-hero-main-img"
                  />
                  {/* Floating Badges */}
                  <div className="floating-badge badge-top-right">
                    <Award size={18} color="#FFE600" />
                    <div>
                      <strong>🔥 UP TO 50% OFF TODAY</strong>
                      <small>100% Genuine Guaranteed</small>
                    </div>
                  </div>

                  <div className="floating-badge badge-bottom-left">
                    <Truck size={18} color="#10B981" />
                    <div>
                      <strong>⚡ Express Free Shipping</strong>
                      <small>Dispatched in 24 Hours</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar Section */}
        <section className="aaan-categories-section" id="categories">
          <div className="container">
            <div className="aaan-section-header text-center">
              <span className="aaan-sub-tag">EXPLORE COLLECTIONS</span>
              <h2 className="aaan-section-title">Popular Categories</h2>
            </div>

            <div className="aaan-cat-grid">
              <div
                className={`aaan-cat-card ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <div className="cat-icon-wrap cat-all">✨</div>
                <span>All Products</span>
              </div>

              <div
                className={`aaan-cat-card ${selectedCategory === 'fashion' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('fashion')}
              >
                <div className="cat-icon-wrap cat-fashion">👕</div>
                <span>Fashion &amp; Apparel</span>
              </div>

              <div
                className={`aaan-cat-card ${selectedCategory === 'electronics' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('electronics')}
              >
                <div className="cat-icon-wrap cat-electronics">🎧</div>
                <span>Electronics &amp; Tech</span>
              </div>

              <div
                className={`aaan-cat-card ${selectedCategory === 'beauty' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('beauty')}
              >
                <div className="cat-icon-wrap cat-beauty">💄</div>
                <span>Beauty &amp; Skincare</span>
              </div>

              <div
                className={`aaan-cat-card ${selectedCategory === 'wellness' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('wellness')}
              >
                <div className="cat-icon-wrap cat-wellness">💆‍♂️</div>
                <span>Massagers &amp; Care</span>
              </div>

              <div
                className={`aaan-cat-card ${selectedCategory === 'sports' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('sports')}
              >
                <div className="cat-icon-wrap cat-sports">👟</div>
                <span>Sports &amp; Shoes</span>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sale Banner Section */}
        <section className="aaan-flash-section" id="flash-sale">
          <div className="container">
            <div className="aaan-flash-card">
              <div className="aaan-flash-info">
                <div className="flash-header">
                  <Flame size={24} color="#EF4444" />
                  <h3>AAAN Flash Sale</h3>
                  <div className="flash-timer">
                    <span>04</span>:<span>18</span>:<span>35</span>
                  </div>
                </div>
                <p>Don’t miss out on limited-time discounts up to 70% OFF with immediate dispatch.</p>
              </div>
              <Link to="/category/all" className="aaan-btn-light">
                Shop Deals Now <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Best Sellers Section */}
        <section className="aaan-products-section" id="bestsellers">
          <div className="container">
            
            {/* AI Semantic Vector Search Box (Desktop Only) */}
            <div className="aaan-ai-search-hero-box desktop-only-search-box" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #4F46E5 100%)', borderRadius: '24px', padding: '24px 32px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 30px rgba(15,23,42,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="#FFE600" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>✨ AI Semantic Vector Search</h3>
                </div>
                <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '50px', fontWeight: 700 }}>
                  Vector Embeddings &amp; Intent Match
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    placeholder='Try natural queries: "Comfortable office chair for long working hours" or "Phone under 25000"...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '50px', border: 'none', fontSize: '0.95rem', outline: 'none', background: '#FFFFFF', color: '#0F172A', fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                  />
                </div>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)', color: 'white', border: 'none', padding: '0 28px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer', fontSize: '0.92rem', boxShadow: '0 4px 14px rgba(236,72,153,0.3)' }}>
                  Search AI
                </button>
              </form>

              {/* Sample Natural Language Query Chips */}
              <div className="aaan-ai-search-chips-row">
                <span className="chips-label">Try Natural Queries:</span>
                {[
                  'Comfortable office chair for long working hours',
                  'Phone with excellent camera under 25000',
                  'Luxury silk saree',
                  'Body massager for pain relief'
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => { setSearchQuery(sample); navigate(`/?q=${encodeURIComponent(sample)}#products`); }}
                    style={{ background: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            <div className="aaan-section-header flex-between">
              <div>
                <span className="aaan-sub-tag">
                  {searchQuery ? '⚡ AI SEMANTIC MATCHES' : 'CURATED DEALS'}
                </span>
                <h2 className="aaan-section-title">
                  {searchQuery ? `AI Search Results for "${searchQuery}"` : 'Best Sellers at AAAN'}
                </h2>
              </div>
              <Link to="/category/all" className="aaan-link-more">
                View All Catalog <ArrowRight size={16} />
              </Link>
            </div>

            <div className="aaan-products-grid">
              {filteredProducts.slice(0, 8).map((p) => {
                const finalP = getProductPrice(p);
                const wished = isInWishlist(p._id);
                return (
                  <div key={p._id} className="aaan-product-card">
                    {p.discountPercent > 0 && (
                      <span className="aaan-discount-tag">-{p.discountPercent}% OFF</span>
                    )}

                    <button
                      className={`aaan-wishlist-btn ${wished ? 'active' : ''}`}
                      onClick={(e) => handleWishlistClick(e, p)}
                      aria-label="Wishlist"
                    >
                      <Heart size={18} fill={wished ? '#EF4444' : 'none'} color={wished ? '#EF4444' : '#64748B'} />
                    </button>

                    <Link to={`/products/${p.slug}`} className="aaan-p-img-box">
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </Link>

                    <div className="aaan-p-details">
                      <span className="aaan-p-category">
                        {typeof p.category === 'object' ? p.category?.name : (p.category || 'AAAN Store')}
                      </span>

                      <Link to={`/products/${p.slug}`} className="aaan-p-title">
                        {p.name}
                      </Link>

                      <div className="aaan-p-rating">
                        <div className="stars">
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        </div>
                        <span className="rating-score">{p.rating || 4.8}</span>
                        <span className="rating-count">({p.reviewCount || 110})</span>
                      </div>

                      <div className="aaan-p-bottom">
                        <div className="aaan-price-block">
                          <span className="current-price">{formatPrice(finalP)}</span>
                          {p.discountPercent > 0 && (
                            <span className="old-price">{formatPrice(p.price)}</span>
                          )}
                        </div>

                        <button
                          className="aaan-add-cart-btn"
                          onClick={(e) => { e.preventDefault(); addToCart(p); }}
                          title="Add to Cart"
                        >
                          <Plus size={18} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3 High-Impact Promotional Banners */}
        <section className="aaan-promo-banners-section">
          <div className="container">
            <div className="aaan-promo-grid">
              
              <div className="aaan-banner-card banner-fashion">
                <div className="banner-content">
                  <span className="banner-tag">SPRING / SUMMER</span>
                  <h3>High Fashion Apparel</h3>
                  <p>Up to 50% Off Top Styles</p>
                  <Link to="/category/fashion" className="banner-btn">Shop Fashion</Link>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80"
                  alt="Fashion Banner"
                  className="banner-img"
                />
              </div>

              <div className="aaan-banner-card banner-tech">
                <div className="banner-content">
                  <span className="banner-tag">SMART TECH</span>
                  <h3>Electronics &amp; Audio</h3>
                  <p>Experience Crisp Clarity</p>
                  <Link to="/category/electronics" className="banner-btn">Shop Tech</Link>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
                  alt="Tech Banner"
                  className="banner-img"
                />
              </div>

              <div className="aaan-banner-card banner-beauty">
                <div className="banner-content">
                  <span className="banner-tag">SKIN &amp; BODY</span>
                  <h3>Massagers &amp; Care</h3>
                  <p>Relieve Stress Everyday</p>
                  <Link to="/category/wellness" className="banner-btn">Shop Wellness</Link>
                </div>
                <img
                  src="/masage.jpg"
                  alt="Wellness Banner"
                  className="banner-img"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Trust Badges & Proposition Bar */}
        <section className="aaan-trust-section">
          <div className="container">
            <div className="aaan-trust-grid">
              
              <div className="trust-card">
                <div className="trust-icon-box">
                  <ShieldCheck size={26} color="#4F46E5" />
                </div>
                <div>
                  <h4>100% Genuine Quality</h4>
                  <p>Authentic products with direct manufacturer warranties.</p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <Truck size={26} color="#10B981" />
                </div>
                <div>
                  <h4>Fast Express Delivery</h4>
                  <p>Swift &amp; tracked dispatch right to your doorstep.</p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <RotateCcw size={26} color="#F59E0B" />
                </div>
                <div>
                  <h4>30 Days Easy Returns</h4>
                  <p>Hassle-free replacement or full refund policies.</p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <Headphones size={26} color="#EC4899" />
                </div>
                <div>
                  <h4>24/7 Support Assistance</h4>
                  <p>Friendly customer care dedicated to serving you.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}

export function HomeLayout() {
  return <Home />;
}
