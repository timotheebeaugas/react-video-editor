import { useEffect, useState, useRef } from "react";
import { Tools } from "./Tools";

export const Timeline = () => {
  const timelineref = useRef();

  const [timelineStyle, setTimelineStyle] = useState();

  const [move, setMove] = useState(false);

  const moveDown = (e) => {
    setMove(e.target.classList);
  };

  useEffect(() => {
    setTimelineStyle({ width: timelineref.current.clientWidth });
  }, []);

  const trackMove = (e) => {
    if (
      move.contains("left") &&
      e.pageX > timelineref.current.offsetLeft - 1 &&
      e.pageX + 10 < timelineref.current.clientWidth + timelineStyle.marginLeft
    ) {console.log('a') // neeed test that
      setTimelineStyle({
        marginLeft: e.pageX - timelineref.current.offsetLeft,
        width:
          timelineref.current.clientWidth +
          timelineStyle.marginLeft -
          e.pageX +
          timelineref.current.offsetLeft,
      });
    } else if (
      move.contains("right") &&
      e.pageX - timelineref.current.offsetLeft - timelineStyle.marginLeft > 20
    ) {console.log('b') // neeed test that
      setTimelineStyle({
        ...timelineStyle,
        width:
          e.pageX >
          timelineref.current.clientWidth + timelineref.current.offsetLeft
            ? timelineref.current.clientWidth +
              timelineref.current.offsetLeft -
              timelineref.current.offsetLeft -
              timelineStyle.marginLeft
            : e.pageX -
              timelineref.current.offsetLeft -
              timelineStyle.marginLeft,
      });
    }
  };

  useEffect(() => {
    if (move) {
      document.addEventListener("mousemove", (e) => trackMove(e));
      return () => {
        document.removeEventListener("mousemove", (e) => trackMove(e));
      };
    } else {
      console.log("e");
      document.addEventListener("mouseup", setMove(false));
      return () => {
        //document.removeEventListener("mouseup", );
      };
    }
  }, [move]);

  const resetTimeline = (side) => {
    console.log(side);
  };

  return (
    <div>
      <div className="background-timeline">
        <div className="timeline" ref={timelineref} style={timelineStyle}>
          <div className="resizer right" onMouseDown={(e) => moveDown(e)}></div>
          <div className="resizer left" onMouseDown={(e) => moveDown(e)}></div>
        </div>
      </div>
      <Tools resetTimeline={resetTimeline} />
    </div>
  );
};
