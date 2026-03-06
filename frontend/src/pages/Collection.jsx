import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';
import { getWithCache } from '../utils/apiClient';



const Collection = () => {
    const { category } = useParams();
    const location = useLocation();

    // Sort and basic toggles
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('recommended');

    // Active Filters
    const [subCategories, setSubCategories] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [priceRange, setPriceRange] = useState('');

    // Temporary Filters (for Modal before Apply)
    const [tempSubcategories, setTempSubcategories] = useState([]);
    const [tempFabrics, setTempFabrics] = useState([]);
    const [tempPriceRange, setTempPriceRange] = useState('');

    // On location search parse url params
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    const querySub = searchParams.get('sub');
    const queryCategoryId = searchParams.get('category');

    useEffect(() => {
        if (querySub && !subCategories.includes(querySub)) {
            setSubCategories([querySub]);
        }
    }, [querySub]);

    // Apply Filters from Temp State
    const handleApplyFilters = () => {
        setSubCategories(tempSubcategories);
        setFabrics(tempFabrics);
        setPriceRange(tempPriceRange);
        setShowFilters(false);
    };

    // Open Filters and copy Active to Temp
    const handleOpenFilters = () => {
        setTempSubcategories([...subCategories]);
        setTempFabrics([...fabrics]);
        setTempPriceRange(priceRange);
        setShowFilters(true);
    };

    // Toggle temporary array items
    const handleTempToggle = (state, setState, value) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
    };

    // Remove single active filter (Chip)
    const removeSubcategoryFilter = (val) => setSubCategories(subCategories.filter(s => s !== val));
    const removeFabricFilter = (val) => setFabrics(fabrics.filter(f => f !== val));
    const removePriceFilter = () => setPriceRange('');

    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const [prodData, catData] = await Promise.all([
                    getWithCache('/api/products'),
                    getWithCache('/api/categories')
                ]);
                setAllProducts(prodData.products || []);
                setAllCategories(catData || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsAndCategories();
    }, []);

    // Derive subcategories for the filter UI
    let pageSubCategories = [];
    if (category && category !== 'all') {
        const catLower = category.toLowerCase();
        const targetCat = allCategories.find(c => c.slug === catLower);
        if (targetCat) {
            pageSubCategories = allCategories.filter(c => c.parent === targetCat._id || c.parent?._id === targetCat._id);
        }
    } else {
        pageSubCategories = allCategories.filter(c => c.parent);
    }

    // Filter logic based on fetched live products
    let filteredProducts = [...allProducts];

    // Filter by major category route param (/collections/:category)
    if (category && category !== 'all') {
        const catLower = category.toLowerCase();

        // Find the category object that matches the URL slug
        const targetCategory = allCategories.find(c => c.slug === catLower);

        if (targetCategory) {
            filteredProducts = filteredProducts.filter(p => {
                // If product's main category matches, it's valid
                const pCatId = typeof p.category === 'object' ? String(p.category?._id) : String(p.category);
                if (pCatId === String(targetCategory._id)) return true;

                // Or if product's subcategory is a child of the target category
                const pSubCatId = typeof p.subcategory === 'object' ? String(p.subcategory?._id) : String(p.subcategory);
                if (pSubCatId) {
                    const subCatObj = allCategories.find(c => String(c._id) === pSubCatId);
                    if (subCatObj && (String(subCatObj.parent) === String(targetCategory._id) || String(subCatObj.parent?._id) === String(targetCategory._id))) {
                        return true;
                    }
                }
                return false;
            });
        } else {
            // Fallback: search by name/brand if category slug not found in DB
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(catLower) || (p.brand && p.brand.toLowerCase() === catLower)
            );
        }
    }

    // Filter by subcategory query param from Navbar (?category=sub_id)
    if (queryCategoryId) {
        filteredProducts = filteredProducts.filter(p => {
            const pCatId = typeof p.category === 'object' ? String(p.category?._id) : String(p.category);
            const pSubCatId = typeof p.subcategory === 'object' ? String(p.subcategory?._id) : String(p.subcategory);
            return pCatId === queryCategoryId || pSubCatId === queryCategoryId;
        });
    }

    // Filter by search query
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by active filter arrays
    if (subCategories.length > 0) {
        const lowerSubs = subCategories.map(s => s.toLowerCase());
        filteredProducts = filteredProducts.filter(p => {
            // Find the subcategory object for this product
            const pSubCatId = typeof p.subcategory === 'object' ? String(p.subcategory?._id) : String(p.subcategory);
            if (!pSubCatId) return false;

            const pSubCatObj = allCategories.find(c => String(c._id) === pSubCatId);

            // Check if its name matches our active filters
            return pSubCatObj && lowerSubs.includes(pSubCatObj.name.toLowerCase());
        });
    }
    if (fabrics.length > 0) {
        filteredProducts = filteredProducts.filter(p => p.fabric && fabrics.includes(p.fabric));
    }

    // Determine available global fabrics based on products from logic BEFORE fabrics filter applied
    // This allows the full list of materials to remain visible regardless of material checkboxes
    let baseProductsForFabrics = [...allProducts];
    if (category && category !== 'all') {
        const catLower = category.toLowerCase();
        const targetCategory = allCategories.find(c => c.slug === catLower);
        if (targetCategory) {
            baseProductsForFabrics = baseProductsForFabrics.filter(p => {
                const pCatId = typeof p.category === 'object' ? String(p.category?._id) : String(p.category);
                if (pCatId === String(targetCategory._id)) return true;
                const pSubCatId = typeof p.subcategory === 'object' ? String(p.subcategory?._id) : String(p.subcategory);
                if (pSubCatId) {
                    const subCatObj = allCategories.find(c => String(c._id) === pSubCatId);
                    if (subCatObj && (String(subCatObj.parent) === String(targetCategory._id) || String(subCatObj.parent?._id) === String(targetCategory._id))) return true;
                }
                return false;
            });
        }
    }
    const availableFabrics = [...new Set(baseProductsForFabrics.map(p => p.fabric).filter(Boolean))].sort();

    // Price range
    if (priceRange) {
        filteredProducts = filteredProducts.filter(p => {
            if (priceRange === 'under100') return p.price < 100;
            if (priceRange === '100to300') return p.price >= 100 && p.price <= 300;
            if (priceRange === 'over300') return p.price > 300;
            return true;
        });
    }

    // Sorting
    if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
        filteredProducts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    }

    const title = searchQuery ? `SEARCH: ${searchQuery}` : (category && category !== 'all' ? `${category.replace(/-/g, ' ').toUpperCase()}'S COLLECTION` : 'ALL COLLECTIONS');

    return (
        <div className="w-full flex-col flex mb-20 pt-8 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] min-h-screen">
            {/* Header */}
            <div className="text-center mb-10 pt-8 mt-12">
                <h1 className="text-4xl font-serif font-bold tracking-wider mb-4 uppercase text-[var(--text-primary)]">{title}</h1>
                <p className="opacity-80 font-light max-w-2xl mx-auto text-[var(--text-primary)]">Explore our curated selection of premium eyewear and exquisite frame designs.</p>
            </div>

            {/* Top Toolbar (Filters Button + Active Chips) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-[var(--surface-border)] pb-4">

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        className="flex items-center gap-2 btn-primary px-6 py-2 text-xs tracking-widest font-medium uppercase shadow-sm"
                        onClick={handleOpenFilters}
                    >
                        <Filter size={16} /> Filters
                    </button>

                    {/* Active Filter Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                        {subCategories.map(sub => (
                            <span key={sub} className="flex items-center gap-1.5 bg-[var(--color-bg-section)] border border-[var(--surface-border)] text-[var(--text-primary)] px-3 py-1 text-[11px] tracking-wider uppercase font-medium rounded-sm">
                                {sub}
                                <button onClick={() => removeSubcategoryFilter(sub)} className="hover:text-accent transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                        {fabrics.map(fab => (
                            <span key={fab} className="flex items-center gap-1.5 bg-[var(--color-bg-section)] border border-[var(--surface-border)] text-[var(--text-primary)] px-3 py-1 text-[11px] tracking-wider uppercase font-medium rounded-sm">
                                {fab}
                                <button onClick={() => removeFabricFilter(fab)} className="hover:text-accent transition-colors"><X size={12} /></button>
                            </span>
                        ))}
                        {priceRange && (
                            <span className="flex items-center gap-1.5 bg-[var(--color-bg-section)] border border-[var(--surface-border)] text-[var(--text-primary)] px-3 py-1 text-[11px] tracking-wider uppercase font-medium rounded-sm">
                                {priceRange === 'under100' ? '< $100' : priceRange === '100to300' ? '$100 - $300' : '> $300'}
                                <button onClick={removePriceFilter} className="hover:text-accent transition-colors"><X size={12} /></button>
                            </span>
                        )}

                        {/* Clear All Button if any filter active */}
                        {(subCategories.length > 0 || fabrics.length > 0 || priceRange) && (
                            <button
                                onClick={() => { setSubCategories([]); setFabrics([]); setPriceRange(''); }}
                                className="text-[11px] opacity-70 underline ml-2 hover:text-accent uppercase tracking-widest font-medium text-[var(--text-primary)]"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-3 self-end md:self-auto text-xs font-medium tracking-widest uppercase opacity-80 text-[var(--text-primary)]">
                    <span>Sort By:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent outline-none border-b border-[var(--surface-border)] py-1 cursor-pointer text-[var(--text-primary)] focus:border-accent transition-colors [&>option]:bg-[var(--bg-color)] [&>option]:text-[var(--text-primary)]"
                    >
                        <option value="recommended">Recommended</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest Arrivals</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div>
                <div className="mb-6 text-sm opacity-60 font-medium text-[var(--text-primary)]">
                    Showing {filteredProducts.length} results
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-8 lg:gap-y-12">
                    {filteredProducts.map((product) => (
                        <div key={product._id || product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-32 opacity-70 flex flex-col items-center text-[var(--text-primary)]">
                        <Filter size={48} className="mb-4" />
                        <h3 className="text-lg font-medium mb-2">No products found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>

            {/* Filter Modal Overlay */}
            {showFilters && (
                <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 transition-opacity">
                    <div className="w-full max-w-md bg-[var(--bg-color)] h-full border-l border-[var(--surface-border)] flex flex-col animate-slide-in-right text-[var(--text-primary)]">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--surface-border)]">
                            <h2 className="text-lg font-serif font-bold tracking-widest uppercase">Filters</h2>
                            <button onClick={() => setShowFilters(false)} className="hover:text-accent transition-colors rounded-full p-1 border border-transparent hover:border-[var(--surface-border)]">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
                            {/* Frame Shape */}
                            <div>
                                <h3 className="text-xs font-bold tracking-widest uppercase mb-5 border-b pb-2 border-[var(--surface-border)]">Subcategories</h3>
                                <ul className="space-y-4 text-sm font-medium opacity-80">
                                    {pageSubCategories.map(sub => (
                                        <li key={sub._id}>
                                            <label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={tempSubcategories.includes(sub.name)}
                                                    onChange={() => handleTempToggle(tempSubcategories, setTempSubcategories, sub.name)}
                                                    className="w-4 h-4 accent-accent"
                                                />
                                                {sub.name}
                                            </label>
                                        </li>
                                    ))}
                                    {pageSubCategories.length === 0 && (
                                        <li className="text-xs opacity-60 italic">No subcategories available.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Material */}
                            {availableFabrics.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-5 border-b pb-2 border-[var(--surface-border)]">Material</h3>
                                    <ul className="space-y-4 text-sm font-medium opacity-80">
                                        {availableFabrics.map(fab => (
                                            <li key={fab}>
                                                <label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={tempFabrics.includes(fab)}
                                                        onChange={() => handleTempToggle(tempFabrics, setTempFabrics, fab)}
                                                        className="w-4 h-4 accent-accent"
                                                    />
                                                    {fab}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Price */}
                            <div>
                                <h3 className="text-xs font-bold tracking-widest uppercase mb-5 border-b pb-2 border-[var(--surface-border)]">Price Range</h3>
                                <ul className="space-y-4 text-sm font-medium opacity-80">
                                    <li><label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors"><input type="radio" name="modalPrice" checked={tempPriceRange === 'under100'} onChange={() => setTempPriceRange('under100')} className="w-4 h-4 accent-accent" /> Under $100</label></li>
                                    <li><label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors"><input type="radio" name="modalPrice" checked={tempPriceRange === '100to300'} onChange={() => setTempPriceRange('100to300')} className="w-4 h-4 accent-accent" /> $100 - $300</label></li>
                                    <li><label className="flex items-center gap-3 cursor-pointer hover:text-accent transition-colors"><input type="radio" name="modalPrice" checked={tempPriceRange === 'over300'} onChange={() => setTempPriceRange('over300')} className="w-4 h-4 accent-accent" /> Over $300</label></li>
                                </ul>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-[var(--surface-border)] bg-[var(--color-bg-section)] flex flex-col gap-3">
                            <button
                                onClick={handleApplyFilters}
                                className="w-full btn-primary py-4 text-xs font-bold tracking-widest uppercase transition-colors shadow-sm"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => { setTempSubcategories([]); setTempFabrics([]); setTempPriceRange(''); }}
                                className="w-full bg-transparent border border-[var(--surface-border)] text-[var(--text-primary)] py-4 text-xs font-bold tracking-widest uppercase hover:text-accent hover:border-accent transition-colors"
                            >
                                Reset Selections
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collection;
