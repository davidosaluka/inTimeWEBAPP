'use client';

export default function ServiceCoverage() {
    const cities = [
        { name: 'Lagos', region: 'South West' },
        { name: 'Abuja', region: 'Federal Capital Territory' },
        { name: 'Port Harcourt', region: 'South South' },
        { name: 'Kano', region: 'North West' },
        { name: 'Ibadan', region: 'South West' },
        { name: 'Benin City', region: 'South South' },
        { name: 'Enugu', region: 'South East' },
        { name: 'Kaduna', region: 'North West' },
        { name: 'Onitsha', region: 'South East' },
        { name: 'Warri', region: 'South South' },
        { name: 'Calabar', region: 'South South' },
        { name: 'Owerri', region: 'South East' },
    ];

    return (
        <section id="about" className="section bg-white">
            <div className="section-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="heading-lg text-navy mb-4">
                        Delivering <span className="text-brand-orange">Across Nigeria</span>
                    </h2>
                    <p className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto">
                        We're present in major cities across Nigeria, with plans to expand to even more locations.
                    </p>
                </div>

                {/* Map Illustration Placeholder */}
                <div className="mb-12 relative">
                    <div className="bg-gradient-to-br from-navy to-navy/80 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-brand-orange/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 left-10 w-40 h-40 bg-brand-orange/10 rounded-full blur-3xl"></div>

                        {/* Nigeria Map SVG Placeholder */}
                        <div className="relative z-10 flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <svg className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 text-brand-orange/30" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Nationwide Coverage
                                </h3>
                                <p className="text-white/70 text-lg">
                                    Serving {cities.length}+ major cities and counting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {cities.map((city, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-brand-orange hover:shadow-lg transition-all duration-300 group cursor-pointer"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Location Pin Icon */}
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-brand-orange group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-navy group-hover:text-brand-orange transition-colors duration-300">
                                        {city.name}
                                    </h4>
                                    <p className="text-sm text-brand-gray mt-1">
                                        {city.region}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expansion Message */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-brand-orange/10 px-6 py-3 rounded-full">
                        <svg className="w-5 h-5 text-brand-orange animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-navy font-semibold">
                            Expanding to more locations soon!
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
