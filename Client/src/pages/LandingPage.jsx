import React from "react";
import LandingNav from "../components/Landing/LandingNav";
import LandingHero from "../components/Landing/LandingHero";
import LandingFeatures from "../components/Landing/LandingFeatures";
import LandingPreview from "../components/Landing/LandingPreview";
import LandingPerks from "../components/Landing/LandingPerks";
import LandingFAQ from "../components/Landing/LandingFAQ";
import LandingCTA from "../components/Landing/LandingCTA";
import LandingFooter from "../components/Landing/LandingFooter";

const LandingPage = () => (
  <div className="bg-white dark:bg-[#0f172a] min-h-screen overflow-x-hidden">
    <LandingNav />
    <LandingHero />
    <LandingFeatures />
    <LandingPreview />
    <LandingPerks />
    <LandingFAQ />
    <LandingCTA />
    <LandingFooter />
  </div>
);

export default LandingPage;
