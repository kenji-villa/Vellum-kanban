import React from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const Reveal = ({ children, delay = 0, className = "" }) => {
  const { elementRef, isVisible } = useScrollReveal();
  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal-element ${isVisible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
