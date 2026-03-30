'use client';

import { useState } from 'react';

const policies = [
    {
        title: 'Information We Collect',
        content: `We collect information you provide directly to us, such as your name, phone number, pickup and delivery addresses, and package details when you use our service via WhatsApp. We may also collect device information and usage data to improve our service.`,
    },
    {
        title: 'How We Use Your Information',
        content: `Your information is used solely to facilitate your delivery requests — matching you with available riders, confirming orders, and communicating updates. We do not use your data for unsolicited marketing without your consent.`,
    },
    {
        title: 'Information Sharing',
        content: `We share only the necessary details (pickup/drop-off location and contact info) with the rider assigned to your delivery. We do not sell, rent, or trade your personal information to third parties.`,
    },
    {
        title: 'Data Security',
        content: `We take reasonable steps to protect your personal information from unauthorized access or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
    },
    {
        title: 'Your Rights',
        content: `You have the right to request access to, correction of, or deletion of your personal data at any time. To exercise these rights, contact us directly on WhatsApp or via email: intimesender@gmail.com, and we will respond promptly.`,
    },
    {
        title: 'Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. Any changes will be communicated through our website or WhatsApp channel. Continued use of our services after changes constitutes acceptance of the updated policy.`,
    },
];

function AccordionItem({ item, index, isOpen, onToggle }) {
    return (
        <div
            className={`border border-white/10 rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-brand-orange/50 bg-white/5' : 'bg-white/[0.02] hover:border-white/20'
            }`}
        >
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
            >
                <div className="flex items-center gap-4">
                    {/* Index badge */}
                    <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300 ${
                            isOpen
                                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/40'
                                : 'bg-white/10 text-white/50 group-hover:bg-white/20'
                        }`}
                    >
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                        className={`font-semibold text-base md:text-lg transition-colors duration-300 ${
                            isOpen ? 'text-brand-orange' : 'text-white group-hover:text-white/90'
                        }`}
                    >
                        {item.title}
                    </span>
                </div>

                {/* Chevron */}
                <span
                    className={`shrink-0 ml-4 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-brand-orange' : 'text-white/40 group-hover:text-white/70'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {/* Body */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="px-6 pb-6 pt-0 text-white/70 leading-relaxed pl-[4.5rem]">
                    {item.content}
                </p>
            </div>
        </div>
    );
}

export default function PrivacyPolicy() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="privacy-policy" className="section bg-navy relative overflow-hidden">
            {/* Background Pattern — mirrors HowItWorks */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23F94C05' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            <div className="section-container relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="heading-lg text-white mb-4">
                        Our <span className="text-brand-orange">Privacy Policy</span>
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Your privacy matters to us. Here's how we collect, use, and protect your information.
                    </p>
                </div>

                {/* Accordion */}
                <div className="max-w-3xl mx-auto flex flex-col gap-3">
                    {policies.map((item, index) => (
                        <AccordionItem
                            key={index}
                            item={item}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => toggle(index)}
                        />
                    ))}
                </div>

                {/* Footer note */}
                <p className="text-center text-white/40 text-sm mt-10">
                    Last updated: March 2026 · Questions?{' '}
                    <button
                        onClick={() =>
                            window.open(
                                'https://wa.me/2348151033428?text=Hello%20InTime,%20I%20have%20a%20question%20about%20your%20privacy%20policy',
                                '_blank'
                            )
                        }
                        className="text-brand-orange hover:underline"
                    >
                        Contact us on WhatsApp
                    </button>
                </p>
            </div>
        </section>
    );
}