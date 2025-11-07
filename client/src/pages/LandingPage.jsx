import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Statistics from '../components/landing/Statistics';
import Features from '../components/landing/Features';
import TopCompanies from '../components/landing/TopCompanies';
import Testimonials from '../components/landing/Testimonials';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  return (
    <main>
      <Hero />
      <About />
      <Statistics />
      <Features />
      <TopCompanies />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default LandingPage;
