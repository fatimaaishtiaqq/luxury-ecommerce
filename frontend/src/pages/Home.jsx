import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { API_BASE_URL, getWithCache } from '../utils/apiClient';

const heroSlides = [
    {
        id: 1,
        image: "/images/generated/hero_highres_new_vision_1_1772800876135.png",
        subtitle: "THE NEW VISION COLLECTION",
        title: "ELEGANCE IN EVERY FRAME",
        text: "Discover our latest arrivals featuring meticulous craftsmanship, premium materials, and modern designs for timeless sophistication.",
        link: "/collections/all"
    },
    {
        id: 2,
        image: "/images/generated/hero_highres_summer_sun_2_1772800895014.png",
        subtitle: "SUMMER ESSENTIALS",
        title: "CHASE THE SUN IN STYLE",
        text: "Elevate your look with our meticulously designed designer sunglasses, offering ultimate UV protection and undeniable style.",
        link: "/collections/unisex"
    },
    {
        id: 3,
        image: "/images/generated/hero_highres_accessories_3_1772800963920.png",
        subtitle: "LUXURY ACCESSORIES",
        title: "THE PERFECT COMPANION",
        text: "Protect your investment with our handcrafted premium leather cases and exclusive eyewear care kits.",
        link: "/collections/women"
    },
    {
        id: 4,
        image: "/images/generated/hero_highres_everyday_men_4_clear_1772801359699.png",
        subtitle: "EVERYDAY EXCELLENCE",
        title: "CLARITY MEETS COMFORT",
        text: "Experience the perfect blend of optical clarity and weightless comfort with our titanium and acetate collections.",
        link: "/collections/men"
    }
];

