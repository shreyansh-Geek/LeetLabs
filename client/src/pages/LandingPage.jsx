import Navbar from '../components/landing/Navbar.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import BrandsMarquee from '../components/landing/BrandsMarquee.jsx';
import FeatureBento from '../components/landing/FeatureBento.jsx';
import Footer from '../components/landing/Footer.jsx';
export default function LandingPage() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <BrandsMarquee/>
      <FeatureBento/>
      <Footer/>
    </>
  );
}
