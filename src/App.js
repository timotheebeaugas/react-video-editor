import React, { useRef, useState, useEffect } from "react";
import {
  Next,
  Pause,
  Play,
  Previous,
  VolumeMute,
  VolumeUp,
} from "./components/Icons";
import { Timeline } from "./components/Timeline";
import { VideoUpload } from "./components/VideoUpload";
import { useTimer } from "./hooks/timer";
import { timerFormat } from "./utils/timeFormat";

function App() {
  const videoRef = useRef();

  const [isPlay, setIsPlay] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  const [time, setTime] = useTimer(isPlay, speed); // edit time VS time // video duration vs edited

  const [videoId, setVideoId] = useState("1655746620576.mp4");
  const [videoDuration, setVideoDuration] = useState(215551);

  const [editVideoDuration, setEditVideoDuration] = useState();
  const [editCurrentTime, setEditCurrentTime] = useState();

  const [isMute, setIsMute] = useState(false);

  const [progressBarLenght, setProgressBarLenght] = useState({ width: 0 });

  const getVideoMetaData = (response) => {
    let videoData = response.data;
    setVideoId(videoData.file);
    setVideoDuration(videoData.duration);
  };

  const getTimelineMetaData = (obj) => {
    //current timer edited vs curren timer normal
    let timerUpadate =
      ((obj.clientTimeline.left - obj.backgroundTimeline.left) *
        videoDuration) /
      obj.backgroundTimeline.width;
    let durationUpdate =
      (obj.clientTimeline.width * videoDuration) / obj.backgroundTimeline.width;
    setIsPlay(false);
    videoRef.current.pause();
    videoRef.current.currentTime = timerUpadate / 1000;
    setEditCurrentTime(timerUpadate);
    setEditVideoDuration(durationUpdate);
    console.log(timerUpadate, durationUpdate);
  };

  const restartVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setTime(0);
  };

  const finishVideo = () => {
    setIsPlay(false);
    setSpeed(1);
    videoRef.current.pause();
    videoRef.current.currentTime = videoRef.current.duration;
    setTime(videoDuration);
  };

  useEffect(() => {
    isPlay ? videoRef.current.play() : videoRef.current.pause();
    videoRef.current.playbackRate = speed;
    videoRef.current.muted = isMute;

    let progressBar = document
      .querySelector(".progress-bar")
      .getBoundingClientRect().width;
    let progress = (progressBar * time) / videoDuration;
    setProgressBarLenght({width: progress});
    console.log(progress);

  }, [speed, isPlay, isMute, time, videoDuration]);

  const videoSpeed = (e) => {
    speed === 2.0 ? setSpeed(0.5) : setSpeed(speed + 0.5);
  };

  /* REMOVE FILE BEFORE CLOSE TAB */
  /*   window.addEventListener("beforeunload", (e) => {   
    //e.preventDefault();
    if(videoId){
    let url = "http://localhost:3011/video/"+videoId;
    axios
      .delete(url)
      .then(function (response) {
      })
      .catch(function (error) {
      })
    }
  }); */

  return (
    <div className="App">
      <VideoUpload getVideoMetaData={getVideoMetaData} />

      <div className="player">
        <video ref={videoRef}>
          {videoId ? (
            <source
              src={"http://localhost:3011/video/" + videoId}
              type="video/mp4"
            ></source>
          ) : null}
          <p>Your browser does not support this video.</p>
        </video>

        <div className="progress-bar">
          <div className="progress-bar-content" style={progressBarLenght}></div>
        </div>

        <div className="time">
          {timerFormat(editCurrentTime ? editCurrentTime : time)} /{" "}
          {timerFormat(editVideoDuration ? editVideoDuration : videoDuration)}
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
        <Timeline getTimelineMetaData={getTimelineMetaData} />
      </div>
    </div>
  );
}

export default App;
