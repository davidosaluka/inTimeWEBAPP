import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ValueProposition from '../components/ValueProposition';
import HowItWorks from '../components/HowItWorks';
import ServiceCoverage from '../components/ServiceCoverage';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <ServiceCoverage />
            <ValueProposition />
            <HowItWorks />
            <FinalCTA />
            <Footer />
        </main>
    );
}
