'use client';

export default function FinalCTA() {
    const handleWhatsAppClick = () => {
        window.open('https://wa.me/2348151033428?text=Hello%20InTime,%20I%20want%20to%20send%20a%20package', '_blank');
    };

    return (
        <section className="section bg-gradient-to-br from-navy via-navy to-[#1a1f3a] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-brand-orange rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-orange rounded-full blur-3xl"></div>
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-2 h-2 bg-brand-orange rounded-full animate-ping"></div>
                <div className="absolute top-40 right-40 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-brand-orange rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="section-container relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main Heading */}
                    <h2 className="heading-lg text-white mb-6">
                        Ready to Send Your <span className="text-brand-orange">Package?</span>
                    </h2>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-white/80 mb-4">
                        Join thousands of satisfied customers across Nigeria
                    </p>
                    <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
                        Experience fast, reliable, and affordable delivery services. Get started in minutes with just a WhatsApp message.
                    </p>

                    {/* CTA Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                        <button
                            onClick={handleWhatsAppClick}
                            className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-brand-orange/40 group"
                        >
                            <span className="flex items-center gap-3">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                Send with intime
                                <svg
                                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-brand-orange mb-2">500+</div>
                            <div className="text-white/70">Deliveries Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-brand-orange mb-2">50+</div>
                            <div className="text-white/70">Trusted Riders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-brand-orange mb-2">12+</div>
                            <div className="text-white/70">Cities Covered</div>
                        </div>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="mt-12 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                        <svg className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        <span className="text-white/90 text-sm font-medium">
                            Mobile app coming soon to iOS & Android App Stores
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
