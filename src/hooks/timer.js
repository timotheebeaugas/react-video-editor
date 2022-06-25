import { useEffect, useState } from "react";

export const useTimer = (videoRef, chunk, videoDuration, editedVideoDuration) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
        let inverval = setInterval(() => {
        let videoMilliseconds = videoRef.current.currentTime * 1000;
        let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
        setTime(videoMilliseconds - newVideoTime)}, 1);
        return () => {
          clearInterval(inverval);
        };
      
  }, [time, editedVideoDuration, videoRef, chunk, videoDuration]);

  return [time, setTime];
};
