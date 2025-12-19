import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi đường dẫn (pathname) thay đổi, cuộn lên đầu
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
