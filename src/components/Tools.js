import { FirstPage, LastPage } from "./Icons";

export const Tools = ({ resetTimeline }) => {

  return (
    <div className="tools">
      <span onClick={() => resetTimeline("left")}>
        <FirstPage />
      </span>
      <span onClick={() => resetTimeline("right")}>
        <LastPage />
      </span>
    </div>
  );
};
