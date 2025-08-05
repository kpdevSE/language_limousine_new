import FooterSection from "@/components/Components/Footer";
import AnimatedStatsSection from "@/components/Components/HomeComponents/AnimatedCounter";
import NavigationBar from "@/components/Components/Navigationbar";
import PrivacyPolicyComponent from "@/components/Components/PrivacyPloiciesCompnents/Details";
import PrivacyPolicyHero from "@/components/Components/PrivacyPloiciesCompnents/Hero";
import LanguageLimousinePrivacy from "@/components/Components/PrivacyPloiciesCompnents/SecondHeroSection";
import ScrollToTopButton from "@/components/Components/ScrollTop";

export default function Privacy() {
  return (
    <div>
      <NavigationBar />
      <PrivacyPolicyHero />
      <LanguageLimousinePrivacy />
      <PrivacyPolicyComponent />
      <AnimatedStatsSection />
      <FooterSection />
      <ScrollToTopButton />
    </div>
  );
}
