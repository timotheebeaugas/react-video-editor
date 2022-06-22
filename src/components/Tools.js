import { FirstPage, LastPage } from "./Icons";

export const Tools = ({ resetTimeline }) => {
  return (
    <div>
      <span onClick={() => resetTimeline("left")}>
        <FirstPage />
      </span>
      <span onClick={() => resetTimeline("right")}>
        <LastPage />
      </span>
    </div>
  );
};
