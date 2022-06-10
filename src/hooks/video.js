import { useState, useEffect } from "react";

export const useVideo = () => {
  const [videoId, setVideoId] = useState();
  const [videoDuration, setVideoDuration] = useState();

  return [videoId, videoDuration];
};
