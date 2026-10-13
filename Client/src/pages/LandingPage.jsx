import React from "react";
import LandingNav from "../components/Landing/LandingNav";
import LandingHero from "../components/Landing/LandingHero";
import LandingFeatures from "../components/Landing/LandingFeatures";
import LandingPreview from "../components/Landing/LandingPreview";
import LandingPricing from "../components/Landing/LandingPricing";
import LandingTestimonials from "../components/Landing/LandingTestimonials";
import LandingFAQ from "../components/Landing/LandingFAQ";
import LandingCTA from "../components/Landing/LandingCTA";
import LandingFooter from "../components/Landing/LandingFooter";

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingPreview />
      <LandingTestimonials />
      <LandingPricing />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
