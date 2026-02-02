import './globals.css';

export const metadata = {
    title: 'InTime - Fast & Affordable Dispatch Services in Nigeria',
    description: 'Connect with trusted dispatch riders across Nigeria. Get competitive prices and fast delivery for all your packages. Send with InTime today!',
    keywords: 'dispatch services Nigeria, delivery riders, affordable courier, fast delivery Nigeria, InTime',
    openGraph: {
        title: 'InTime - Fast & Affordable Dispatch Services in Nigeria',
        description: 'Connect with trusted dispatch riders across Nigeria. Get competitive prices and fast delivery for all your packages.',
        type: 'website',
        locale: 'en_NG',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>{children}</body>
        </html>
    );
}
