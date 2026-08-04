import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toastSuccess } from '../../utils/toast.js';
import AaanLogo from '../common/AaanLogo';
import { ShoppingChallengePill, ShoppingChallengesModal } from '../common/ShoppingChallengesModal';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#bestsellers' },
  { label: 'Categories', href: '#categories' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // Elevate the bar (stronger shadow / tighter blur) once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavClick(e, link) {
    setMenuOpen(false);
    if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const id = link.href.slice(1);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.location.hash = link.href;
      }, 150);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery('');
    navigate(`/?q=${encodeURIComponent(q)}#bestsellers`);
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <AaanLogo size="md" />
        </Link>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {/* Shopping Challenge Spend Rewards Trigger */}
          <div className="nav-challenge-hide-mobile">
            <ShoppingChallengePill onClick={() => setShowChallengeModal(true)} />
          </div>

          {/* Expandable search */}
          <form className={`nav-search ${searchOpen ? 'open' : ''}`} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Search size={19} />
            </button>
          </form>

          <div className="user-menu-wrap">
            <button className={`icon-btn ${user?.photoUrl ? 'navbar-user-btn' : ''}`} aria-label="Account" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="navbar-avatar" />
              ) : (
                <User size={19} />
              )}
            </button>
            {userMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <p className="user-dropdown-name">{user.name}</p>
                    <Link to="/account" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                    <Link to="/account/wishlist" onClick={() => setUserMenuOpen(false)}>Wishlist</Link>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}>Admin Panel</Link>
                    )}
                    <button onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); toastSuccess('Signed out', 'You have been signed out successfully.'); }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)}>Register</Link>

                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <button
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Always-Visible Search Bar */}
      <div className="mobile-navbar-search-row">
        <form className="mobile-nav-search-form" onSubmit={handleSearchSubmit}>
          <Search size={16} className="mobile-search-icon" />
          <input
            type="text"
            placeholder="Search products or ask AI..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products on mobile"
          />
          <button type="submit" className="mobile-search-submit-btn">
            Search
          </button>
        </form>
      </div>

      <ShoppingChallengesModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
      />
    </header>
  );
}
