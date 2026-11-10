import React from "react";
import LegalLayout from "../components/Landing/LegalLayout";
import { PRIVACY } from "../utils/legalContent";

const PrivacyPage = () => (
  <LegalLayout
    {...PRIVACY}
    other={{ to: "/terms", label: "Terms of Service" }}
  />
);

export default PrivacyPage;
