import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Account Deletion Request - InTime',
    description: 'Request permanent deletion of your InTime account and delivery history.',
};

export default function DeleteAccountPage() {
    const whatsappUrl = "https://wa.me/2348151033428?text=Delete%20my%20Account";
    const mailtoUrl = "mailto:support@intime.ng?subject=Account%20Deletion%20Request&body=Hello%20InTime%20Support,%0A%0AI%20would%20like%20to%20request%20the%20permanent%20deletion%20of%20my%20account%20and%20delivery%20history.%0A%0AMy%20registered%20phone%20number%20is:%20%0A%0AThank%20you.";

    return (
        <main className="min-h-screen bg-navy text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23F94C05' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            {/* Top Navigation */}
            <header className="w-full py-6 px-4 md:px-8 border-b border-white/10 bg-navy/80 backdrop-blur-md relative z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-10 w-32 md:h-12 md:w-40">
                            <Image
                                src="/logo_dark-nbg.png"
                                alt="InTime Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-white/70 hover:text-brand-orange transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 md:py-20 relative z-10 flex flex-col justify-center">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Account Deletion Request
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                        Request Account & Data Deletion
                    </h1>

                    <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
                        If you wish to delete your InTime account and purge all associated delivery history, you can initiate a request through our WhatsApp bot or via email support.
                    </p>

                    {/* Official Statement Card */}
                    <div className="bg-navy/80 border-l-4 border-brand-orange rounded-r-xl p-5 md:p-6 mb-8 shadow-inner">
                        <h2 className="text-xs uppercase font-bold tracking-wider text-brand-orange mb-2">
                            Official Deletion Policy Statement
                        </h2>
                        <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                            "To request deletion of your account and delivery history, message 'Delete my Account' to our WhatsApp bot or email support@intime.ng with your registered phone number. Data is permanently purged within 30 days."
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-600/20 hover:scale-[1.02]"
                        >
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Message WhatsApp Bot
                        </a>
                        <a
                            href={mailtoUrl}
                            className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-brand-orange hover:bg-orange-600 text-white font-semibold transition-all duration-200 shadow-lg shadow-brand-orange/20 hover:scale-[1.02]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email support@intime.ng
                        </a>
                    </div>

                    {/* What Happens Next */}
                    <div className="border-t border-white/10 pt-8">
                        <h3 className="text-lg font-semibold text-white mb-4">What happens after you submit a request?</h3>
                        <ul className="space-y-3 text-white/70 text-sm md:text-base">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                                <span>We verify your registered phone number to ensure security.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                                <span>Your account access will be disabled, preventing further sign-ins.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                                <span>All personal profiles, saved addresses, and delivery history are <strong>permanently purged within 30 days</strong>.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Simple Footer */}
            <footer className="w-full py-6 text-center text-white/50 text-sm border-t border-white/10 relative z-10">
                © {new Date().getFullYear()} InTime. All rights reserved.
            </footer>
        </main>
    );
}
