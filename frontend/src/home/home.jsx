import FooterSection from "@/components/Components/Footer";
import AnimatedStatsSection from "@/components/Components/HomeComponents/AnimatedCounter";
import CustomerReviewsCarousel from "@/components/Components/HomeComponents/CustomerReviewCarousel";
import LanguageLimousineHero from "@/components/Components/HomeComponents/Hero";
import ParentsTrustSection from "@/components/Components/HomeComponents/ParentTrust";
import StudentTransportService from "@/components/Components/HomeComponents/StudentTransport";
import TravelServicesSection from "@/components/Components/HomeComponents/TravelService";
import NavigationBar from "@/components/Components/Navigationbar";
import ScrollToTopButton from "@/components/Components/ScrollTop";

export default function Home() {
  return (
    <div>
      <NavigationBar />
      <LanguageLimousineHero />
      <TravelServicesSection />
      <ParentsTrustSection />
      <StudentTransportService />
      <AnimatedStatsSection />
      <CustomerReviewsCarousel />
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
}
