import React, { useState } from 'react';

const Contact = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Thank you for reaching out! We will get back to you shortly.');
        e.target.reset();
    };

    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4 text-[var(--text-primary)]">
            <div className="text-center mb-12 mt-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Contact Us</h1>
                <p className="text-sm opacity-80 font-light">We'd love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="p-8 glass border border-[var(--surface-border)] rounded-2xl shadow-premium">
                    <h2 className="text-xl font-serif font-bold mb-6">Get in Touch</h2>
                    <p className="opacity-80 font-light mb-8 leading-relaxed">
                        Whether you have a question about our collections, need styling advice, or require assistance with an order, our dedicated team is here to help.
                    </p>

                    <div className="space-y-4 text-sm">
                        <p><strong>Email:</strong> support@eyestyle.com</p>
                        <p><strong>Phone:</strong> +1 (800) 123-4567</p>
                        <p><strong>Hours:</strong> Mon-Fri, 9am - 6pm EST</p>
                    </div>
                </div>

                <div className="p-8 glass border border-[var(--surface-border)] rounded-2xl shadow-premium">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input required type="text" placeholder="Name" className="w-full border border-[var(--surface-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-accent transition-colors rounded-xl" />
                        <input required type="email" placeholder="Email" className="w-full border border-[var(--surface-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-accent transition-colors rounded-xl" />
                        <textarea required placeholder="Message" rows="5" className="w-full border border-[var(--surface-border)] bg-transparent px-4 py-3 text-sm outline-none focus:border-accent transition-colors rounded-xl"></textarea>
                        <button type="submit" className="w-full btn-primary py-4 text-xs font-bold tracking-widest uppercase transition-colors rounded-xl mt-2">
                            Send Message
                        </button>
                        {status && <p className="text-accent text-sm mt-4 text-center font-medium">{status}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
