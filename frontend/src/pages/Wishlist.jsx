import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const { wishlistItems } = useWishlist();

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="w-full pt-12 pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto min-h-[70vh]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative mt-12"
            >
                <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-widest mb-4 uppercase text-[var(--text-primary)]">Curated For You</h1>
                <p className="text-sm font-light tracking-widest opacity-80 uppercase text-[var(--text-primary)]">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Piece' : 'Pieces'} Saved
                </p>
                <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-12 h-0.5 bg-accent"></div>
            </motion.div>

            {wishlistItems.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-24 glass border border-[var(--surface-border)] rounded-3xl miami-shadow"
                >
                    <div className="w-20 h-20 bg-[var(--surface-color)] rounded-full flex items-center justify-center shadow-lg shadow-premium mb-6 relative">
                        <Heart size={32} className="text-accent" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-[var(--bg-color)] border border-[var(--surface-border)] rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">0</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[var(--text-primary)] mb-3 text-center">Your Wishlist is Empty</h2>
                    <p className="opacity-80 font-light mb-8 max-w-md text-center text-sm text-[var(--text-primary)]">
                        Explore our exclusive collections and save your favorite luxurious pieces for later.
                    </p>
                    <Link to="/collections/all" className="btn-primary px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors rounded-xl shadow-premium">
                        Discover Collection
                    </Link>
                </motion.div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
                >
                    <AnimatePresence>
                        {wishlistItems.map(product => (
                            <motion.div
                                key={product.id || product._id}
                                variants={fadeInUp}
                                layout
                                initial="hidden"
                                animate="show"
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative group"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
};

export default Wishlist;
