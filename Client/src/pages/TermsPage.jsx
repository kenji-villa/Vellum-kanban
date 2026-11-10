import React from "react";
import LegalLayout from "../components/Landing/LegalLayout";
import { TERMS } from "../utils/legalContent";

const TermsPage = () => (
  <LegalLayout {...TERMS} other={{ to: "/privacy", label: "Privacy Policy" }} />
);

export default TermsPage;
