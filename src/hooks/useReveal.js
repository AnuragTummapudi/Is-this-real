import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const nodes = document.querySelectorAll('.reveal');
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}
