'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-navy/95 backdrop-blur-md shadow-lg py-0'
                : 'bg-white/80 backdrop-blur-sm py-2'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
                        <div className="relative h-10 w-32 md:h-12 md:w-40">
                            <Image
                                src={scrolled ? "/logo_dark-nbg.png" : "/logo_light-png.png"}
                                alt="InTime Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['About', 'Services', 'How It Works', 'Contact'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                                className={`${scrolled ? 'text-white' : 'text-navy'} hover:text-brand-orange transition-colors duration-200 font-medium`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden p-2 ${scrolled ? 'text-white' : 'text-navy'}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 bg-white shadow-xl rounded-b-2xl border-t border-gray-100 absolute left-0 right-0 top-20">
                        <div className="flex flex-col space-y-4">
                            {['About', 'Services', 'How It Works', 'Contact'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase().replace(/\s+/g, '-'))}
                                    className="text-navy hover:text-brand-orange transition-colors duration-200 font-medium text-left px-4 py-2"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
