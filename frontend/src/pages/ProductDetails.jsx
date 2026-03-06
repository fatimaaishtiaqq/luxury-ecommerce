import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronRight, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { getWithCache, API_BASE_URL } from '../utils/apiClient';
import { useTheme } from '../context/ThemeContext';


const normalizeImagePath = (data) => {
    let parsedImage = data.image || '/images/sample.jpg';

    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        let imgPath = data.images[0];

        // If the DB accidentally stored a File object or similar, try to salvage
        if (imgPath && typeof imgPath === 'object') {
            imgPath = imgPath.path || imgPath.url || imgPath.filename || '';
        }

        if (typeof imgPath === 'string' && imgPath.trim() !== '') {
            if (imgPath.startsWith('http') || imgPath.startsWith('/images/')) {
                parsedImage = imgPath;
            } else {
                const pathParts = imgPath.replace(/\\/g, '/').split('/');
                const fileName = pathParts[pathParts.length - 1];
                const base = API_BASE_URL || '';
                parsedImage = `${base}/uploads/${fileName}`;
            }
        }
    }

    return parsedImage;
};

const API_URL = API_BASE_URL || '';

const resolveVariationImage = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http') || imgPath.startsWith('/images/')) return imgPath;
    const pathParts = String(imgPath).replace(/\\/g, '/').split('/');
    const fileName = pathParts[pathParts.length - 1];
    return `${API_URL}/uploads/${fileName}`;
};

/** First image in product images array Ã¢â‚¬â€ used as default main image on load. No variation applied. */
const getDefaultProductImage = (data) => {
    if (!data) return '';
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        let imgPath = data.images[0];
        if (imgPath && typeof imgPath === 'object') imgPath = imgPath.path || imgPath.url || imgPath.filename || '';
        if (typeof imgPath === 'string' && imgPath.trim() !== '') return resolveVariationImage(imgPath);
    }
    return normalizeImagePath(data);
};



