import { useState, useEffect } from "react";

export const useDefaultWidth = () => {
    const [defaultWidth, setDefaultWidth] = useState();

    const widthBreakpoints = () => {

      let pixels = window.innerWidth - 30

      if(window.innerWidth > 768){
        pixels = pixels / 2;
      }
      setDefaultWidth({width: pixels});
    }
    
    useEffect(() => {
      widthBreakpoints()
      }, []); 

    useEffect(() => {
        window.addEventListener('resize', () => {
          widthBreakpoints()
        });        
      }, []);

    return [defaultWidth]
}