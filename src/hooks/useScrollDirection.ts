import { useState, useEffect } from "react";

type ScrollDirection = "up" | "down" | null;

interface UseScrollDirectionOptions {
  threshold?: number;
  disabled?: boolean;
}

export const useScrollDirection = ({ 
  threshold = 10, 
  disabled = false 
}: UseScrollDirectionOptions = {}) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (disabled) {
      setScrollDirection(null);
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";
      
      setIsAtTop(scrollY < 10);

      if (
        direction !== scrollDirection &&
        Math.abs(scrollY - lastScrollY) > threshold
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDirection, threshold, disabled]);

  return { scrollDirection, isAtTop };
};

export default useScrollDirection;
