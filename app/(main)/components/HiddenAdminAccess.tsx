'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';

const DOUBLE_CLICK_DELAY = 500;

export default function HiddenAdminAccess() {
  const router = useRouter();
  const lastClickRef = useRef(0);

  function handleClick() {
    const now = Date.now();

    if (now - lastClickRef.current <= DOUBLE_CLICK_DELAY) {
      lastClickRef.current = 0;
      router.push('/admin');
      return;
    }

    lastClickRef.current = now;
  }

  return (
    <button
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      onClick={handleClick}
      className="fixed left-0 top-0 z-[9999] h-8 w-8 cursor-default border-0 bg-transparent p-0 opacity-0"
    />
  );
}
