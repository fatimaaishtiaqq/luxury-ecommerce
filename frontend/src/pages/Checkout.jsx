import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../utils/apiClient';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [shippingDetails, setShippingDetails] = useState({
        firstName: '', lastName: '', address: '', city: '', postalCode: '', country: ''
    });

    const redirectAttempted = useRef(false);

    useEffect(() => {
        if (redirectAttempted.current) return;

        const storedUser = localStorage.getItem('lux_user');
        if (!storedUser) {
            redirectAttempted.current = true;
            showToast('Please sign in or register to securely complete your order.', 'error');
            navigate('/account', { state: { from: '/checkout' } });
            return;
        }
        if (cartItems.length === 0) {
            redirectAttempted.current = true;
            showToast('Your cart is empty. Add items before checkout.', 'error');
            navigate('/cart');
        }
    }, [navigate, showToast, cartItems.length]);

    const shippingCost = cartTotal > 0 ? 15.00 : 0;
    const taxes = cartTotal * 0.10; // 10% tax
    const grandTotal = cartTotal + shippingCost + taxes;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        if (!shippingDetails.firstName || !shippingDetails.address || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country) {
            showToast('Please fill out all required shipping details', 'error');
            return;
        }

        const storedUser = localStorage.getItem('lux_user');
        const user = storedUser ? JSON.parse(storedUser) : null;
        if (!user || !user.token) {
            showToast('Please log in to place an order', 'error');
            navigate('/account', { state: { from: '/checkout' } });
            return;
        }

        const paymentInput = document.querySelector('input[name="payment"]:checked');
        const paymentMethod = paymentInput ? paymentInput.value : 'Credit Card';

        const orderItems = cartItems.map(item => ({
            name: item.name,
            qty: item.quantity,
            image: (Array.isArray(item.images) && item.images[0]) ? item.images[0] : (item.image || '/images/sample.jpg'),
            price: item.price,
            product: item.id || item._id,
            variations: item.variations || {}
        }));

        const orderData = {
            orderItems,
            shippingAddress: {
                address: shippingDetails.address,
                city: shippingDetails.city,
                postalCode: shippingDetails.postalCode,
                country: shippingDetails.country
            },
            paymentMethod,
            itemsPrice: cartTotal,
            taxPrice: taxes,
            shippingPrice: shippingCost,
            totalPrice: grandTotal
        };

        try {
            setIsSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                clearCart();
                showToast('Order placed successfully!', 'success');
                navigate('/orders');
            } else {
                const data = await res.json();
                showToast(data.message || 'Failed to place order', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Server error during checkout', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const shouldRedirect = !localStorage.getItem('lux_user') || cartItems.length === 0;
    if (shouldRedirect) {
        return (
            <div className="w-full pt-10 mb-20 min-h-[60vh] px-4 text-[var(--text-primary)] flex items-center justify-center">
                <p className="text-sm opacity-80">Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] px-4 text-[var(--text-primary)]">
            <div className="text-center mb-10 mt-8">
                <h1 className="text-2xl font-serif font-bold tracking-widest mb-2 uppercase">SECURE CHECKOUT</h1>
                <p className="text-sm opacity-80 font-light">Complete your order</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">

                {/* Checkout Form */}
                <div className="flex-1 space-y-10">

                    {/* Shipping Address */}
                    <div className="bg-[var(--color-bg-section)] p-8 rounded-none border border-[var(--surface-border)]">
                        <h2 className="text-sm font-bold tracking-widest uppercase border-b border-[var(--surface-border)] pb-3 mb-6">1. Shipping Address</h2>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required name="firstName" value={shippingDetails.firstName} onChange={handleChange} type="text" placeholder="First Name" className="border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                            <input required name="lastName" value={shippingDetails.lastName} onChange={handleChange} type="text" placeholder="Last Name" className="border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                            <input required name="address" value={shippingDetails.address} onChange={handleChange} type="text" placeholder="Address" className="col-span-1 md:col-span-2 border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                            <input required name="city" value={shippingDetails.city} onChange={handleChange} type="text" placeholder="City" className="border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                            <input required name="postalCode" value={shippingDetails.postalCode} onChange={handleChange} type="text" placeholder="Postal Code" className="border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                            <input required name="country" value={shippingDetails.country} onChange={handleChange} type="text" placeholder="Country" className="col-span-1 md:col-span-2 border border-[var(--surface-border)] px-4 py-3 text-sm outline-none focus:border-accent bg-[var(--card-bg)] transition-colors rounded-sm" />
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-[var(--color-bg-section)] p-8 rounded-none border border-[var(--surface-border)]">
                        <h2 className="text-sm font-sans tracking-[0.2em] font-medium uppercase mb-6 mt-12 pb-2 border-b border-[var(--surface-border)] text-[var(--text-primary)]">PAYMENT METHOD</h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 border border-[var(--surface-border)] p-4 cursor-pointer hover:border-accent transition-colors bg-[var(--card-bg)] rounded-sm">
                                <input type="radio" value="Credit Card" name="payment" className="accent-accent w-4 h-4" defaultChecked />
                                <span className="font-sans text-sm tracking-wide text-[var(--text-primary)] font-medium">Credit Card</span>
                            </label>
                            <label className="flex items-center gap-3 border border-[var(--surface-border)] p-4 cursor-pointer hover:border-accent transition-colors bg-[var(--card-bg)] rounded-sm">
                                <input type="radio" value="PayPal" name="payment" className="accent-accent w-4 h-4" />
                                <span className="font-sans text-sm tracking-wide text-[var(--text-primary)] font-medium">PayPal</span>
                            </label>
                            <label className="flex items-center gap-3 border border-[var(--surface-border)] p-4 cursor-pointer hover:border-accent transition-colors bg-[var(--card-bg)] rounded-sm">
                                <input type="radio" value="COD" name="payment" className="accent-accent w-4 h-4" />
                                <span className="text-sm tracking-wide text-[var(--text-primary)]">COD (Cash On Delivery)</span>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-[var(--color-bg-section)] p-8 border border-[var(--surface-border)] sticky top-28 rounded-none">
                        <h2 className="font-serif text-lg font-bold tracking-widest uppercase border-b border-[var(--surface-border)] pb-3 mb-5">Order Summary</h2>

                        {/* Displaying static mock subtotal matching cart mock */}
                        <div className="space-y-4 text-sm text-[var(--text-primary)] mb-6">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                                    <span className="font-medium">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            {cartItems.length === 0 && (
                                <div className="opacity-60 italic">Cart is empty</div>
                            )}

                            <div className="border-t border-[var(--surface-border)] my-4"></div>
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="font-medium">${shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes</span>
                                <span className="font-medium">${taxes.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="border-t border-[var(--surface-border)] pt-4 mb-6 flex justify-between items-end">
                            <span className="font-bold uppercase tracking-widest">Total</span>
                            <span className="font-sans text-xl font-bold text-accent">${grandTotal.toFixed(2)}</span>
                        </div>

                        <button onClick={handlePlaceOrder} disabled={isSubmitting} className={`block w-full btn-primary py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors rounded-sm ${isSubmitting ? 'opacity-70' : ''}`}>
                            {isSubmitting ? 'PROCESSING...' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
