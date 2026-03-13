import { useEffect, useRef, useState } from 'react';

export default function useCustomCursor(enabled = true) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    setIsSupported(finePointer && enabled);
  }, [enabled]);

  useEffect(() => {
    if (!isSupported) {
      return undefined;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    const handleMove = (event) => {
      mx = event.clientX;
      my = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
    };

    const handleOver = (event) => {
      if (event.target.closest('button, a, .hover-target')) {
        document.body.classList.add('hovering-target');
      }
    };

    const handleOut = (event) => {
      if (event.target.closest('button, a, .hover-target')) {
        document.body.classList.remove('hovering-target');
      }
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      rafRef.current = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      document.body.classList.remove('hovering-target');
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isSupported]);

  return {
    dotRef,
    ringRef,
    isSupported,
  };
}
