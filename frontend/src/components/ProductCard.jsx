import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.variations?.length > 0) {
            showToast('Please select options on the product page', 'info');
            navigate(`/product/${product._id || product.id}`);
            return;
        }
        addToCart(product, 1, {});
        showToast('Added to cart');
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        const wasInWishlist = isInWishlist(product.id || product._id);
        toggleWishlist(product);

        if (wasInWishlist) {
            showToast('Removed from wishlist');
        } else {
            showToast('Added to wishlist');
        }
    };

    return (
        <motion.div
            className="group relative flex flex-col w-full card-premium overflow-hidden border border-[var(--surface-border)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="relative overflow-hidden aspect-[3/4] bg-[var(--surface-color)] cursor-pointer min-h-0">
                <Link to={`/product/${product._id || product.id}`} className="block w-full h-full">
                    <motion.img
                        src={(() => {
                            if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) return product.image || '/images/sample.jpg';
                            const imgPath = product.images[0];

                            if (!imgPath || typeof imgPath !== 'string') return product.image || '/images/sample.jpg';
                            if (imgPath.startsWith('http') || imgPath.startsWith('/images/')) return imgPath;

                            const pathParts = imgPath.replace(/\\/g, '/').split('/');
                            const fileName = pathParts[pathParts.length - 1];
                            const cleanPath = `uploads/${fileName}`;

                            return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${cleanPath}`;
                        })()}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover aspect-[3/4] origin-center"
                        animate={{ scale: isHovered ? 1.03 : 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                </Link>

                <button
                    onClick={handleToggleWishlist}
                    className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-premium ${isInWishlist(product.id || product._id) ? 'bg-[var(--bg-color)] text-accent' : 'bg-[var(--bg-color)] opacity-80 text-[var(--text-primary)] hover:opacity-100 hover:text-accent'}`}
                >
                    <Heart size={16} fill={isInWishlist(product.id || product._id) ? "currentColor" : "none"} stroke="currentColor" />
                </button>

                {/* Quick Add Button */}
                <motion.div
                    className="absolute bottom-0 left-0 w-full"
                    initial={{ y: '100%' }}
                    animate={{ y: isHovered ? '0%' : '100%' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    <button
                        onClick={handleAddToCart}
                        className="w-full btn-cta py-4 text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 uppercase font-bold rounded-none"
                    >
                        ADD TO CART
                    </button>
                </motion.div>
            </div>

            {/* Product Details */}
            <div className="pt-5 pb-4 px-4 text-center">
                <Link to={`/product/${product._id || product.id}`}>
                    <h3 className="font-serif text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-wider truncate mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="font-sans font-medium opacity-80 text-[var(--text-primary)] text-[13px] mt-2 tracking-wide">
                    ${product.price ? product.price.toFixed(2) : '0.00'}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
