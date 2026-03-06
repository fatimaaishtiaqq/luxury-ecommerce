import React from 'react';

const About = () => {
    return (
        <div className="w-full mb-20 text-[var(--text-primary)]">
            {/* Hero Image */}
            <div className="relative w-full h-[60vh] mb-16 overflow-hidden mt-4">
                <img
                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1600&auto=format&fit=crop"
                    alt="Eyewear Craftsmanship"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <h1 className="text-white text-5xl md:text-6xl font-serif font-bold tracking-widest uppercase">Our Vision</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-sm font-bold tracking-[0.2em] mb-4 text-accent uppercase">The Story of EYESTYLE</h2>
                <p className="font-serif text-2xl md:text-3xl leading-relaxed mb-12">
                    "True elegance is clear vision combined with timeless design. Our journey began with a single frame and a passion for optical perfection."
                </p>

                <div className="opacity-80 font-light space-y-6 text-left leading-loose">
                    <p>
                        Founded with a passion for precise optics and high fashion, EYESTYLE has dedicated itself to curating the finest luxury eyewear. We believe that glasses are more than just a tool for sight; they are the defining accessory of your personal style. That is why we meticulously source premium materials like Italian acetate, pure titanium, and advanced lightweight alloys.
                    </p>
                    <p>
                        Our partner artisans dedicate countless hours to crafting flawless frames and polishing exquisite lenses, ensuring every pair offers unparalleled clarity and comfort. We are committed to delivering optical excellence that honors both traditional craftsmanship and the modern individual's lifestyle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center">
                    <div className="p-6 glass bg-[var(--surface-color)] bg-opacity-50 border border-[var(--surface-border)] rounded-2xl shadow-sm">
                        <h3 className="text-xl font-serif font-bold mb-3 tracking-wide">Craftsmanship</h3>
                        <p className="text-sm opacity-80">Every piece is masterfully created with an obsessive attention to detail.</p>
                    </div>
                    <div className="p-6 glass bg-[var(--surface-color)] bg-opacity-50 border border-[var(--surface-border)] rounded-2xl shadow-sm">
                        <h3 className="text-xl font-serif font-bold mb-3 tracking-wide">Quality</h3>
                        <p className="text-sm opacity-80">We source only the rarest and finest raw materials from around the globe.</p>
                    </div>
                    <div className="p-6 glass bg-[var(--surface-color)] bg-opacity-50 border border-[var(--surface-border)] rounded-2xl shadow-sm">
                        <h3 className="text-xl font-serif font-bold mb-3 tracking-wide">Sustainability</h3>
                        <p className="text-sm opacity-80">Ethical production that respects both our artisans and our planet.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
