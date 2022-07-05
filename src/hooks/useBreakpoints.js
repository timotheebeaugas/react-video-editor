import { useState, useEffect } from "react";

export const useBreakpoints = () => {
  const [isSmallDevices, setIsSmallDevices] = useState(false);

  const widthBreakpoints = () => {
    window.innerWidth > 576 // X-Small Bottstrap
      ? setIsSmallDevices(false)
      : setIsSmallDevices(true);
  };

  useEffect(() => {
    widthBreakpoints();
    window.addEventListener("resize", () => {
      widthBreakpoints();
    });
    return () => {
      window.addEventListener("resize", () => {
        widthBreakpoints();
      });
    };
  }, []);
 
  return [isSmallDevices];
};
