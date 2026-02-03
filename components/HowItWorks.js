'use client';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Contact Us',
            description: 'Click the "Send with intime" button to reach us on WhatsApp. Quick and easy to get started.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ),
        },
        {
            number: '02',
            title: 'Share Details',
            description: 'Tell us your pickup location, delivery destination, and package details. We\'ll handle the rest.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            number: '03',
            title: 'Get Matched',
            description: 'We connect you with the best available riders for your needs. Compare prices and choose your preferred rider.',
            icon: (
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
        },
    ];

    return (
        <section id="how-it-works" className="section bg-navy relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23F94C05' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="section-container relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="heading-lg text-white mb-4">
                        Get Started in <span className="text-brand-orange">3 Simple Steps</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Sending your package with intime is quick and hassle-free. Here's how it works.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    {/* Connection Lines (Desktop) */}
                    <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-brand-orange via-orange-400 to-brand-orange opacity-30"></div>

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Step Card */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-brand-orange/50 transition-all duration-300 hover:transform hover:-translate-y-2 group">
                                {/* Step Number */}
                                <div className="absolute -top-6 left-8 w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-orange/50 group-hover:scale-110 transition-transform duration-300">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="mt-8 mb-6 text-brand-orange group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>

                                {/* Title */}
                                <h3 className="heading-sm text-white mb-3 group-hover:text-brand-orange transition-colors duration-300">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-white/70 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Arrow (Mobile) */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden flex justify-center my-4">
                                    <svg className="w-6 h-6 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <button
                        onClick={() => window.open('https://wa.me/2348151033428?text=Hello%20InTime,%20I%20want%20to%20send%20a%20package', '_blank')}
                        className="btn-primary"
                    >
                        Start Your Delivery Now
                    </button>
                </div>
            </div>
        </section>
    );
}
