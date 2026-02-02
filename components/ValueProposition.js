'use client';

export default function ValueProposition() {
    const benefits = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Wide Network',
            description: 'Access to numerous verified dispatch riders across Nigeria, ensuring you always find available service.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Best Prices',
            description: 'Compare rates from multiple riders and choose the best deal. Competitive pricing through our bargaining system.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: 'Fast Delivery',
            description: 'Quick turnaround times with riders ready to pick up and deliver your packages promptly.',
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Reliable Service',
            description: 'Trusted and verified riders with proven track records. Your packages are in safe hands.',
        },
    ];

    return (
        <section id="services" className="section bg-gradient-to-b from-white to-gray-50">
            <div className="section-container">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="heading-lg text-navy mb-4">
                        Why Choose <span className="text-brand-orange">intime?</span>
                    </h2>
                    <p className="text-lg md:text-xl text-brand-gray max-w-2xl mx-auto">
                        We connect you with the best dispatch riders in Nigeria, ensuring fast, affordable, and reliable delivery every time.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="card card-hover group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className="mb-6 text-brand-orange group-hover:scale-110 transition-transform duration-300">
                                {benefit.icon}
                            </div>

                            {/* Title */}
                            <h3 className="heading-sm text-navy mb-3 group-hover:text-brand-orange transition-colors duration-300">
                                {benefit.title}
                            </h3>

                            {/* Description */}
                            <p className="text-brand-gray leading-relaxed">
                                {benefit.description}
                            </p>

                            {/* Decorative Element */}
                            <div className="mt-6 h-1 w-12 bg-gradient-to-r from-brand-orange to-orange-400 rounded-full group-hover:w-full transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
