import React, { useEffect, useRef, useState } from 'react';

export const Reveal = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const SectionLabel = ({ number, children, light = false }) => (
  <div className={`section-label ${light ? 'section-label-light' : ''}`}>
    <span>[{number}]</span>
    <span>{children}</span>
  </div>
);
