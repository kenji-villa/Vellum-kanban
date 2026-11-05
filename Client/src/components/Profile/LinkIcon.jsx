import React from "react";
import { FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa6";
import { FiGlobe } from "react-icons/fi";

const STYLES = {
  website: { Icon: FiGlobe, bg: "var(--accent)" },
  linkedin: { Icon: FaLinkedinIn, bg: "#0A66C2" },
  github: { Icon: FaGithub, bg: "#24292f" },
  instagram: {
    Icon: FaInstagram,
    bg: "linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
  },
};

const LinkIcon = ({ type, size = 36 }) => {
  const s = STYLES[type];
  if (!s) return null;
  const { Icon } = s;
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl text-white shrink-0 shadow-sm ring-1 ring-black/5 dark:ring-white/15"
      style={{ width: size, height: size, background: s.bg }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
    </span>
  );
};

export default LinkIcon;
