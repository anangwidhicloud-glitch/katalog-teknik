'use client';

import { motion } from 'framer-motion';
import MPBackground from './MPBackground';

const particles = [
  { left: '8%', top: '18%', delay: 0.2, duration: 7 },
  { left: '20%', top: '65%', delay: 1.7, duration: 9 },
  { left: '36%', top: '26%', delay: 3.1, duration: 8 },
  { left: '53%', top: '72%', delay: 0.8, duration: 10 },
  { left: '69%', top: '20%', delay: 2.4, duration: 8.5 },
  { left: '82%', top: '58%', delay: 4.2, duration: 9.5 },
  { left: '93%', top: '34%', delay: 1.1, duration: 7.5 },
];

export default function SiteBackground() {
  return (
    <div aria-hidden="true" className="site-background">
      <div className="site-grid" />
      <div className="site-aurora site-aurora-one" />
      <div className="site-aurora site-aurora-two" />
      <div className="site-aurora site-aurora-three" />
      <MPBackground />

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="site-particle"
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [0, -24, 0], opacity: [0.15, 0.8, 0.15], scale: [0.8, 1.2, 0.8] }}
          transition={{
            delay: particle.delay,
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
