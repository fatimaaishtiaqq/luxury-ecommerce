import React from 'react';

const Careers = () => {
    return (
        <div className="w-full pt-10 mb-20 min-h-[60vh] max-w-4xl mx-auto px-4 text-center">
            <div className="mb-12">
                <h1 className="text-3xl font-serif font-bold tracking-widest mb-2 uppercase">Careers at EYESTYLE</h1>
                <p className="text-sm text-primary font-light">Join our team of optical visionaries.</p>
            </div>

            <div className="py-12 border border-surface bg-surface mb-12">
                <h2 className="text-2xl font-serif font-bold mb-4">We are always looking for talent.</h2>
                <p className="text-primary font-light max-w-2xl mx-auto leading-relaxed">
                    At EYESTYLE, we are passionate about design, craftsmanship, and providing a luxury optical experience. If you share our dedication to excellence, we would love to hear from you.
                </p>
                <div className="mt-8">
                    <p className="text-sm font-medium">Currently, there are no open positions.</p>
                    <p className="text-xs text-primary mt-2 hover:text-accent transition-colors cursor-pointer underline">Submit your resume for future opportunities</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                    <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Our Culture</h3>
                    <p className="text-primary text-sm font-light">An open, collaborative environment focused on innovation and precise optics.</p>
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Benefits</h3>
                    <p className="text-primary text-sm font-light">Comprehensive health, wellness, and generous eyewear allowances for all staff.</p>
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Growth</h3>
                    <p className="text-primary text-sm font-light">We invest heavily in the professional development and optical training of our team members.</p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
