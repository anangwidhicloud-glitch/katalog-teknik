'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ShootingStarField() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // client-only after hydration
    const raf = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#4c1d95_0%,#0a0a0f_70%)]" />
      {Array.from({ length: 8 }).map((_, i) => (
        <ShootingStar key={i} index={i} />
      ))}
    </div>
  );
}

const ShootingStar = ({ index }: { index: number }) => {
  // deterministik dan dihitung sekali per render; karena komponen ini tidak pernah dirender di server,
  // mismatch server/client tidak mungkin.
  const left = ((index + 1) * 9301 + 1 * 49297) % 10000;
  const top = ((index + 1) * 9301 + 2 * 49297) % 5000;
  const repeatDelay = ((((index + 1) * 9301 + 3 * 49297) % 5000) / 1000) * 5;
  const duration = ((((index + 1) * 9301 + 4 * 49297) % 5000) / 1000) * 2 + 2;

  return (
    <motion.div
      className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_#fff]"
      initial={{ opacity: 0, x: -50, y: -50 }}
      animate={{ opacity: [0, 1, 0], x: 400, y: 400 }}
      transition={{ repeat: Infinity, repeatDelay, duration }}
      style={{
        left: `${(left / 10000) * 100}%`,
        top: `${(top / 5000) * 50}%`,
      }}
    />
  );
};
