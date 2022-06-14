import { useEffect, useState, useRef } from "react";
import { Tools } from "./Tools";

export const Timeline = () => {
  const timelineref = useRef();

  const [timelineStyle, setTimelineStyle] = useState();

  const [resizer, setResizer] = useState(false);
  const [mousePosition, setMousePosition] = useState();

  
/* 

  useEffect(() => {
        
    document.addEventListener("mousemove", (e) => trackMove(e))

     return () => {
        document.removeEventListener("mousemove", (e) => trackMove(e));
        document.removeEventListener("mouseup", () => setResizer(null));
      }
    
  }, [resizer]); */

  useEffect(() => {

    setTimelineStyle({ width: timelineref.current.scrollWidth, marginLeft: 0 });
    document.addEventListener("mousemove", (e) => setMousePosition(e))
    document.addEventListener("mouseup", () => setResizer(null));


  }, []);

  useEffect(() => {
    const trackMove = () => {
      console.log(timelineStyle)
        if (
          resizer.target.classList.contains("left") //&&
          /* mousePosition.pageX > timelineref.current.offsetLeft - 1  &&
          mousePosition.pageX + document.querySelector('.resizer').getBoundingClientRect().width <= timelineref.current.scrollWidth + timelineStyle.marginLeft*/
        ) {
        setTimelineStyle({
            marginLeft: mousePosition.pageX,
            width: timelineStyle.width + timelineStyle.marginLeft - mousePosition.pageX
          })
        } else if (
          resizer.target.classList.contains("right") //&&
/*           mousePosition.pageX - timelineref.current.offsetLeft - timelineStyle.marginLeft >= document.querySelector('.resizer').getBoundingClientRect().width && 
          mousePosition.pageX <= document.querySelector('.background-timeline').getBoundingClientRect().width  */
        ) {
          setTimelineStyle({
            marginLeft: timelineStyle.marginLeft,
            width: mousePosition.pageX - timelineStyle.marginLeft,
          });
        }
      };

    if (resizer) trackMove()
    
  });

  const resetTimeline = (side) => {
    console.log(side);
  };

  return (
    <div>
      <div className="background-timeline">
        <div className="timeline" ref={timelineref} style={timelineStyle}>
          <div
            className="resizer right"
            onMouseDown={(e) => setResizer(e)}
          ></div>
          <div
            className="resizer left"
            onMouseDown={(e) => setResizer(e)}
          ></div>
        </div>
      </div>
      <Tools resetTimeline={resetTimeline} />
    </div>
  );
};
