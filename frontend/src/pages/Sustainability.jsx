import React from 'react';

const Sustainability = () => {
    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4 text-center">
            <div className="mb-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Sustainability</h1>
                <p className="text-sm text-primary font-light">Our commitment to clearly envisioning a better future.</p>
            </div>

            <div className="space-y-12 text-left">
                <section>
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface pb-2">Ethical Sourcing</h2>
                    <p className="text-primary font-light leading-relaxed">
                        At EYESTYLE, luxury and responsibility go hand in hand. We partner directly with family-owned Italian acetate manufacturers who utilize bio-based plasticizers derived from renewable sources like cotton seed and wood pulp, significantly reducing our reliance on fossil fuels.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface pb-2">Waste Reduction</h2>
                    <p className="text-primary font-light leading-relaxed">
                        The traditional eyewear manufacturing process can generate immense waste. Our workshops employ precision CNC milling and closed-loop water systems to minimize offcuts and water pollution. Any scrap metal from our titanium lines is 100% recycled back into the supply chain.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface pb-2">Eco-Conscious Packaging</h2>
                    <p className="text-primary font-light leading-relaxed">
                        Our protective cases are crafted from vegan leather alternatives and recycled microfiber. All shipping materials are fully biodegradable and sourced from FSC-certified forests, ensuring your new vision arrives without leaving a permanent mark on the earth.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Sustainability;
