'use client';

import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteTheme } from './ThemeProvider';

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useSiteTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={isDark ? 'Mode terang' : 'Mode gelap'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -80, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.28 }}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </motion.span>
      {!compact && <span>{isDark ? 'Terang' : 'Gelap'}</span>}
    </button>
  );
}