const ProductDetails = () => {
    const { id } = useParams();
    const variationSectionRef = React.useRef(null);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    /** Single source of truth for main image. Updated by: thumbnail click, variation change, or product load. */
    const [activeImage, setActiveImage] = useState(null);
    const [hoverThumbnail, setHoverThumbnail] = useState(null);
    const [showVariationRequiredModal, setShowVariationRequiredModal] = useState(false);

    const { addToCart, cartItems } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showToast } = useToast();
    const { theme } = useTheme(); // To fetch the current theme for dynamic heart coloring

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getWithCache(`/api/products/${id}`, { ttl: 0 });

                const fullProduct = {
                    ...data,
                    image: normalizeImagePath(data)
                };
                setProduct(fullProduct);
                setSelectedVariations({});
                setActiveImage(getDefaultProductImage(fullProduct));
                setQuantity(1);

                // Fetch all products once (cached) to find related ones
                const allData = await getWithCache('/api/products');
                const related = (allData.products || []).filter(p => {
                    if (p._id === fullProduct._id) return false;

                    const pCat = typeof p.category === 'object' ? String(p.category?._id || p.category?.name) : String(p.category || '');
                    const curCat = typeof fullProduct.category === 'object' ? String(fullProduct.category?._id || fullProduct.category?.name) : String(fullProduct.category || '');

                    return pCat && curCat && pCat === curCat;
                });
                setRelatedProducts(related);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Cap quantity when product has limited stock
    useEffect(() => {
        if (product?.countInStock == null) return;
        const max = Number(product.countInStock);
        if (max < 1) setQuantity(1);
        else setQuantity((q) => (q > max ? max : q));
    }, [product?.countInStock]);

    // When variation selection changes: update single source of truth (activeImage). Variation always wins over thumbnail.
    useEffect(() => {
        if (!product || !product.variations?.length) return;
        const defaultImg = getDefaultProductImage(product);
        let variationImageUrl = null;
        for (const v of product.variations) {
            if (!v.options?.length) continue;
            const selectedValue = selectedVariations[v.name];
            if (selectedValue == null) continue;
            const option = v.options.find(o => (typeof o === 'object' ? o.value : o) === selectedValue);
            if (option && typeof option === 'object' && option.image && String(option.image).trim()) {
                variationImageUrl = resolveVariationImage(option.image);
                break;
            }
        }
        setActiveImage(variationImageUrl != null ? variationImageUrl : defaultImg);
    }, [selectedVariations, product]);

    // Aggregate all product images for the carousel; first image is always default (same as getDefaultProductImage).
    const allImages = React.useMemo(() => {
        if (!product) return [];
        const seen = new Set();
        const ordered = [];
        const defaultImg = getDefaultProductImage(product);
        if (defaultImg && !seen.has(defaultImg)) {
            seen.add(defaultImg);
            ordered.push(defaultImg);
        }
        if (Array.isArray(product.images)) {
            product.images.forEach(img => {
                let path = img;
                if (path && typeof path === 'object') path = path.path || path.url || path.filename || '';
                if (typeof path === 'string' && path.trim() !== '') {
                    const resolved = resolveVariationImage(path);
                    if (resolved && !seen.has(resolved)) {
                        seen.add(resolved);
                        ordered.push(resolved);
                    }
                }
            });
        }
        if (product.image && !seen.has(product.image)) ordered.push(product.image);
        return ordered;
    }, [product]);

    // Single source of truth: activeImage. Hover shows thumbnail preview; when not hovering, show activeImage.
    const displayImage = hoverThumbnail || activeImage || getDefaultProductImage(product);

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-8 pb-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
                <p className="text-primary text-sm tracking-widest uppercase font-bold">Loading Product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-8 pb-10 text-[var(--text-primary)]">
                <h1 className="text-2xl font-serif font-bold tracking-wider mb-4">Product Not Found</h1>
                <Link to="/collections/all" className="underline hover:text-accent">Return to Collections</Link>
            </div>
        );
    }

    const hasAllVariationsSelected = () => {
        if (!product?.variations?.length) return true;
        return product.variations.every(
            (v) => selectedVariations[v.name] != null && String(selectedVariations[v.name]).trim() !== ''
        );
    };

    const handleAddToCart = () => {
        if (product.variations && product.variations.length > 0 && !hasAllVariationsSelected()) {
            setShowVariationRequiredModal(true);
            setTimeout(() => variationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            return;
        }
        const countInStock = product.countInStock != null ? Number(product.countInStock) : null;
        if (countInStock != null && countInStock < 1) {
            showToast('This product is currently out of stock', 'error');
            return;
        }
        const variationId = JSON.stringify(selectedVariations);
        const existingInCart = cartItems.find(
            (item) => (item._id || item.id) === (product._id || product.id) && (item.variationId || JSON.stringify(item.variations || {})) === variationId
        );
        const existingQty = existingInCart ? existingInCart.quantity : 0;
        const totalWanted = existingQty + quantity;
        if (countInStock != null && totalWanted > countInStock) {
            showToast(`Only ${countInStock} in stock. You have ${existingQty} in cart.`, 'error');
            return;
        }
        addToCart(product, quantity, selectedVariations);
        showToast(`Added ${quantity} to cart`);
    };

    const handleToggleWishlist = () => {
        const wasInWishlist = isInWishlist(product.id || product._id);
        toggleWishlist(product);

        if (wasInWishlist) {
            showToast('Removed from wishlist');
        } else {
            showToast('Added to wishlist', 'success');
        }
    };

    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="w-full mb-20 text-[var(--text-primary)]">
            {/* Mandatory variation modal */}
            <AnimatePresence>
                {showVariationRequiredModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                        onClick={() => setShowVariationRequiredModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            className="bg-[var(--card-bg)] border border-[var(--surface-border)] rounded-sm shadow-xl max-w-sm w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <p className="text-[var(--text-primary)] font-sans text-sm mb-6 text-center">
                                Please select a variation before proceeding.
                            </p>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => setShowVariationRequiredModal(false)}
                                    className="px-6 py-2.5 text-[11px] font-bold tracking-widest uppercase bg-[var(--text-primary)] text-[var(--bg-color)] rounded-sm hover:opacity-90 transition-opacity"
                                >
                                    OK
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Minimalist Top Breadcrumb Area */}
            <div className="pt-2 sm:pt-4 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-b border-[var(--surface-border)] mb-8 mt-2 sm:mt-6">
                <div className="flex items-center text-[10px] tracking-widest uppercase font-medium opacity-80">
                    <Link to="/" className="hover:text-accent transition-colors">HOME</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <Link to={`/collections/${String(product.category?.slug || product.category || 'all')}`} className="hover:text-accent transition-colors">{String(product.category?.name || product.category || 'Collection')}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="font-bold opacity-100">{String(product.name)}</span>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left: Image block Ã¢â‚¬â€ main image fixed aspect 3/4; thumbnail carousel same height, scrolls inside (never stretches page) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-3 lg:sticky lg:top-24 max-w-md mx-auto w-full product-detail-image-block"
                    >
                        {/* Thumbnails: on desktop same height as main image, overflow-y auto; on mobile horizontal scroll */}
                        <div className="product-detail-thumbs flex md:flex-col gap-2 w-full md:w-20 shrink-0 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-2 md:pb-0 hide-scrollbar">
                            {allImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => { setActiveImage(img); setHoverThumbnail(null); }}
                                    onMouseEnter={() => setHoverThumbnail(img)}
                                    onMouseLeave={() => setHoverThumbnail(null)}
                                    className={`product-detail-thumb w-14 h-[4.375rem] md:w-full md:flex-shrink-0 border cursor-pointer rounded-sm overflow-hidden bg-[var(--card-bg)] transition-all ${displayImage === img ? 'border-[var(--text-primary)] opacity-100' : 'border-[var(--surface-border)] opacity-60 hover:opacity-100'}`}
                                    style={{ aspectRatio: '3/4' }}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt={`thumb-${idx}`} />
                                </div>
                            ))}
                        </div>

                        {/* Main image: square container, object-contain so full image is always visible */}
                        <div className="product-detail-main flex-1 w-full min-w-0 bg-[var(--surface-color)] relative overflow-hidden group border border-[var(--surface-border)] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={displayImage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    src={displayImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            </AnimatePresence>
                            {product.countInStock < 10 && product.countInStock > 0 && (
                                <div className="absolute top-4 right-4 bg-[var(--bg-color)] px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold text-[var(--text-primary)] border border-[var(--surface-border)] rounded-sm">
                                    Few Left - {product.countInStock}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Right: Flat Typography Info Area (Col Span 7 instead of 5 for more breathing room) */}
                    <div className="lg:col-span-7 flex flex-col justify-center py-2 lg:py-6">
                        <motion.div variants={fadeInUp} initial="hidden" animate="show">
                            <h1 className="text-2xl lg:text-4xl font-serif font-bold tracking-tight mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-8">
                                <p className="text-xl font-sans font-medium text-accent">
                                    ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                                </p>
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-80">
                                    In Stock
                                </span>
                            </div>
                        </motion.div>

                        <hr className="border-[var(--surface-border)] mb-8" />

                        {/* Dynamic Variations Block */}
                        {(product.variations && product.variations.length > 0) && (
                            <div ref={variationSectionRef} className={`mb-10 transition-shadow duration-200 ${showVariationRequiredModal ? 'ring-2 ring-amber-500/50 rounded-sm p-1 -m-1' : ''}`}>
                                {product.variations.map((variation, vIndex) => (
                                    <div key={vIndex} className="mb-8">
                                        <div className="mb-4 flex justify-between items-center">
                                            <span className="text-xs font-bold tracking-widest uppercase">
                                                Select {variation.name}: <span className="opacity-80 ml-2">{selectedVariations[variation.name] || 'None'}</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {variation.options.map((option, oIndex) => {
                                                const optionValue = typeof option === 'object' && option != null ? option.value : option;
                                                const isSelected = selectedVariations[variation.name] === optionValue;
                                                return (
                                                    <button
                                                        key={oIndex}
                                                        type="button"
                                                        onClick={() => setSelectedVariations(prev => ({ ...prev, [variation.name]: optionValue }))}
                                                        className={`px-4 h-10 flex items-center justify-center font-bold text-[11px] uppercase tracking-widest transition-colors border rounded-sm ${isSelected
                                                            ? 'bg-[var(--text-primary)] text-[var(--bg-color)] border-[var(--text-primary)]'
                                                            : 'bg-transparent text-[var(--text-primary)] border-[var(--surface-border)] hover:border-[var(--text-primary)]'
                                                            }`}
                                                    >
                                                        {optionValue}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 mb-8 relative z-10 text-[var(--text-primary)]">
                            {/* Quantity */}
                            <div className="flex border border-[var(--surface-border)] items-center justify-between w-full sm:w-28 h-12 px-4 bg-transparent rounded-sm">
                                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="opacity-60 hover:opacity-100 hover:text-accent transition-colors">-</button>
                                <span className="font-bold text-sm text-[var(--text-primary)]">{quantity}</span>
                                <button type="button" onClick={() => setQuantity(product.countInStock != null ? Math.min(product.countInStock, quantity + 1) : quantity + 1)} className="opacity-60 hover:opacity-100 hover:text-accent transition-colors">+</button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 btn-primary h-12 text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center rounded-sm"
                            >
                                ADD TO CART
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={handleToggleWishlist}
                                className={`w-12 h-12 border flex items-center justify-center transition-colors rounded-sm ${isInWishlist(product.id || product._id)
                                    ? `border-[var(--surface-border)] bg-[var(--surface-color)] ${theme === 'dark' ? 'text-orange-500' : 'text-red-500'}`
                                    : 'border-[var(--surface-border)] hover:border-accent text-[var(--text-primary)]'
                                    }`}
                            >
                                <Heart size={18} className={isInWishlist(product.id || product._id) ? "fill-current" : ""} />
                            </button>
                        </div>

                        {/* Trust Badges - Clean Text Only Approach */}
                        <div className="py-6 border-y border-[var(--surface-border)] grid grid-cols-3 gap-6 mb-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-primary)]">Warranty</span>
                                <span className="text-xs opacity-70 font-sans">2 Years Included</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-primary)]">Shipping</span>
                                <span className="text-xs opacity-70 font-sans">Free Express</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-primary)]">Returns</span>
                                <span className="text-xs opacity-70 font-sans">14-Day Easy</span>
                            </div>
                        </div>

                        {/* Flat Minimalist Tabs */}
                        <div className="mb-4">
                            <div className="flex gap-8 mb-6 border-b border-[var(--surface-border)]">
                                {['description', 'details', 'shipping'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors relative ${activeTab === tab ? 'text-accent' : 'opacity-60 hover:opacity-100 hover:text-accent'}`}
                                    >
                                        {tab === 'details' ? 'Details & Care' : tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="text-sm opacity-90 font-sans leading-relaxed min-h-[120px]">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div key="description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <p>{product.description ?? 'No description available.'}</p>
                                        </motion.div>
                                    )}
                                    {activeTab === 'details' && (
                                        <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <ul className="space-y-3">
                                                {product.details && product.details.length > 0
                                                    ? product.details.map((detail, idx) => (
                                                        <li key={idx} className="flex items-start gap-4">
                                                            <div className="w-[3px] h-[3px] bg-accent mt-2 shrink-0 rounded-full"></div>
                                                            <span>{String(detail)}</span>
                                                        </li>
                                                    ))
                                                    : <li>No additional details provided.</li>}
                                            </ul>
                                        </motion.div>
                                    )}
                                    {activeTab === 'shipping' && (
                                        <motion.div key="shipping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <p className="mb-2"><strong className="font-bold">Premium Shipping:</strong> Delivered within 2-4 business days.</p>
                                            <p className="opacity-70">Enjoy complimentary returns for store credit within 14 days of purchase. Items must be unworn and in original packaging.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Social Share Minimal */}
                        <div className="mt-8">
                            <button
                                onClick={async () => {
                                    if (navigator.share) {
                                        try {
                                            await navigator.share({
                                                title: product.name,
                                                text: `Check out ${product.name} at Eyestyle Luxury`,
                                                url: window.location.href,
                                            });
                                        } catch (error) {
                                            console.log('Error sharing', error);
                                        }
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        showToast('Link copied to clipboard', 'success');
                                    }
                                }}
                                className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest hover:text-accent transition-colors"
                            >
                                <Share2 size={14} /> <span>Share Item</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products - Clean Grid */}
                <div className="mt-32 w-full pb-20">
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--surface-border)] pb-4 gap-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold tracking-widest uppercase">More From This Collection</h2>
                        </div>
                        <Link to="/collections/all" className="text-[11px] font-bold tracking-widest uppercase text-accent transition-colors pb-1">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.slice(0, 4).map((relatedProduct) => (
                                <ProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
                            ))
                        ) : (
                            <div className="col-span-full border border-[var(--surface-border)] p-16 text-center">
                                <p className="uppercase text-xs tracking-widest font-bold opacity-70">No related products found at this time.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
