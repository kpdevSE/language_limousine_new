import LanguageLimousineDetailed from "@/components/Components/AboutUsComponents/Detail";
import AboutUsHero from "@/components/Components/AboutUsComponents/Hero";
import LanguageLimousine from "@/components/Components/AboutUsComponents/SecondHeroSection";
import FooterSection from "@/components/Components/Footer";
import AnimatedStatsSection from "@/components/Components/HomeComponents/AnimatedCounter";
import NavigationBar from "@/components/Components/Navigationbar";
import ScrollToTopButton from "@/components/Components/ScrollTop";

export default function AboutUs() {
  return (
    <div>
      <NavigationBar />
      <AboutUsHero />
      <LanguageLimousine />
      <LanguageLimousineDetailed />
      <AnimatedStatsSection />
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
}
