import React from 'react';

const FAQ = () => {
    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4 text-[var(--text-primary)]">
            <div className="text-center mb-12 mt-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Frequently Asked Questions</h1>
                <p className="text-sm opacity-80 font-light">Find answers to common questions about our products and services.</p>
            </div>

            <div className="space-y-6">
                <div className="glass p-6 border border-[var(--surface-border)] rounded-2xl">
                    <h3 className="text-lg font-bold mb-2">What materials are your frames made of?</h3>
                    <p className="opacity-80 text-sm leading-relaxed">We use premium materials including handcrafted Italian acetate, ultra-lightweight titanium, and durable metal alloys to ensure maximum comfort and longevity.</p>
                </div>
                <div className="glass p-6 border border-[var(--surface-border)] rounded-2xl">
                    <h3 className="text-lg font-bold mb-2">Do you offer prescription lenses?</h3>
                    <p className="opacity-80 text-sm leading-relaxed">Currently, we offer standard fashion lenses, UV-protective sunglasses, and blue light blocking lenses. We are working on adding prescription lens services in the future.</p>
                </div>
                <div className="glass p-6 border border-[var(--surface-border)] rounded-2xl">
                    <h3 className="text-lg font-bold mb-2">How do I know my frame size?</h3>
                    <p className="opacity-80 text-sm leading-relaxed">Please refer to our Frame Size Guide to learn how to measure your face and find the perfect fit. Most of our frames come in Standard fit, which accommodates most face shapes.</p>
                </div>
                <div className="glass p-6 border border-[var(--surface-border)] rounded-2xl">
                    <h3 className="text-lg font-bold mb-2">What is your return policy?</h3>
                    <p className="opacity-80 text-sm leading-relaxed">We offer a 30-day return policy for unused frames in their original packaging. Please visit our Shipping & Returns page for detailed instructions.</p>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
