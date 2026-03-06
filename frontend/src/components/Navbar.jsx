import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL, getWithCache } from '../utils/apiClient';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('lux_user');
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch {
            localStorage.removeItem('lux_user');
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getWithCache('/api/categories');
                const parents = data.filter(c => !c.parent);
                const tree = parents.map(p => ({
                    name: p.name,
                    path: `/collections/${p.slug}`,
                    subcategories: data
                        .filter(c => c.parent?._id === p._id || c.parent?.slug === p.slug)
                        .map(sub => ({
                            name: sub.name,
                            path: `/collections/${p.slug}?category=${sub._id}`
                        }))
                }));
                setCategories(tree);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
            setMobileMenuOpen(false);
        }
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-400 ${isScrolled ? 'bg-[var(--bg-color)] shadow-premium py-3' : 'bg-transparent border-b border-[var(--surface-border)] py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-10">

                    {/* Desktop Navigation (Left Container) */}
                    <div className="flex flex-1 items-center gap-10">
                        {/* Logo (Far Left) */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <span className="text-2xl font-serif font-bold tracking-widest text-[var(--text-primary)] hover:text-accent transition-colors">EYESTYLE</span>
                            </Link>
                        </div>

                        {/* Categories (Next to Logo) */}
                        <nav className="hidden lg:flex space-x-8 items-center">
                            {categories.map((link) => (
                                <div key={link.name} className="relative group h-full flex items-center">
                                    <Link
                                        to={link.path}
                                        className="text-sm font-sans font-medium tracking-wide text-[var(--text-body)] hover:text-[var(--text-primary)] transition-colors py-4 flex items-center gap-1"
                                    >
                                        {link.name}
                                        {link.subcategories && link.subcategories.length > 0 && <ChevronDown size={14} className="group-hover:-rotate-180 transition-transform duration-300" />}
                                    </Link>

                                    {/* Subcategory Dropdown */}
                                    {link.subcategories && link.subcategories.length > 0 && (
                                        <div className="absolute top-12 left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top group-hover:translate-y-0 translate-y-2 z-[100]">
                                            <div className="bg-[var(--bg-color)] shadow-premium p-6 min-w-[240px] flex flex-col border border-[var(--surface-border)] rounded-sm">
                                                <div className="flex flex-col space-y-3">
                                                    {link.subcategories.map(sub => (
                                                        <Link
                                                            key={sub.name}
                                                            to={sub.path}
                                                            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-sans"
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex-shrink-0 lg:hidden">
                        <button
                            className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>

                    {/* Icons (Far Right) */}
                    <div className="flex items-center justify-end space-x-5 flex-1">
                        <div className="hidden sm:flex items-center relative">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[var(--text-primary)] pb-1">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="outline-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm w-40 font-sans"
                                        autoFocus
                                    />
                                    <button type="submit" className="text-[var(--text-primary)] ml-2 hover:text-[var(--color-electric-blue)] transition-colors">
                                        <Search size={20} strokeWidth={1.5} />
                                    </button>
                                    <button type="button" onClick={() => setIsSearchOpen(false)} className="text-[var(--text-primary)] ml-2 hover:text-[var(--color-electric-blue)] transition-colors">
                                        <X size={18} />
                                    </button>
                                </form>
                            ) : (
                                <button onClick={() => setIsSearchOpen(true)} className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors flex items-center p-1" aria-label="Search">
                                    <Search size={22} strokeWidth={1.5} />
                                </button>
                            )}
                        </div>

                        <button onClick={toggleTheme} className="hidden sm:flex text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors items-center p-1" aria-label="Toggle Theme">
                            {theme === 'dark' ? <Sun size={22} strokeWidth={1.5} /> : <Moon size={22} strokeWidth={1.5} />}
                        </button>
                        <Link to="/account" className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors flex items-center p-1" aria-label="Account">
                            <User size={22} strokeWidth={1.5} />
                        </Link>
                        <Link to="/wishlist" className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors relative flex items-center p-1" aria-label="Wishlist">
                            <Heart size={22} strokeWidth={1.5} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[var(--color-electric-blue)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors relative flex items-center p-1" aria-label="Cart">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-[var(--color-electric-blue)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden bg-[var(--bg-color)] border-t border-[var(--surface-border)] absolute w-full shadow-premium"
                    >
                        <div className="px-6 py-6 space-y-5 flex flex-col">
                            {categories.map((link) => (
                                <div key={link.name} className="flex flex-col">
                                    <Link
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-base font-sans font-medium text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                    {link.subcategories && (
                                        <div className="flex flex-col pl-4 mt-2 space-y-3 border-l border-[var(--surface-border)] ml-2">
                                            {link.subcategories.map(sub => (
                                                <Link
                                                    key={sub.name}
                                                    to={sub.path}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="text-sm font-sans text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-2 mt-4 lg:hidden">
                                <span className="text-sm font-sans text-[var(--text-primary)]">Theme</span>
                                <button onClick={toggleTheme} className="text-[var(--text-primary)] hover:text-[var(--color-electric-blue)] transition-colors p-1" aria-label="Toggle Theme">
                                    {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                                </button>
                            </div>
                            <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[var(--surface-border)] pb-2 mt-4">
                                <Search size={18} className="text-[var(--text-primary)] mr-3" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full text-sm outline-none bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] font-sans"
                                />
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
