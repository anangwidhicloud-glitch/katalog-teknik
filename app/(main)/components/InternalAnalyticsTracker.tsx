'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SESSION_KEY = 'katalog_analytics_session';

function getSessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const value = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, value);
    return value;
  } catch {
    return crypto.randomUUID();
  }
}

export default function InternalAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const payload = JSON.stringify({
      path,
      sessionId: getSessionId(),
      referrer: document.referrer || null,
    });

    const timer = window.setTimeout(() => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/track',
          new Blob([payload], { type: 'application/json' }),
        );
        return;
      }

      void fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
