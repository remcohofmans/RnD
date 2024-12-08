import { useState, useEffect } from 'react';

export const useMobileView = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  console.log(isMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
