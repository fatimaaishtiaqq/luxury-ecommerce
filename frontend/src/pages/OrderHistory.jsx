import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../utils/apiClient';

const OrderHistory = () => {
    const { showToast } = useToast();
    const storedUser = localStorage.getItem('lux_user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!user?.token) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Sort descending by created date
                    setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                } else {
                    showToast('Failed to load order history', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Server error', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, [user?.token, showToast]);

    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] text-[var(--text-primary)]">
            <div className="text-center mb-12 mt-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">ORDER HISTORY</h1>
                <p className="text-sm opacity-80 font-light">View and track your previous purchases</p>
            </div>

            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="text-center py-12 border border-[var(--surface-border)] bg-[var(--surface-color)] bg-opacity-50 glass opacity-80 italic rounded-2xl">
                        Loading your orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 border border-[var(--surface-border)] bg-[var(--surface-color)] bg-opacity-50 glass rounded-2xl shadow-premium">
                        <p className="opacity-80 mb-6">You haven't placed any orders yet.</p>
                        <Link to="/collections/all" className="btn-primary px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors inline-block mt-4 rounded-xl shadow-sm">
                            START SHOPPING
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="glass border border-[var(--surface-border)] shadow-premium rounded-2xl overflow-hidden">
                                <div className="bg-[var(--surface-color)] bg-opacity-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--surface-border)] gap-4">
                                    <div className="flex gap-8 text-sm">
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest uppercase opacity-70 mb-1">Order Placed</span>
                                            <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-bold tracking-widest uppercase opacity-70 mb-1">Total</span>
                                            <span className="font-medium text-accent">${order.totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="block text-xs font-bold tracking-widest uppercase opacity-70 mb-1">Order #</span>
                                        <span className="font-medium uppercase">{order._id.substring(18)}</span>
                                    </div>
                                </div>

                                <div className="px-6 py-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-serif font-bold text-lg">Status: <span className="text-accent uppercase tracking-wider">{order.status}</span></h3>
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--surface-border)] hover:border-accent text-[var(--text-primary)] px-6 py-3 transition-colors rounded-xl shadow-sm"
                                        >
                                            View Invoice
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {order.orderItems?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm border-b border-[var(--surface-border)] pb-4 last:border-0 last:pb-0">
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex gap-4 items-center">
                                                        <span className="font-medium opacity-80">{item.qty}x</span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    {item.variations && Object.keys(item.variations).length > 0 && (
                                                        <div className="flex flex-wrap gap-x-4 gap-y-0 text-xs opacity-70 uppercase tracking-widest">
                                                            {Object.entries(item.variations).map(([k, v]) => (
                                                                <span key={k}>{k}: {v}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium">${item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invoice Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white print:fixed print:inset-0 text-[var(--text-primary)]">
                    <div className="glass bg-[var(--bg-color)] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative rounded-3xl border border-[var(--surface-border)] shadow-premium print:max-w-full print:h-auto print:overflow-visible print:shadow-none print:bg-white print:text-black print:border-none">
                        <div className="flex justify-between items-center bg-[var(--surface-color)] bg-opacity-50 px-6 py-4 border-b border-[var(--surface-border)] sticky top-0 print:hidden z-10 backdrop-blur-md">
                            <h2 className="font-serif text-xl font-bold tracking-widest uppercase">Invoice #{selectedOrder._id.substring(18)}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="opacity-60 hover:opacity-100 hover:text-accent transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between mb-12">
                                <div>
                                    <h3 className="font-serif text-2xl font-bold tracking-widest mb-2">EYESTYLE</h3>
                                    <p className="text-sm opacity-80">123 Vision Way<br />New York, NY 10001<br />support@eyestyle.com</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Date</p>
                                    <p className="text-sm font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <table className="w-full text-sm mb-8">
                                <thead>
                                    <tr className="border-b border-[var(--surface-border)]">
                                        <th className="text-left font-bold uppercase tracking-widest py-3">Item</th>
                                        <th className="text-center font-bold uppercase tracking-widest py-3">Qty</th>
                                        <th className="text-right font-bold uppercase tracking-widest py-3">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems?.map((item, idx) => (
                                        <tr key={idx} className="border-b border-[var(--surface-border)]">
                                            <td className="py-4 font-medium">
                                                {item.name}
                                                {item.variations && Object.keys(item.variations).length > 0 && (
                                                    <div className="text-xs font-normal opacity-70 uppercase tracking-widest mt-1">
                                                        {Object.entries(item.variations).map(([k, v]) => `${k}: ${v}`).join(' Ã‚Â· ')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 text-center opacity-80">{item.qty}</td>
                                            <td className="py-4 text-right font-medium text-accent">${item.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-80">Subtotal</span>
                                        <span className="font-medium">${(selectedOrder.itemsPrice || (selectedOrder.totalPrice - selectedOrder.shippingPrice - selectedOrder.taxPrice)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-80">Shipping</span>
                                        <span className="font-medium">${(selectedOrder.shippingPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-80">Tax</span>
                                        <span className="font-medium">${(selectedOrder.taxPrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-3 border-t border-[var(--surface-border)]">
                                        <span>Total</span>
                                        <span className="text-accent">${(selectedOrder.totalPrice || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 text-center border-t border-[var(--surface-border)] pt-8 print:hidden">
                                <p className="text-sm opacity-80 italic">Thank you for shopping with EYESTYLE.</p>
                                <button onClick={() => window.print()} className="mt-6 border border-[var(--surface-border)] px-8 py-3 text-[11px] uppercase tracking-[0.2em] font-bold hover:border-accent hover:text-accent transition-colors rounded-xl shadow-sm">
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
