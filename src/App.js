import React, { useRef, useState, useEffect } from "react";
import {
  Next,
  Pause,
  Play,
  Previous,
  VolumeMute,
  VolumeUp,
  FileUpload,
} from "./components/Icons";
import { useBreakpoints } from "./hooks/useBreakpoints";
import { Timeline } from "./components/Timeline";
import { VideoUpload } from "./components/VideoUpload";
import { useTimer } from "./hooks/useTimer";
import { usePlay } from "./hooks/usePlay";
import { timerFormat } from "./utils/timeFormat";
import { SmallDevices } from "./components/SmallDevices";
import { deleteVideo, getVideo, editVideo } from "./api";

function App() {
  const [isSmallDevices] = useBreakpoints();

  const videoRef = useRef();

  const [speed, setSpeed] = useState(1.0);

  const [videoId, setVideoId] = useState("1655746620576.mp4");

  const [videoDuration, setVideoDuration] = useState(215551);
  const [editedVideoDuration, setEditedVideoDuration] = useState(215551);

  const [chunk, setChunk] = useState();

  const [time, setTime] = useTimer(
    videoRef,
    chunk,
    videoDuration,
    editedVideoDuration,
    isSmallDevices
  );

  const [isPlay, setIsPlay] = usePlay(videoRef, editedVideoDuration, time);
  const [isMute, setIsMute] = useState(false);

  const [progressBarLenght, setProgressBarLenght] = useState({ width: 0 });

  const getVideoMetaData = (response) => {
    let videoData = response.data;
    setVideoId(videoData.file);
    setVideoDuration(videoData.duration);
    setEditedVideoDuration(videoData.duration);
  };

  const getTimelineChunk = (chunkStart, chunkEnd) => {
    setIsPlay(false);
    videoRef.current.currentTime = (chunkStart * videoDuration) / 1000;
    setTime(0);
    setEditedVideoDuration(
      chunkEnd * videoDuration - chunkStart * videoDuration
    );
    setChunk({ chunkStart, chunkEnd });
  };

  const restartVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
    videoRef.current.currentTime = newVideoTime / 1000;
    setTime(0);
  };

  const finishVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    let newVideoTime = chunk ? chunk.chunkEnd * videoDuration : videoDuration;
    videoRef.current.currentTime = newVideoTime / 1000;
    setTime(newVideoTime - (chunk ? chunk.chunkStart * videoDuration : 0));
  };

  useEffect(() => {
    videoRef.current.playbackRate = speed;
    videoRef.current.muted = isMute;

    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect();
    let progress = (progressBar.width * time) / editedVideoDuration;
    setProgressBarLenght({ width: progress });
  }, [speed, isPlay, isMute, time, editedVideoDuration]);

  const videoSpeed = (e) => {
    speed === 2.0 ? setSpeed(0.5) : setSpeed(speed + 0.5);
  };

  const updateProgressBar = (e) => {
    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect();
    let progress =
      ((e.pageX - progressBar.left) * editedVideoDuration) / progressBar.width;
    setTime(progress);
    let newVideoTime = chunk ? chunk.chunkStart * videoDuration : 0;
    videoRef.current.currentTime = (progress + newVideoTime) / 1000;
  };

  
  const downloadVideo = () => {
    console.log(chunk)
    editVideo(videoId, chunk)
  };

  /* REMOVE FILE BEFORE CLOSE TAB */
  /*   window.addEventListener("beforeunload", (e) => {   
    //e.preventDefault();
    if(videoId){
      deleteVideo(videoId) 
    }
  }); */

  if (isSmallDevices) {
    return <SmallDevices />;
  }

  return (
    <div className="App">
      <VideoUpload getVideoMetaData={getVideoMetaData} />

      <video ref={videoRef}>
        {videoId ? (
          <source src={getVideo(videoId)} type="video/mp4"></source>
        ) : null}
        <p>Your browser does not support this video.</p>
      </video>

      <div className="progress-bar" onMouseDown={(e) => updateProgressBar(e)}>
        <div className="progress-bar-content" style={progressBarLenght}></div>
      </div>

      <div className="time">
        {timerFormat(time)} / {timerFormat(editedVideoDuration)}
      </div>
      <div className="controls">
        <div className="stop" onClick={restartVideo}>
          <Previous />
        </div>
        <div className="play" onClick={() => setIsPlay(!isPlay)}>
          {isPlay ? <Pause /> : <Play />}
        </div>
        <div className="stop" onClick={finishVideo}>
          <Next />
        </div>
        <div onClick={videoSpeed}>x{speed}</div>
        <div onClick={() => setIsMute(!isMute)}>
          {isMute ? <VolumeMute /> : <VolumeUp />}
        </div>
      </div>
      <Timeline getTimelineChunk={getTimelineChunk} />
      <span onClick={downloadVideo}>
        <FileUpload />
      </span>
    </div>
  );
}

export default App;
