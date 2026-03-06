import React from 'react';

const Shipping = () => {
    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Shipping & Returns</h1>
                <p className="text-sm text-primary font-light">Everything you need to know about delivery and exchanges.</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface pb-2">Shipping Information</h2>
                    <ul className="space-y-4 text-primary font-light">
                        <li><strong>Standard Shipping:</strong> Free on orders over $150. Delivery within 3-5 business days.</li>
                        <li><strong>Express Shipping:</strong> $15 flat rate. Delivery within 1-2 business days.</li>
                        <li><strong>International Shipping:</strong> Calculated at checkout based on destination. Average delivery times range from 7-14 business days.</li>
                    </ul>
                    <p className="mt-4 text-sm text-primary">All orders are processed within 24 hours. You will receive a tracking link via email once your order has dispatched.</p>
                </section>

                <section>
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface pb-2">Returns & Exchanges</h2>
                    <p className="text-primary font-light mb-4 leading-relaxed">
                        We want you to be completely satisfied with your EYESTYLE purchase. If for any reason you are not, we gladly accept returns of unworn, unadjusted merchandise in its original condition and packaging within 30 days of delivery.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-primary font-light text-sm">
                        <li>Items must include all original packaging, cases, and cleaning cloths.</li>
                        <li>A prepaid return label is included with all domestic orders.</li>
                        <li>Refunds are issued to the original form of payment within 5-7 business days of processing your return.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default Shipping;
