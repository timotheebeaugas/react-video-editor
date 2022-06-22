import { useEffect, useState, useRef } from "react";
import { Tools } from "./Tools";

export const Timeline = ({ getTimelineMetaData }) => {
  const timelineref = useRef();

  const [timelineStyle, setTimelineStyle] = useState();
  const [backgroundTimeline, setBackgroundTimeline] = useState();

  const [resizer, setResizer] = useState(false);
  const [mousePosition, setMousePosition] = useState();
  const [previousMousePosition, setPreviousMousePosition] = useState();

  useEffect(() => {
    setTimelineStyle({ width: timelineref.current.scrollWidth, left: 0 });
    setBackgroundTimeline(
      document.querySelector(".background-timeline").getBoundingClientRect()
    );

    document.addEventListener("mousemove", (e) => setMousePosition(e));
    document.addEventListener("mouseup", () => setResizer(null));

    return () => {
      document.removeEventListener("mousemove", (e) => setMousePosition(e));
      document.removeEventListener("mouseup", () => setResizer(null));
    };
  }, []);

  useEffect(() => {
    if (resizer) {
      let clientTimeline = document
        .querySelector(".timeline")
        .getBoundingClientRect();
      if (
        mousePosition.pageX >= backgroundTimeline.left && // does not exceed the left side
        mousePosition.pageX <= backgroundTimeline.right // does not exceed the right side
      ) {
        if (
          resizer.target.classList.contains("left") && // which side
          mousePosition.pageX < clientTimeline.right // does not collide right side
        ) {
          setTimelineStyle({
            width:
              clientTimeline.width +
              ((previousMousePosition
                ? previousMousePosition
                : backgroundTimeline.left) -
                mousePosition.pageX),
            left: mousePosition.pageX - backgroundTimeline.left,
          });
          setPreviousMousePosition(mousePosition.pageX);
        } else if (
          resizer.target.classList.contains("right") && // which side
          mousePosition.pageX > clientTimeline.left // does not collide right side
        ) {
          setTimelineStyle({
            ...timelineStyle,
            width: mousePosition.pageX - clientTimeline.left,
          });
        }
        getTimelineMetaData({
          backgroundTimeline,
          clientTimeline,
        }); // send timeline's metadata to App for update timer and duration
      }
    }
  }, [
    resizer,
    mousePosition,
    timelineStyle,
    previousMousePosition,
    backgroundTimeline,
    getTimelineMetaData,
  ]);

  const resetTimeline = (side) => {
    let clientTimeline = document
      .querySelector(".timeline")
      .getBoundingClientRect();
    if (side === "left") {
      setTimelineStyle({
        width:
          clientTimeline.width + clientTimeline.left - backgroundTimeline.left,
        left: 0,
      });
      setPreviousMousePosition(backgroundTimeline.left);
    } else {
      setTimelineStyle({
        ...timelineStyle,
        width:
          backgroundTimeline.width -
          clientTimeline.left +
          backgroundTimeline.left,
      });
    }
    clientTimeline = backgroundTimeline;
    getTimelineMetaData({
      backgroundTimeline,
      clientTimeline,
    });
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
