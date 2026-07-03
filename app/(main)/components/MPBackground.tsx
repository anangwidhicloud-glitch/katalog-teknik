'use client';

import { motion } from 'framer-motion';

const electricPath =
  'M60 360 L60 105 L165 235 L270 105 L270 360 M340 360 L340 105 L475 105 C575 105 600 250 478 250 L340 250';

export default function MPBackground({ strong = false }: { strong?: boolean }) {
  return (
    <div aria-hidden="true" className={`mp-background ${strong ? 'mp-background-strong' : ''}`}>
      <motion.div
        className="mp-orbit mp-orbit-one"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        className="mp-orbit mp-orbit-two"
        animate={{ rotate: -360 }}
        transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
      />

      <svg viewBox="0 0 660 460" className="mp-electric-svg" role="presentation">
        <defs>
          <linearGradient id="mp-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-cyan)" />
            <stop offset="48%" stopColor="var(--accent-blue)" />
            <stop offset="100%" stopColor="var(--accent-violet)" />
          </linearGradient>
          <filter id="mp-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="mp-trace mp-trace-shadow" d={electricPath} pathLength="1" />
        <path
          className="mp-trace mp-trace-main"
          d={electricPath}
          pathLength="1"
          filter="url(#mp-glow)"
        />

        <circle r="6" fill="var(--accent-cyan)" filter="url(#mp-glow)">
          <animateMotion dur="6.5s" repeatCount="indefinite" path={electricPath} />
        </circle>
        <circle r="3.5" fill="white" opacity="0.95">
          <animateMotion begin="-2.3s" dur="6.5s" repeatCount="indefinite" path={electricPath} />
        </circle>
      </svg>

      <div className="mp-scanline" />
      <div className="mp-flash mp-flash-one" />
      <div className="mp-flash mp-flash-two" />
    </div>
  );
}
