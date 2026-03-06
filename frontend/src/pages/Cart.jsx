import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();

    const shipping = cartSubtotal > 0 ? 15.00 : 0;
    const total = cartSubtotal + shipping;

    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] px-4 sm:px-6 lg:px-8 text-[var(--text-primary)] max-w-6xl mx-auto">
            <div className="text-center mb-8 mt-8">
                <h1 className="text-2xl font-serif font-bold tracking-widest mb-2 uppercase">SHOPPING BAG</h1>
                <p className="text-xs opacity-80">{cartItems.length} ITEM{cartItems.length !== 1 && 'S'}</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-80 border-t border-b border-[var(--surface-border)]">
                    <ShoppingBag size={48} className="mb-6 opacity-30" />
                    <p className="text-lg mb-6 text-[var(--text-primary)]">Your shopping bag is empty.</p>
                    <Link to="/" className="btn-primary px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors rounded-sm">
                        CONTINUE SHOPPING
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="hidden border-b border-[var(--surface-border)] pb-4 mb-6 md:grid grid-cols-12 text-xs font-bold tracking-widest uppercase opacity-80">
                            <div className="col-span-6">Product</div>
                            <div className="col-span-2 text-center">Price</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>

                        <div className="space-y-8">
                            {cartItems.map(item => (
                                <div key={item.variationId || `${item._id || item.id}-fallback`} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-[var(--surface-border)] pb-8">
                                    {/* Product */}
                                    <div className="col-span-6 flex gap-4 items-center">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-none" />
                                        <div>
                                            <Link to={`/product/${item._id || item.id}`} className="font-serif font-bold text-base hover:text-[var(--color-electric-blue)] transition-colors">
                                                {item.name}
                                            </Link>

                                            {item.variations && Object.keys(item.variations).length > 0 ? (
                                                <div className="mt-2 flex flex-col gap-1">
                                                    {Object.entries(item.variations).map(([vName, vOption]) => (
                                                        <p key={vName} className="text-xs opacity-70 uppercase tracking-widest"><span className="font-semibold text-[var(--text-primary)]">{vName}:</span> {vOption}</p>
                                                    ))}
                                                </div>
                                            ) : item.size ? (
                                                <p className="text-sm opacity-70 mt-1 uppercase tracking-wider">Size: {item.size}</p>
                                            ) : null}

                                            <button
                                                onClick={() => removeFromCart(item._id || item.id, item.variations || {})}
                                                className="text-xs opacity-60 mt-3 flex items-center gap-1 hover:text-[var(--color-electric-blue)] hover:opacity-100 transition-colors uppercase tracking-widest"
                                            >
                                                <Trash2 size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-center hidden md:block font-medium">
                                        ${item.price?.toFixed(2) || '0.00'}
                                    </div>

                                    {/* Quantity */}
                                    <div className="col-span-2 flex justify-center">
                                        <div className="flex border border-[var(--surface-border)] items-center justify-between w-24 h-10 px-3 bg-transparent rounded-sm">
                                            <button type="button" onClick={() => updateQuantity(item._id || item.id, item.variations || {}, item.quantity - 1)} disabled={item.quantity <= 1} className="opacity-60 hover:text-[var(--text-primary)] hover:opacity-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">-</button>
                                            <span className="font-medium text-sm">{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item._id || item.id, item.variations || {}, item.quantity + 1)} disabled={item.countInStock != null && item.quantity >= item.countInStock} className="opacity-60 hover:text-[var(--text-primary)] hover:opacity-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">+</button>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="col-span-2 text-right font-bold text-[var(--color-electric-blue)]">
                                        ${((item.price || 0) * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <div className="bg-[var(--color-bg-section)] p-8 border border-[var(--surface-border)] rounded-none">
                            <h2 className="font-serif text-lg font-bold tracking-widest uppercase border-b border-[var(--surface-border)] pb-3 mb-5">Order Summary</h2>

                            <div className="space-y-4 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="opacity-80">Subtotal</span>
                                    <span className="font-medium">${cartSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="opacity-80">Shipping</span>
                                    <span className="font-medium">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between opacity-60 text-xs">
                                    <span>Taxes</span>
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-[var(--surface-border)] pt-4 mb-8 flex justify-between items-end">
                                <span className="font-bold uppercase tracking-widest">Total</span>
                                <span className="font-sans text-xl font-bold text-[var(--color-electric-blue)]">${total.toFixed(2)}</span>
                            </div>

                            <Link to="/checkout" className="block w-full btn-primary py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors text-center rounded-sm">
                                PROCEED TO CHECKOUT
                            </Link>

                            <p className="text-xs opacity-60 mt-6 text-center leading-relaxed">
                                We accept all major credit cards and PayPal. Secure checkout guaranteed.
                            </p>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Cart;
