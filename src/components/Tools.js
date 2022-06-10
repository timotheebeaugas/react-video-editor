import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";

export const Tools = ({ resetTimeline }) => {
  return (
    <div>
      <BsArrowBarLeft onClick={() => resetTimeline("left")} />
      <BsArrowBarRight onClick={() => resetTimeline("right")} />
    </div>
  );
};
