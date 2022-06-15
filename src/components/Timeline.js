import { useEffect, useState, useRef } from "react";
import { Tools } from "./Tools";

export const Timeline = () => {
  const timelineref = useRef();

  const [timelineStyle, setTimelineStyle] = useState();

  const [resizer, setResizer] = useState(false);
  const [mousePosition, setMousePosition] = useState();
  const [previousMousePosition, setPreviousMousePosition] = useState();

  useEffect(() => {

    setTimelineStyle({ width: timelineref.current.scrollWidth, left: 0 });
    document.addEventListener("mousemove", (e) => setMousePosition(e))
    document.addEventListener("mouseup", () => setResizer(null));

    return () => {
      document.removeEventListener("mousemove", (e) => setMousePosition(e));
      document.removeEventListener("mouseup", () => setResizer(null));
    }

  }, []);

  useEffect(() => {
    const trackMove = () => {
      let clientTimeline = document.querySelector('.timeline').getBoundingClientRect()
      let backgroundTimeline = document.querySelector('.background-timeline').getBoundingClientRect()
      console.log(timelineStyle, clientTimeline.width, previousMousePosition,mousePosition.pageX)
        if (
          resizer.target.classList.contains("left") 
          && mousePosition.pageX >= backgroundTimeline.left
          //&&
          /* mousePosition.pageX > timelineref.current.offsetLeft - 1  &&
          mousePosition.pageX + document.querySelector('.resizer').getBoundingClientRect().width <= timelineref.current.scrollWidth + timelineStyle.left*/
        ) {
        setTimelineStyle({
            width: clientTimeline.width + (previousMousePosition - mousePosition.pageX),
            left: mousePosition.pageX - backgroundTimeline.left,
          })
          setPreviousMousePosition(mousePosition.pageX);
        } else if (
          resizer.target.classList.contains("right") 
          && mousePosition.pageX <= (backgroundTimeline.width + clientTimeline.left)
          //&&
/*           mousePosition.pageX - timelineref.current.offsetLeft - timelineStyle.left >= document.querySelector('.resizer').getBoundingClientRect().width && 
          mousePosition.pageX <= document.querySelector('.background-timeline').getBoundingClientRect().width  */
        ) {
          setTimelineStyle({
            ...timelineStyle,
            width: mousePosition.pageX - clientTimeline.left,
          });
        }
      };

    if (resizer)            trackMove();
    
  }, [resizer, mousePosition, timelineStyle, previousMousePosition]);

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
