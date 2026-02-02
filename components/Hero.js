'use client';

export default function Hero() {
    const handleWhatsAppClick = () => {
        window.open('https://wa.me/2348000000000?text=Hello%20InTime,%20I%20want%20to%20send%20a%20package', '_blank');
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center bg-white pt-20">
            <div className="section-container px-4 md:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text Content */}
                    <div className="text-left fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full mb-8">
                            <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            <span className="text-brand-orange font-semibold text-sm tracking-wide uppercase">On time, Everytime</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="heading-xl text-navy mb-6 font-bold leading-[1.1]">
                            Dispatch Riders at <br />
                            <span className="text-brand-orange">Your Fingertips</span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg text-brand-gray mb-10 max-w-xl leading-relaxed">
                            Access thousands of verified dispatch riders across Nigeria.
                            Compare prices, negotiate rates, and get your packages delivered fast and safe.
                        </p>

                        {/* Stats/Trust Row */}
                        <div className="flex flex-wrap items-center gap-8 md:gap-12 border-t border-gray-100 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-navy text-xl">500+</div>
                                    <div className="text-sm text-brand-gray">Active Riders</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-navy text-xl">4.8</div>
                                    <div className="text-sm text-brand-gray">Avg. Rating</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-navy text-xl">30min</div>
                                    <div className="text-sm text-brand-gray">Avg. Pickup</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Request Card */}
                    <div className="relative flex justify-center lg:justify-end fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-8 w-full max-w-md border border-gray-50 relative z-10">
                            <h3 className="text-xl font-bold text-navy mb-6">Request a Dispatch</h3>

                            {/* Button Only - Inputs removed as requested */}
                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base"
                            >
                                Send with intime
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>

                            {/* Trust Badge below button */}
                            <div className="mt-6 flex items-center gap-3 bg-green-50 rounded-xl p-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-navy text-sm">Express Delivery</div>
                                    <div className="text-xs text-brand-gray">Within 2 hours</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative background blur behind card */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-orange/5 rounded-full blur-3xl -z-0"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}
