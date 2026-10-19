"use client";

import { useEffect, useState } from "react";

export function StickySalesCta({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#sales-hero-cta");
    const finalCta = document.querySelector<HTMLElement>("#sales-final-cta");
    if (!enabled || !hero || !finalCta) return;
    const observer = new IntersectionObserver(
      ([heroEntry, finalEntry]) => setVisible(!heroEntry.isIntersecting && !finalEntry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(hero);
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`sales-sticky-cta${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a href="/registro" tabIndex={visible ? 0 : -1}>
        RESERVAR MI LUGAR <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
