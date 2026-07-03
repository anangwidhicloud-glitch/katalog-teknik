'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AOSProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observedElements = new WeakSet<Element>();

    const prepare = (element: HTMLElement) => {
      const delay = element.dataset.aosDelay;
      const duration = element.dataset.aosDuration;

      if (delay) element.style.setProperty('--aos-delay', `${Number(delay)}ms`);
      if (duration) element.style.setProperty('--aos-duration', `${Number(duration)}ms`);
    };

    if (reducedMotion || !('IntersectionObserver' in window)) {
      const revealAll = (root: ParentNode = document) => {
        root.querySelectorAll<HTMLElement>('[data-aos]').forEach((element) => {
          prepare(element);
          element.classList.add('aos-animate');
        });
      };

      revealAll();
      const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches('[data-aos]')) {
              prepare(node);
              node.classList.add('aos-animate');
            }
            revealAll(node);
          });
        }
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target as HTMLElement;
          element.classList.add('aos-animate');

          if (element.dataset.aosOnce !== 'false') observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' },
    );

    const observeElement = (element: HTMLElement) => {
      if (observedElements.has(element)) return;
      prepare(element);
      observedElements.add(element);
      observer.observe(element);
    };

    const observeWithin = (root: ParentNode = document) => {
      root.querySelectorAll<HTMLElement>('[data-aos]').forEach(observeElement);
    };

    observeWithin();

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches('[data-aos]')) observeElement(node);
          observeWithin(node);
        });
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
