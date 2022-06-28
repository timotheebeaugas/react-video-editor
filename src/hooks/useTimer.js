import { useEffect, useState } from "react";

export const useTimer = (videoRef, chunk, videoDuration, editedVideoDuration, isSmallDevices) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if(!isSmallDevices){
        let inverval = setInterval(() => {
        let videoMilliseconds = videoRef.current.currentTime * 1000;
        let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
        setTime(videoMilliseconds - newVideoTime)}, 1);
        return () => {
          clearInterval(inverval);
        };      
    }
  }, [time, editedVideoDuration, videoRef, chunk, videoDuration, isSmallDevices]);

  return [time, setTime];
};
