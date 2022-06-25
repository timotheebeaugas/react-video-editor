import { useState, useEffect } from "react";

export const usePlay = (videoRef, editedVideoDuration, time) => {
  const [isPlay, setIsPlay] = useState(false);

  useEffect(() => {
    if (isPlay && time < editedVideoDuration) {
      setIsPlay(true);
      videoRef.current.play();
    } else {
      setIsPlay(false);
      videoRef.current.pause();
    }
  }, [isPlay, videoRef, time, editedVideoDuration]);

  return [isPlay, setIsPlay];
};
