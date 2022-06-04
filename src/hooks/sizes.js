import { useState, useEffect } from "react";

export function useDefaultWidth() {
    const [defaultWidth, setDefaultWidth] = useState();

    const widthBreakpoints = () => {
      let pixels
      if(window.innerWidth < 768){
        pixels = window.innerWidth;
      }else{
        pixels = window.innerWidth / 2;
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