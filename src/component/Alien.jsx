import { motion } from "framer-motion";

export default function Alien() {
  return (
    <motion.svg
      width="95"
      height="120"
      viewBox="0 0 120 140"
      initial={{ y: -25 }}
      animate={{
        y: [-25, -10, -25],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* glow */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* hands */}
      <rect x="25" y="82" width="8" height="28" rx="4" fill="#66ffe5"/>
      <rect x="87" y="82" width="8" height="28" rx="4" fill="#66ffe5"/>

      {/* fingers */}
      <circle cx="29" cy="108" r="3" fill="#66ffe5"/>
      <circle cx="91" cy="108" r="3" fill="#66ffe5"/>

      {/* head */}
      <ellipse
        cx="60"
        cy="52"
        rx="34"
        ry="42"
        fill="#74ffe7"
        filter="url(#glow)"
      />

      {/* eyes */}
      <ellipse cx="48" cy="48" rx="8" ry="16" fill="#111"/>
      <ellipse cx="72" cy="48" rx="8" ry="16" fill="#111"/>

      {/* eye shine */}
      <circle cx="50" cy="42" r="2" fill="#fff"/>
      <circle cx="74" cy="42" r="2" fill="#fff"/>

      {/* smile */}
      <path
        d="M48 70 Q60 78 72 70"
        stroke="#222"
        strokeWidth="2"
        fill="none"
      />
    </motion.svg>
  );
}