const resolveImageUrl = (img) => {
    if (!img || typeof img !== 'string') return null;
    if (img.startsWith('http') || img.startsWith('/images/')) return img;
    const pathParts = img.replace(/\\/g, '/').split('/');
    const fileName = pathParts[pathParts.length - 1];
    return `${API_BASE_URL}/uploads/${fileName}`;
};

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [direction, setDirection] = useState(1); // 1 for right, -1 for left

    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
        }, 6000); // Slightly longer for luxurious pace
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getWithCache('/api/products');
                setTrendingProducts(data.products || []);
            } catch (error) {
                console.error('Failed to fetch trending products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getWithCache('/api/categories');
                setCategories(data.filter(cat => !cat.parent && cat.isActive));
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const nextSlide = () => {
        setDirection(1);
        setCurrentSlide(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
    };

    return (
        <div className="w-full flex-col flex overflow-hidden bg-[var(--bg-color)]">

            {/* Hero Carousel Section */}
            <section className="relative h-[85vh] w-full mt-4 mb-16 overflow-hidden group">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentSlide}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? '10%' : '-10%' }}
                        animate={{ opacity: 1, x: 0, zIndex: 1 }}
                        exit={{ opacity: 0, x: direction > 0 ? '-10%' : '10%', zIndex: 0 }}
                        transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute inset-0"
                    >
                        <motion.div
                            className="absolute inset-0 origin-center"
                            initial={{ scale: 1.05 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 6, ease: "easeOut" }}
                        >
                            <img
                                src={heroSlides[currentSlide].image}
                                alt="Luxury Eyewear Hero"
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Glassmorphic/gradient subtle overlay for text readability without heavy darkness */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                        </motion.div>

                        <div className="relative h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="max-w-2xl text-white md:ml-10"
                            >
                                <motion.h2
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="text-xs font-sans tracking-[0.2em] font-medium uppercase mb-4 text-white/90"
                                >
                                    {heroSlides[currentSlide].subtitle}
                                </motion.h2>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6 mt-2 text-white drop-shadow-md"
                                >
                                    {heroSlides[currentSlide].title.split(' ').slice(0, 2).join(' ')}<br />
                                    {heroSlides[currentSlide].title.split(' ').slice(2).join(' ')}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="text-base md:text-lg mb-10 text-white/90 font-sans max-w-lg leading-relaxed drop-shadow-sm"
                                >
                                    {heroSlides[currentSlide].text}
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.9 }}
                                >
                                    <Link
                                        to={heroSlides[currentSlide].link}
                                        className="btn-primary px-8 py-4 text-sm font-sans font-semibold tracking-widest transition-all duration-300 inline-flex items-center hover:scale-105"
                                    >
                                        SHOP NOW <ArrowRight size={16} className="inline-block ml-2 -mt-0.5" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Carousel Navigation */}
                <button
                    onClick={prevSlide}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-transparent border border-white/30 text-white hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] transition-colors opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronLeft size={20} className="ml-[-2px]" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-transparent border border-white/30 text-white hover:bg-[var(--card-bg)] hover:text-[var(--text-primary)] transition-colors opacity-0 group-hover:opacity-100 z-10"
                >
                    <ChevronRight size={20} className="mr-[-2px]" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-[2px] transition-all duration-300 ${currentSlide === idx ? 'w-10 bg-white' : 'w-6 bg-white/40'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Category Carousel Section */}
            {categories.length > 0 && (
                <section className="py-20 bg-[var(--bg-color)] mb-8 border-t border-[var(--surface-border)]">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-sans tracking-[0.2em] font-medium uppercase mb-4 text-[var(--text-muted)]">SHOP BY CATEGORY</h2>
                        <h3 className="text-3xl font-serif font-bold uppercase tracking-wide text-[var(--text-primary)]">DISCOVER COLLECTIONS</h3>
                    </div>

                    <div className="max-w-[1400px] mx-auto overflow-x-auto pb-8 scrollbar-hide px-4 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="flex gap-6 snap-x snap-mandatory min-w-max">
                            {categories.map((cat) => (
                                <Link
                                    key={cat._id}
                                    to={`/collections/${cat.slug}`}
                                    className="snap-start snap-always relative w-[280px] h-[380px] md:w-[320px] md:h-[420px] group overflow-hidden cursor-pointer flex-shrink-0 bg-[var(--surface-color)]"
                                >
                                    <div className="absolute inset-0">
                                        {cat.image ? (
                                            <img
                                                src={resolveImageUrl(cat.image)}
                                                alt={cat.name}
                                                className="w-full h-full object-cover hover-scale-luxury"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col justify-center items-center text-[var(--text-muted)]">
                                                <span className="text-[10px] tracking-widest uppercase font-bold">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/20"></div>
                                    <div className="absolute bottom-6 left-6 right-6 text-[var(--text-primary)] text-center z-10 bg-[var(--card-bg)] py-4 rounded-sm shadow-premium border border-[var(--surface-border)]">
                                        <h4 className="text-xl font-serif font-bold tracking-wider uppercase mb-1">{cat.name}</h4>
                                        <span className="text-[10px] tracking-[0.2em] font-bold uppercase border-b border-[var(--text-primary)] pb-0.5 group-hover:border-transparent transition-colors duration-300">EXPLORE</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-[var(--surface-border)] opacity-30 pointer-events-none"></div>
                <div className="text-center mb-16 px-4 relative">
                    <h2 className="text-sm font-sans tracking-[0.2em] font-medium uppercase mb-4 text-[var(--text-muted)]">JUST DROPPED</h2>
                    <h3 className="text-4xl font-serif font-bold uppercase tracking-wide text-[var(--text-primary)]">NEW ARRIVALS</h3>
                </div>
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
                    {trendingProducts.slice(0, 4).reverse().map((product) => (
                        <div key={product._id} className="w-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {trendingProducts.length === 0 && (
                        <div className="col-span-4 text-center text-[var(--text-muted)] py-10 uppercase text-sm tracking-widest font-bold">
                            No arrivals found. Check back soon!
                        </div>
                    )}
                </div>
                <div className="flex justify-center mt-16">
                    <Link to="/collections/all" className="btn-secondary px-8 py-4 text-sm tracking-widest uppercase transition-colors">
                        VIEW ALL RECENT
                    </Link>
                </div>
            </section>

            {/* Men / Women Split Banner */}
            <section className="w-full flex md:flex-row flex-col h-auto md:h-[75vh] md:p-2 gap-2 bg-[var(--bg-color)]">
                {/* Men Half */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full group overflow-hidden block">
                    <img
                        src="/images/generated/collection_men_new_1772798073357.png"
                        alt="Men's Collection"
                        className="w-full h-full object-cover object-top transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-700"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center z-10 pointer-events-none">
                        <h3 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-4 text-white drop-shadow-md">MEN</h3>
                        <p className="text-sm font-sans tracking-wide mb-8 text-white/90 drop-shadow-md">Sharp, sophisticated styles for the modern gentleman.</p>
                        <Link to="/collections/men" className="btn-primary px-10 py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase pointer-events-auto bg-white text-black hover:bg-black hover:text-white transition-colors">
                            SHOP MEN
                        </Link>
                    </div>
                </div>

                {/* Women Half */}
                <div className="relative w-full md:w-1/2 h-[50vh] md:h-full group overflow-hidden block">
                    <img
                        src="/images/generated/collection_women_new_1772798088665.png"
                        alt="Women's Collection"
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-700"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center z-10 pointer-events-none">
                        <h3 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-widest mb-4 text-white drop-shadow-md">WOMEN</h3>
                        <p className="text-sm font-sans tracking-wide mb-8 text-white/90 drop-shadow-md">Elegant frames designed to highlight your natural grace.</p>
                        <Link to="/collections/women" className="btn-primary px-10 py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase pointer-events-auto bg-white text-black hover:bg-black hover:text-white transition-colors">
                            SHOP WOMEN
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Now */}
            <section className="py-24 bg-[var(--bg-color)]">
                <div className="text-center mb-16 px-4">
                    <h2 className="text-sm font-sans tracking-[0.2em] font-medium uppercase mb-4 text-[var(--color-electric-blue)]">POPULAR CHOICES</h2>
                    <h3 className="text-3xl font-serif font-bold uppercase tracking-wide text-[var(--text-primary)]">TRENDING NOW</h3>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
                    {trendingProducts.slice(4, 12).map((product) => (
                        <div key={product._id} className="card-premium p-5">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {trendingProducts.length <= 4 && (
                        <div className="col-span-full text-center text-[var(--text-muted)] py-10 uppercase text-sm tracking-widest font-bold">
                            Not enough products to display trending yet.
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-20 border-t border-b border-[var(--surface-border)] relative">
                <div className="absolute inset-0 bg-[var(--surface-border)] opacity-20 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="flex flex-col items-center text-center">
                            <ShieldCheck size={32} className="text-[var(--text-primary)] mb-6" strokeWidth={1.5} />
                            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Authentic Products</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans max-w-[200px]">100% genuine luxury apparel sourced directly.</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <Truck size={32} className="text-[var(--text-primary)] mb-6" strokeWidth={1.5} />
                            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Global Shipping</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans max-w-[200px]">Complimentary express shipping on orders over $250.</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <CreditCard size={32} className="text-[var(--text-primary)] mb-6" strokeWidth={1.5} />
                            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">Secure Payments</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans max-w-[200px]">Your information is processed with utmost security.</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <Clock size={32} className="text-[var(--text-primary)] mb-6" strokeWidth={1.5} />
                            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-3 text-[var(--text-primary)]">24/7 Concierge</h4>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans max-w-[200px]">Our dedicated team is always available to assist.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Block (In-page) */}
            <section className="py-24 bg-[var(--color-bg-section)] flex justify-center border-b border-[var(--surface-border)]">
                <div className="max-w-2xl text-center w-full px-4">
                    <div className="bg-[var(--card-bg)] p-12 md:p-16 flex flex-col items-center border border-[var(--surface-border)]">
                        <h3 className="text-lg font-serif font-bold tracking-widest mb-4 uppercase text-[var(--text-primary)]">JOIN THE EXCLUSIVE CLUB</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-8 font-sans max-w-sm mx-auto">Subscribe to receive early access to new collections and a 10% welcome privilege.</p>
                        <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="flex-1 border-b border-[var(--surface-border)] px-0 py-3 text-sm outline-none focus:border-accent bg-transparent transition-colors text-[var(--text-primary)] placeholder-[var(--text-muted)] font-sans uppercase tracking-widest"
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary px-8 py-3 text-xs tracking-[0.2em] uppercase transition-colors font-bold mt-4 sm:mt-0"
                            >
                                SUBSCRIBE
                            </button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
