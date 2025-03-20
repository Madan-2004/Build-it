import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Detects route changes

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when route changes
  }, [pathname]);

  return null; // No UI, only functionality
};

export default ScrollToTop;
