import { FirstPage, LastPage } from "./Icons";

export const Tools = ({ resetTimeline }) => {
  return (
    <div>
      <FirstPage onClick={() => resetTimeline("left")} />
      <LastPage onClick={() => resetTimeline("right")} />
    </div>
  );
};
