import React from 'react';

const SizeGuide = () => {
    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Frame Size Guide</h1>
                <p className="text-sm text-primary font-light">Find your perfect fit.</p>
            </div>

            <div className="space-y-8">
                <p className="text-primary font-light leading-relaxed text-center max-w-2xl mx-auto mb-12">
                    Understanding your frame size is essential for optimal comfort and clear vision. Most frames have three numbers printed on the inside of the temple arm (e.g., 50-20-145).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-surface p-6 bg-surface text-center">
                        <h3 className="font-bold text-sm tracking-widest uppercase mb-4 text-accent">Lens Width (e.g. 50)</h3>
                        <p className="text-primary text-sm font-light">The horizontal width of each lens at its widest point. Typically ranges from 40mm to 60mm.</p>
                    </div>
                    <div className="border border-surface p-6 bg-surface text-center">
                        <h3 className="font-bold text-sm tracking-widest uppercase mb-4 text-accent">Bridge Width (e.g. 20)</h3>
                        <p className="text-primary text-sm font-light">The distance between the two lenses. Typically ranges from 14mm to 24mm.</p>
                    </div>
                    <div className="border border-surface p-6 bg-surface text-center">
                        <h3 className="font-bold text-sm tracking-widest uppercase mb-4 text-accent">Temple Length (e.g. 145)</h3>
                        <p className="text-primary text-sm font-light">The length of the temple arm from the frame hinge to the tip. Typically ranges from 120mm to 150mm.</p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-xl font-serif font-bold mb-4 border-b border-surface inline-block pb-2">Our Standard Fit</h2>
                    <p className="text-primary font-light max-w-2xl mx-auto">
                        Unless otherwise specified as "Narrow" or "Wide", all EYESTYLE frames are designed with a "Standard" fit intent, engineered to comfortably flatter most face shapes and sizes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;
